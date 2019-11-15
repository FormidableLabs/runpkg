import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';
import { useStateValue } from '../utils/globalState.js';

import Nav from './Nav.js';
import Article from './Article.js';
import NotFound from './NotFound.js';
import fileNameRegEx from '../utils/fileNameRegEx.js';

const replaceState = url => history.replaceState(null, null, url);
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

// For now, add warning in console if popular bundler detected
const warnAboutBundler = pkgJSON => {
  if (
    pkgJSON.scripts instanceof Object &&
    Object.values(pkgJSON.scripts).some(
      x =>
        x.startsWith('rollup') ||
        x.startsWith('webpack') ||
        x.startsWith('parcel')
    )
  ) {
    console.warn(
      'Bundler (rollup, webpack or parcel) detected in package.json. File path resoltion may not work as expected on runpkg.'
    );
  }
};

export default () => {
  const [state, dispatch] = useStateValue();

  // Runs once and subscribes to url changes
  react.useEffect(() => {
    // Rerender the app when pushState is called
    ['pushState'].map(event => {
      const original = window.history[event];
      window.history[event] = function() {
        original.apply(history, arguments);
        dispatch({ type: 'setRequest', payload: parseUrl() });
      };
    });
    // Rerender when the back and forward buttons are pressed
    addEventListener('popstate', () =>
      dispatch({ type: 'setRequest', payload: parseUrl() })
    );

    if (!state.request.url) {
      replaceState('?lodash-es');
      dispatch({ type: 'setRequest', payload: parseUrl() });
    }
  }, []);

  react.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('./serviceWorker.js')
        .then(() => {
          console.log('service worker registered');
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  // Whenever the URL changes then:
  // 1. Resolve the unpkg url and file contents for the request url
  // 2. Fetch the package.json for the requested package
  // 3. Fetch the /?meta for the requested package
  react.useEffect(() => {
    // Reset any previous state
    if (!state.request.package) {
      dispatch({ type: 'setFile', payload: {} });
      dispatch({ type: 'setFetchError', payload: false });
    }
    if (state.request.package) {
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
          .catch(() => dispatch({ type: 'setFetchError', payload: true }));
        // Fetch the package json
        const pkg = await fetch(
          `https://unpkg.com/${request.package}/package.json`
        )
          .then(res => res.json())
          .catch(() => dispatch({ type: 'setFetchError', payload: true }));

        if (pkg) warnAboutBundler(pkg);

        // Set the new state
        dispatch({ type: 'setFile', payload: { url, meta, pkg, code } });
        replaceState(
          `?${url.replace('https://unpkg.com/', '')}${location.hash}`
        );
        try {
          const versions = await fetch(
            `https://registry.npmjs.cf/${
              request.package.startsWith('@')
                ? '@' + request.package.slice(1).split('@')[0]
                : request.package.split('@')[0]
            }/`
          )
            .then(res => res.json())
            .then(json => Object.keys(json.versions));

          dispatch({
            type: 'setVersions',
            payload: versions,
          });
        } catch (err) {
          console.log('error in version fetching');
          console.log(err);
        }
      })();
    }
  }, [state.request.url]);

  react.useEffect(() => {
    const setTitle = title => (document.title = title);
    const { fetchError, request = {} } = state;
    if (fetchError) setTitle('404 | runpkg');
    else if (request.package) setTitle(request.package + ' | runpkg');
    else setTitle('runpkg | the package explorer');
  }, [state.request.url, state.fetchError]);

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