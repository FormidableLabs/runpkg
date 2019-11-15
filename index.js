import { react, html } from 'https://unpkg.com/rplus-production@1.0.0';
import { StateProvider } from './utils/globalState.js';
import fileNameRegEx from './utils/fileNameRegEx.js';
import Main from './components/Main.js';

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

const App = () => {
  const initialState = {
    request: parseUrl(),
    file: {},
    fetchError: false,
    versions: [],
    dependencyState: {},
  };
  function reducer(state, action) {
    switch (action.type) {
      case 'setRequest':
        return { ...state, request: action.payload };
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
  return html`
    <${StateProvider} initialState=${initialState} reducer=${reducer}>
      <${Main} />
    <//>
  `;
};

react.render(
  html`
    <${App} />
  `,
  document.body
);
