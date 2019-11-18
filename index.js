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
  request: parseUrl(),
  directory: {},
  code: '',
  versions: {},
  cache: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'setRequest':
      return { ...state, request: action.payload };
    case 'setDirectory':
      return { ...state, directory: action.payload };
    case 'setCode':
      return { ...state, code: action.payload };
    case 'setFile':
      return { ...state, file: action.payload };
    case 'setVersions':
      return { ...state, versions: action.payload };
    case 'setCache':
      return {
        ...state,
        cache: { ...state.cache, [action.payload.url]: action.payload },
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
