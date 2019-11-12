import { css, react, html } from 'https://unpkg.com/rplus-production@1.0.0';
import recursiveDependencyFetch from '../utils/recursiveDependencyFetch.js';
import Link from './Link.js';
import formatBytes from '../utils/formatBytes.js';
import Spinner from './Spinner.js';
import FileIcon from './FileIcon.js';

import { styles as fileStyles } from './PackageOverview.js';

const FileList = ({ title, files, packageName }) => html`
  <div key=${title}>
    <h2>${title}</h2>
    <small>${files.length} Files</small>
  </div>
  <ul className=${fileStyles.directory} key=${files.join('-')}>
    ${files.map(
      x => html`
        <li key=${x.url} data-test="Item">
          ${FileIcon}
          <${Link} href=${x.url.replace('https://unpkg.com/', '/?')}>
            ${x.url.replace(`https://unpkg.com/`, '').replace(packageName, '')}
          <//>
          <small>${formatBytes(x.size)}</small>
        </li>
      `
    )}
  </ul>
`;

// const fetchDependencies = all => key =>
//   all[key].dependencies.reduce(
//     (deps, dep) => ({
//       ...deps,
//       [dep]: all[dep],
//       ...(all[key].dependencies ? fetchDependencies(all)(dep) : {}),
//     }),
//     {}
//   );

export const FileOverview = ({ file, dispatch }) => {
  const [cache, setCache] = react.useState({});

  react.useEffect(() => {
    setCache({});
    // Match breaks this ?enhanced-resolve@4.1.0/lib/NodeJsInputFileSystem
    // No match breaks preact@8.4.2/devtools
    if (file.url) {
      console.log(`Analysing ${file.url}`);
      recursiveDependencyFetch(file.url).then(x => {
        // Side effects for setting various caches
        //eslint-disable-next-line no-unused-expressions
        setCache(x);
        dispatch({ type: 'setDependencies', payload: x });
      });
    }
  }, [file.url]);

  const target = cache[file.url];

  if (!target) return Spinner;

  const { name, version } = file.pkg;
  // const deepDependencies = fetchDependencies(cache)(key);

  const dependencies = target.dependencies.map(x => cache[x[1]]);
  // const externalDependencies = target.dependencies
  //   .filter(x => !x[1].includes(`${name}@${version}`))
  //   .map(x => cache[x[1]]);

  // const internalDependencies = target.dependencies
  //   .filter(x => x[1].includes(`${name}@${version}`))
  //   .map(x => cache[x[1]]);

  const knownDependants = target.dependants.map(x => cache[x]);
  // <div key="imported-size">
  //   <h3>Imported Size</h3>
  //   <span
  //     >${formatBytes(
  //       target.code.length +
  //         Object.values(deepDependencies).reduce(
  //           (a, b) => a + b.code.length,
  //           0
  //         )
  //     )}</span
  //   >
  // </div>

  return file
    ? html`
        <div className=${styles}>
          <div key="filesize">
            <h2>File Size</h2>
            <span>${formatBytes(target.size)}</span>
          </div>
          <${FileList}
            title="Dependencies"
            files=${dependencies}
            key="dependencies"
            packageName=${`${name}@${version}`}
          />
          <${FileList}
            title="Known Dependants"
            files=${knownDependants}
            key="dependants"
            packageName=${`${name}@${version}`}
          />
        </div>
      `
    : Spinner;
};

const styles = css`
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    small {
      margin-left: auto;
    }
  }
  > * + * {
    margin-top: 0.62rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  > *:empty {
    display: none;
  }
`;
