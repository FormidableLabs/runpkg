import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import RequestContext from './RequestContext.js';

const FileContext = react.createContext({
  file: {
    url: '',
    meta: '',
    pkg: '',
    code: '',
  },
  fetchError: null,
  setFile: () => {},
});

export function Provider({ children }) {
  const request = {};
  const [file, setFile] = react.useState({
    url: '',
    meta: null,
    pkg: '',
    code: '',
  });
  const [fetchError, setFetchError] = react.useState(false);

  // Whenever the URL changes then:
  // 1. Resolve the unpkg url and file contents for the request url
  // 2. Fetch the package.json for the requested package
  // 3. Fetch the /?meta for the requested package
  react.useEffect(() => {
    // Reset any previous state
    if (!request.package) {
      setFile({});
    }
    if (request.package) {
      const { request } = state;
      (async () => {
        // Fetch the file contents and check for redirect
        const { url, code } = await fetch(
          `https://unpkg.com/${request.url}`
        ).then(async res => ({
          code: (await res.text()).replace(/\t/g, '  '),
          url: res.url,
        }));
        // Fetch the meta data
        const meta = await fetch(`https://unpkg.com/${request.package}/?meta`)
          .then(res => res.json())
          .catch(() => setFetchError(true));
        // Fetch the package json
        const pkg = await fetch(
          `https://unpkg.com/${request.package}/package.json`
        )
          .then(res => res.json())
          .catch(() => setFetchError(true));

        if (pkg) warnAboutBundler(pkg);

        // Set the new state
        setFile({
          url,
          meta,
          pkg,
          code,
        });
        history.replaceState(
          null,
          null,
          `?${url.replace('https://unpkg.com/', '')}`
        );
        // TODO: move to versions component
        // try {
        //   var parser = new DOMParser();
        //   const unpkgPage = await fetch(
        //     `https://unpkg.com/${request.package}/`
        //   ).then(async res =>
        //     parser.parseFromString(await res.text(), 'text/html')
        //   );

        //   const scriptElements = unpkgPage.getElementsByTagName('script');

        //   dispatch({
        //     type: 'setVersions',
        //     payload: JSON.parse(
        //       `${
        //         Object.values(scriptElements)
        //           .filter(x => x.innerHTML.includes('window.__DATA__'))[0]
        //           .innerHTML.split('window.__DATA__ = ')[1]
        //       }`
        //     ).availableVersions,
        //   });
        // } catch (err) {
        //   console.log('error in version parser');
        //   console.log(err);
        // }
      })();
    }
  }, [request.url]);

  return html`
    <${FileContext.Provider}
      value=${{
        file,
        setFile,
        fetchError,
      }}
    >
      ${children}
    </${FileContext.Provider}>
  `;
}

export const Consumer = FileContext.Consumer;
export default FileContext;
// {
//   Provider: FileContextProvider,
//   Consumer: FileContext.Consumer
// }
