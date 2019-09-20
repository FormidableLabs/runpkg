import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import Dialog from './components/Overlay.js';
import Nav from './components/Nav.js';
import Article from './components/Article.js';
import Aside from './components/Aside.js';
import Footer from './components/Footer.js';
import NotFound from './components/NotFound.js';
import Search from './components/Search.js';

import RequestContext from './context/RequestContext.js';
import FileContext from './context/FileContext.js';

import fileNameRegEx from './utils/fileNameRegEx.js';

const isEmpty = obj => Object.keys(obj).length === 0;

function Home() {
  const [isSearching, setIsSearching] = react.useState(false);

  const { request } = react.useContext(RequestContext);
  const { file, fetchError } = react.useContext(FileContext);

  // function reducer(state, action) {
  //   switch (action.type) {
  //     case 'toggleIsSearching':
  //       return { ...state, isSearching: !state.isSearching };
  //     case 'setIsSearching':
  //       return { ...state, isSearching: action.payload };
  //     case 'setRequest':
  //       return {
  //         ...state,
  //         request: action.payload,
  //         isSearching: false,
  //       };
  //     case 'setFile':
  //       return { ...state, file: action.payload };
  //     case 'setFetchError':
  //       return { ...state, fetchError: action.payload };
  //     case 'setVersions':
  //       return { ...state, versions: action.payload };
  //     case 'setDependencies':
  //       return { ...state, dependencyState: action.payload };
  //     default:
  //       return { ...state };
  //   }
  // }

  // const [state, dispatch] = react.useReducer(reducer, {
  //   isSearching: false,
  //   request: parseUrl(),
  //   file: {},
  //   fetchError: false,
  //   versions: [],
  //   dependencyState: {},
  // });

  react.useEffect(() => {
    const check = e => {
      if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearching(true);
      }
      if (e.key === 'Escape') setIsSearching(false);
    };
    window.addEventListener('keydown', check);
  }, []);

  react.useEffect(() => {
    if (fetchError) {
      document.title = '404 | runpkg';
    } else if (request && request.package) {
      document.title = request.package + ' | runpkg';
    } else {
      document.title = 'runpkg | the package explorer';
    }
  }, [request.url, fetchError]);

  console.log(request);
  return html`
    <main className=${css`/index.css`}>
      ${fetchError
        ? NotFound
        : isSearching
        ? html`
            <${Search} isSearching=${isSearching} />
          `
        : !request.url
        ? Dialog
        : isEmpty(file)
        ? null
        : html`
            <${Nav} />
            <${Article} />
            <${Aside} />
            <${Footer} />
          `}
    </main>
  `;
}

export default Home;
