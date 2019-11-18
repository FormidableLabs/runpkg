import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';
import { useStateValue } from '../utils/globalState.js';
import { parseUrl } from '../utils/parseUrl.js';

import Nav from './Nav.js';
import Article from './Article.js';
import NotFound from './NotFound.js';
import { parseDependencies } from '../utils/recursiveDependencyFetch.js';

const replaceState = url => history.replaceState(null, null, url);

export default () => {
  const [state, dispatch] = useStateValue();
  const { request, code } = state;

  // Update the request on user navigation
  react.useEffect(() => {
    const updateRequest = () => {
      dispatch({ type: 'setRequest', payload: parseUrl() });
    };
    addEventListener('popstate', updateRequest);
    const pushState = window.history.pushState;
    window.history.pushState = function() {
      pushState.apply(history, arguments);
      updateRequest();
    };
  }, []);

  // Update the page title when the request changes
  react.useEffect(() => {
    const setTitle = title => (document.title = title);
    if (state.fetchError) setTitle('404 | runpkg');
    else if (request.name && request.version)
      setTitle(request.name + '@' + request.version + ' | runpkg');
    else setTitle('runpkg | the package explorer');
  }, [request.name, request.version]);

  // Resolve full path for incomplete urls
  react.useEffect(() => {
    if (request.name && (!request.version || !request.file))
      fetch(`https://unpkg.com/${request.path}`)
        .then(({ url }) => {
          dispatch({ type: 'setRequest', payload: parseUrl(url) });
          replaceState(
            `/?${url.replace('https://unpkg.com/', '')}${location.hash}`
          );
        })
        .catch(console.error);
  }, [request.path]);

  // Fetch the code for requested file
  react.useEffect(() => {
    if (request.file) {
      dispatch({ type: 'setCode', payload: '' });
      fetch(`https://unpkg.com/${request.path}`)
        .then(async res =>
          dispatch({ type: 'setCode', payload: await res.text() })
        )
        .catch(console.error);
    }
  }, [request.file, request.path]);

  // Fetch directory listings for requested package
  react.useEffect(() => {
    if (request.name && request.version) {
      dispatch({ type: 'setDirectory', payload: {} });
      fetch(`https://unpkg.com/${request.name}@${request.version}/?meta`)
        .then(res => res.json())
        .then(res => dispatch({ type: 'setDirectory', payload: res }))
        .catch(console.error);
    }
  }, [request.name, request.version]);

  // Fetch package meta data for all versions
  react.useEffect(() => {
    if (request.name) {
      dispatch({ type: 'setVersions', payload: {} });
      fetch(`https://registry.npmjs.cf/${request.name}/`)
        .then(res => res.json())
        .then(json => dispatch({ type: 'setVersions', payload: json.versions }))
        .catch(console.error);
    }
  }, [request.name]);

  // Fetch package meta data for all versions
  react.useEffect(() => {
    if (code)
      parseDependencies('https://unpkg.com/' + request.path).then(cache =>
        dispatch({ type: 'setCache', payload: cache })
      );
  }, [code]);

  console.log(state);

  return html`
    <main className=${css`/index.css`}>
      ${state.fetchError
        ? NotFound
        : html`
            <${Article} />
            <${Nav} />
          `}
    </main>
  `;
};
