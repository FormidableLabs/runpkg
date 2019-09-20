import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import fileNameRegEx from '../utils/fileNameRegEx.js';

const parseUrl = (
  search = window.location.search.slice(1).replace(/\/$/, '')
) => ({
  url: search,
  package: search.startsWith('@')
    ? search
        .split('/')
        .slice(0, 2)
        .join('/')
    : search.split('/')[0],
  folder: search.replace(fileNameRegEx, ''),
  file: search
    .split('/')
    .slice(1)
    .join('/'),
});

const RequestContext = react.createContext({
  request: {
    url: '',
    package: '',
    folder: '',
    file: '',
  },
  setRequest: () => {},
});

export function Provider({ children }) {
  const [request, setRequest] = react.useState(parseUrl());

  react.useEffect(() => {
    // monkey patch history.pushState to also parse the new
    // url when called
    const original = window.history.pushState;
    window.history.pushState = function() {
      console.log('pushstate');
      original.apply(history, arguments);
      setRequest(parseUrl());
    };

    // Rerender when the back and forward buttons are pressed
    addEventListener('popstate', () => {
      const parsedUrl = parseUrl();
      console.log(parsedUrl);
      setRequest(parsedUrl);
    });
  }, []);

  return html`
    <${RequestContext.Provider} value=${{
    request,
    setRequest,
  }}>
      ${children}
    </${RequestContext.Provider}>
  `;
}

export const Consumer = RequestContext.Consumer;
export default RequestContext;

// export const RequestContextConsumer = RequestContext.Consumer;
