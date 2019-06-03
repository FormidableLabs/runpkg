import { react, html } from 'https://unpkg.com/rplus-production@1.0.0';
import recursiveDependencyFetch from '../utils/recursiveDependencyFetch.js';
import Link from './Link.js';
import formatBytes from '../utils/formatBytes.js';
import Spinner from './Spinner.js';
import FileIcon from './FileIcon.js';

const FileList = ({ title, files, packageName }) => html`
  <div key=${title}>
    <h3>${title}</h3>
    <span>${files.length} Files</span>
  </div>
  <ul key=${files.join('-')}>
    ${files.map(
      x => html`
        <li key=${x.url} data-test="Item">
          ${FileIcon}
          <${Link}
            href=${x.url.replace('https://unpkg.com/', '/?')}
            innerText=${x.url
              .replace(`https://unpkg.com/`, '')
              .replace(packageName, '')}
          />
          <span>${formatBytes(x.size)}</span>
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

export default ({ file }) => {
  const [cache, setCache] = react.useState({});

  react.useEffect(() => {
    setCache({});
    // Match breaks this ?enhanced-resolve@4.1.0/lib/NodeJsInputFileSystem
    // No match breaks preact@8.4.2/devtools
    if (file.url) {
      console.log(`Analysing ${file.url}`);
      recursiveDependencyFetch(file.url).then(setCache);
    }
  }, [file.url]);

  const target = cache[file.url];

  if (!target)
    return html`
      <aside key="aside">
        ${Spinner}
      </aside>
    `;

  const { name, version } = file.pkg;
  // const deepDependencies = fetchDependencies(cache)(key);

  const externalDependencies = target.dependencies
    .filter(x => !x.includes(`${name}@${version}`))
    .map(x => cache[x]);

  const internalDependencies = target.dependencies
    .filter(x => x.includes(`${name}@${version}`))
    .map(x => cache[x]);

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

  return html`
    <aside key="aside">
      ${file
        ? html`
            <h1>Static Analysis</h1>
            <p>
              This is all the information we have derived from the contents of
              this file as well as any previously explored files.
            </p>
            <div key="filesize">
              <h3>File Size</h3>
              <span>${formatBytes(target.size)}</span>
            </div>
            <${FileList}
              title="External Dependencies"
              files=${externalDependencies}
              key="external_dependencies"
              packageName=${`${name}@${version}`}
            />
            <${FileList}
              title="Internal Dependencies"
              files=${internalDependencies}
              key="internal_dependencies"
              packageName=${`${name}@${version}`}
            />
            <${FileList}
              title="Known Dependants"
              files=${knownDependants}
              key="dependants"
              packageName=${`${name}@${version}`}
            />
          `
        : Spinner}
    </aside>
  `;
};
