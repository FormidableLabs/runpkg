import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import Providers from './context/index.js';

import Home from './Home.js';

// const isEmpty = obj => Object.keys(obj).length === 0;

// // For now, add warning in console if popular bundler detected
// const warnAboutBundler = pkgJSON => {
//   if (
//     pkgJSON.scripts instanceof Object &&
//     Object.values(pkgJSON.scripts).some(
//       x =>
//         x.startsWith('rollup') ||
//         x.startsWith('webpack') ||
//         x.startsWith('parcel')
//     )
//   ) {
//     console.warn(
//       'Bundler (rollup, webpack or parcel) detected in package.json. File path resoltion may not work as expected on runpkg.'
//     );
//   }
// };

// console.log('hi');

// const Home = () => {
//   function reducer(state, action) {
//     switch (action.type) {
//       case 'toggleIsSearching':
//         return { ...state, isSearching: !state.isSearching };
//       case 'setIsSearching':
//         return { ...state, isSearching: action.payload };
//       case 'setRequest':
//         return {
//           ...state,
//           request: action.payload,
//           isSearching: false,
//         };
//       case 'setFile':
//         return { ...state, file: action.payload };
//       case 'setFetchError':
//         return { ...state, fetchError: action.payload };
//       case 'setVersions':
//         return { ...state, versions: action.payload };
//       case 'setDependencies':
//         return { ...state, dependencyState: action.payload };
//       default:
//         return { ...state };
//     }
//   }

//   // const [state, dispatch] = react.useReducer(reducer, {
//   //   isSearching: false,
//   //   request: parseUrl(),
//   //   file: {},
//   //   fetchError: false,
//   //   versions: [],
//   //   dependencyState: {},
//   // });

//   react.useEffect(() => {
//     const check = e => {
//       if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault();
//         dispatch({ type: 'toggleIsSearching' });
//       }
//       if (e.key === 'Escape')
//         dispatch({ type: 'setIsSearching', payload: false });
//     };
//     window.addEventListener('keydown', check);
//   }, []);

//   react.useEffect(() => {
//     if (state.fetchError) {
//       document.title = '404 | runpkg';
//     } else if (state.request && state.request.package) {
//       document.title = state.request.package + ' | runpkg';
//     } else {
//       document.title = 'runpkg | the package explorer';
//     }
//   }, [state.request.url, state.fetchError]);

//   return html`
//     <main className=${css`/index.css`}>
//       ${state.fetchError
//         ? NotFound
//         : state.isSearching
//         ? html`
//             <${Search} isSearching=${state.isSearching} />
//           `
//         : !state.request.url
//         ? Dialog
//         : isEmpty(state.file)
//         ? null
//         : html`
//             <${Nav} versions=${state.versions} file=${state.file} />
//             <${Article}
//               file=${state.file}
//               dependencyState=${state.dependencyState}
//             />
//             <${Aside} file=${state.file} />
//             <${Footer} />
//           `}
//     </main>
//   `;
// };

react.render(
  html`
    <${Providers}>
      <${Home} />
    </${Providers}>
  `,
  document.body
);
