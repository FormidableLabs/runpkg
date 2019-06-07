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

// Initialise context for passing cache from Aside to Article

export const DependencyContext = react.createContext(null);

const DependencyContextProvider = props => {
  const [dependencyState, setdependencyState] = react.useState({});

  // This useEffect makes sure that our context updates with the file
  // updates, otherwise this results in our editor trying to determine
  // dependencies with an out of date file.url

  react.useEffect(() => {
    setdependencyState(state => ({ ...state }));
  }, [props.file]);
  return html`
       <${DependencyContext.Provider} value=${[
    dependencyState,
    setdependencyState,
  ]}>
${props.children}
              </${DependencyContext.Provider}>
        `;
};

const Home = () => {
  const [request, setRequest] = react.useState(parseUrl());
  const [file, setFile] = react.useState({});
  const [fetchError, setFetchError] = react.useState(false);
  const [versions, setVersions] = react.useState([]);

  function reducer(state, action) {
    switch (action.type) {
      case 'toggle':
        return { isSearching: !state.isSearching };
      case 'open':
        return { isSearching: true };
      case 'close':
        return { isSearching: false };
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = react.useReducer(reducer, { isSearching: false });

  react.useEffect(() => {
    const check = e => {
      if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        dispatch({ type: 'toggle' });
      }
      if (e.key === 'Escape') dispatch({ type: 'close' });
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
        dispatch({ type: 'close' });
        setRequest(parseUrl());
      };
    });
    // Rerender when the back and forward buttons are pressed
    addEventListener('popstate', () => setRequest(parseUrl()));
  }, []);

  // Whenever the URL changes then:
  // 1. Resolve the unpkg url and file contents for the request url
  // 2. Fetch the package.json for the requested package
  // 3. Fetch the /?meta for the requested package
  react.useEffect(() => {
    // Reset any previous state
    if (!request.package) {
      setFile({});
      setFetchError(false);
    }
    if (request.package) {
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
        setFile({ url, meta, pkg, code });
        replaceState(`?${url.replace('https://unpkg.com/', '')}`);
        try {
          var parser = new DOMParser();
          const unpkgPage = await fetch(
            `https://unpkg.com/${request.package}/`
          ).then(async res =>
            parser.parseFromString(await res.text(), 'text/html')
          );

          const scriptElements = unpkgPage.getElementsByTagName('script');

          setVersions(
            JSON.parse(
              `${
                Object.values(scriptElements)
                  .filter(x => x.innerHTML.includes('window.__DATA__'))[0]
                  .innerHTML.split('window.__DATA__ = ')[1]
              }`
            ).availableVersions
          );
        } catch (err) {
          console.log('error in version parser');
          console.log(err);
        }
      })();
    }
  }, [request.url]);

  react.useEffect(() => {
    if (fetchError) {
      document.title = '404 | runpkg';
    } else if (request && request.package) {
      document.title = request.package + ' | runpkg';
    } else {
      document.title = 'runpkg | the package explorer';
    }
  }, [request.url, fetchError]);

  react.useEffect(() => {
    const check = e => {
      if (e.key === 'p' && e.metaKey) {
        e.preventDefault();
        setIsSearching(true);
      }
      if (e.key === 'Escape') setIsSearching(false);
    };
    window.addEventListener('keydown', check);
  }, []);

  return html`
    <main className=${css`/index.css`}>
      ${fetchError
        ? NotFound
        : state.isSearching
        ? html`
            <${Search} isSearching=${state.isSearching} dispatch=${dispatch} />
          `
        : !request.url
        ? Dialog
        : isEmpty(file)
        ? null
        : html`
              <${Nav} versions=${versions} file=${file} dispatch=${dispatch}/>    
              <${DependencyContextProvider} file=${file}>
              <${DependencyContext.Consumer}>
                ${([dependencyState]) =>
                  html`
                    <${Article}
                      file=${file}
                      dependencyState=${dependencyState}
                    />
                  `}
              </${DependencyContext.Consumer}>
              <${Aside} file=${file} />
              </${DependencyContextProvider}>
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
