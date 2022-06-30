import { registerSW } from 'virtual:pwa-register';

import { html } from './utils/rplus.js';
import { StateProvider } from './utils/globalState.js';
import { parseUrl } from './utils/parseUrl.js';

import Main from './components/Main.js';
import { createRoot } from 'react-dom/client';

if ('serviceWorker' in navigator) {
  registerSW();
}

const initialState = {
  packages: [],
  packagesSearchTerm: '',
  fileSearchTerm: '',
  noUrlPackageFound: '',
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
      return {
        ...state,
        noUrlPackageFound: '',
        request: action.payload,
        mode: !action.payload.name ? 'registry' : state.mode,
      };
    case 'setNoURLPackageFound':
      return { ...state, noUrlPackageFound: action.payload };
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

createRoot(document.getElementById('root')).render(
  html`
    <${App} />
  `
);
