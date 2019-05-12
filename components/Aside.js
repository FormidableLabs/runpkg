import { react, html } from 'https://unpkg.com/rplus';
import recursiveDependencyFetch from '../utils/recursiveDependencyFetch.js';
import formatBytes from '../utils/formatBytes.js';
import Spinner from './Spinner.js';
import FileIcon from './FileIcon.js';

const pushState = url => history.pushState(null, null, url);

const FileList = ({ title, files, packageName }) => html`
  <div key=${title}>
    <h3>${title}</h3>
    <span>${files.length} Files</span>
  </div>
  <ul key=${files.join('-')}>
    ${files.map(
      x => html`
        <li key=${x.url} data-test=${title + 'Item'}>
          ${FileIcon}
          <a
            onClick=${e => {
              e.preventDefault();
              pushState(`?${x.url.replace('https://unpkg.com/', '')}`);
            }}
          >
            <span>
              ${x.url
                .replace(`https://unpkg.com/`, '')
                .replace(packageName, '')}
            </span>
            <span>${formatBytes(x.size)}</span>
          </a>
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

export default ({ packageJSON, request }) => {
  const [cache, setCache] = react.useState({});

  react.useEffect(() => {
    setCache({});
    if (request.file.match(/\/.*\..*/)) {
      console.log(`Analysing ${request.url}`);
      recursiveDependencyFetch(request.url).then(setCache);
    }
  }, [request.url]);

  const key = `https://unpkg.com/${request.url}`;
  const file = cache[key];

  if (!file)
    return html`
      <aside key="aside">
        ${Spinner}
      </aside>
    `;

  const { name, version } = packageJSON;
  // const deepDependencies = fetchDependencies(cache)(key);

  const externalDependencies = file.dependencies
    .filter(x => !x.includes(`${name}@${version}`))
    .map(x => cache[x]);

  const internalDependencies = file.dependencies
    .filter(x => x.includes(`${name}@${version}`))
    .map(x => cache[x]);

  const knownDependants = file.dependants.map(x => cache[x]);
  // <div key="imported-size">
  //   <h3>Imported Size</h3>
  //   <span
  //     >${formatBytes(
  //       file.code.length +
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
              <span>${formatBytes(file.size)}</span>
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
