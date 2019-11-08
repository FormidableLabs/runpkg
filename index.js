import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import Dialog from './components/Overlay.js';
import Nav from './components/Nav.js';
import Article from './components/Article.js';
import Aside from './components/Aside.js';
import Footer from './components/Footer.js';
import NotFound from './components/NotFound.js';
import Search from './components/Search.js';

import fileNameRegEx from './utils/fileNameRegEx.js';

const isEmpty = obj => Object.keys(obj).length === 0;
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

const Home = () => {
  function reducer(state, action) {
    switch (action.type) {
      case 'toggleIsSearching':
        return { ...state, isSearching: !state.isSearching };
      case 'setIsSearching':
        return { ...state, isSearching: action.payload };
      case 'setRequest':
        return {
          ...state,
          request: action.payload,
          isSearching: false,
        };
      case 'setFile':
        return { ...state, file: action.payload };
      case 'setFetchError':
        return { ...state, fetchError: action.payload };
      case 'setVersions':
        return { ...state, versions: action.payload };
      case 'setDependencies':
        return { ...state, dependencyState: action.payload };
      default:
        return { ...state };
    }
  }

  const [state, dispatch] = react.useReducer(reducer, {
    isSearching: false,
    request: parseUrl(),
    file: {},
    fetchError: false,
    versions: [],
    dependencyState: {},
  });
  react.useEffect(() => {
    const check = e => {
      if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        dispatch({ type: 'toggleIsSearching' });
      }
      if (e.key === 'Escape')
        dispatch({ type: 'setIsSearching', payload: false });
    };
    window.addEventListener('keydown', check);
  }, []);

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
  }, []);

  react.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('./serviceWorker.js')
        .then(function(registration) {
          console.log('service worker registered');
        })
        .catch(function(err) {
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
        replaceState(`?${url.replace('https://unpkg.com/', '')}`);
        try {
          const versions = await fetch(
            `https://registry.npmjs.cf/${request.package.split('@')[0]}/`
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
    if (state.fetchError) {
      document.title = '404 | runpkg';
    } else if (state.request && state.request.package) {
      document.title = state.request.package + ' | runpkg';
    } else {
      document.title = 'runpkg | the package explorer';
    }
  }, [state.request.url, state.fetchError]);

  return html`
    <main className=${css`/index.css`}>
      ${state.fetchError
        ? NotFound
        : state.isSearching
        ? html`
            <${Search} isSearching=${state.isSearching} dispatch=${dispatch} />
          `
        : !state.request.url
        ? Dialog
        : isEmpty(state.file)
        ? null
        : html`
            <${Nav}
              versions=${state.versions}
              file=${state.file}
              dispatch=${dispatch}
            />
            <${Article}
              file=${state.file}
              dependencyState=${state.dependencyState}
            />
            <${Aside} dispatch=${dispatch} file=${state.file} />
            <${Footer} />
          `}
    </main>
  `;
};

react.render(
  html`
    <${Home} />
  `,
  document.body
);
