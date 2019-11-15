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

const App = () => {
  const initialState = {
    request: parseUrl(),
    code: '',
    file: {},
    directory: {},
    fetchError: false,
    versions: {},
    dependencyState: {},
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
