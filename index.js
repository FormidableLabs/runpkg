import { react, html } from 'https://unpkg.com/rplus-production@1.0.0';
import { StateProvider } from './utils/globalState.js';
import { parseUrl } from './utils/parseUrl.js';

import Main from './components/Main.js';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./serviceWorker.js')
    .then(() => console.log('[runpkg] service worker registered'))
    .catch(err => console.log(err));
}

const initialState = {
  packages: [],
  packagesSearchTerm: '',
  fileSearchTerm: '',
  dependencySearchTerm: '',
  request: parseUrl(),
  directory: {},
  versions: {},
  cache: {},
  mode: 'registry',
};

function reducer(state, action) {
  switch (action.type) {
    case 'setMode':
      return { ...state, mode: action.payload };
    case 'setPackages':
      return { ...state, packages: action.payload };
    case 'setPackagesSearchTerm':
      return { ...state, packagesSearchTerm: action.payload };
    case 'setFileSearchTerm':
      return { ...state, fileSearchTerm: action.payload };
    case 'setDependencySearchTerm':
      return { ...state, dependencySearchTerm: action.payload };
    case 'setRequest':
      return { ...state, request: action.payload };
    case 'setDirectory':
      return { ...state, directory: action.payload };
    case 'setFile':
      return { ...state, file: action.payload };
    case 'setVersions':
      return { ...state, versions: action.payload };
    case 'setCache':
      return {
        ...state,
        cache: { ...state.cache, ...action.payload },
      };
    default:
      return { ...state };
  }
}

const App = () => html`
  <${StateProvider} initialState=${initialState} reducer=${reducer}>
    <${Main} />
  <//>
`;

react.render(
  html`
    <${App} />
  `,
  document.body
);
