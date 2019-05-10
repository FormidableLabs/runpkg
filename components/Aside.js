import { react, html } from 'https://unpkg.com/rplus';
import recursiveDependencyFetch from '../utils/recursiveDependencyFetch.js';
import formatBytes from '../utils/formatBytes.js';
import Spinner from './Spinner.js';
import FileIcon from './FileIcon.js';
import dependenciesSizeCalculator from '../utils/dependenciesSizeCalculator.js';

const pushState = url => history.pushState(null, null, url);

const FileList = ({ title, files, cache, packageName }) => html`
  <div key=${title}>
    <h3>${title}</h3>
    <span>${files.length} Files</span>
  </div>
  <ul key=${files.join('-')}>
    ${files.map(
      x => html`
        <li key=${x} data-test=${title + 'Item'}>
          ${FileIcon}
          <a
            onClick=${e => {
              e.preventDefault();
              pushState(`?${x.replace('https://unpkg.com/', '')}`);
            }}
          >
            <span>
              ${x.replace(`https://unpkg.com/`, '').replace(packageName, '')}
            </span>
            <span>${formatBytes(cache[x].code.length)}</span>
          </a>
        </li>
      `
    )}
  </ul>
`;

export default ({ packageJSON, request }) => {
  const [cache, setCache] = react.useState({});

  // Runs when file changes + fetches dependencies.
  react.useEffect(() => {
    if (packageJSON.name && request.file) {
      setCache({});
      /* Fetch all files in this module */
      console.log(`Recursively fetching ${request.url}`);
      recursiveDependencyFetch(packageJSON, request.url).then(setCache);
    }
  }, [packageJSON.name, request.file]);
  const file = cache[`https://unpkg.com/${request.url}`];
  const { name, version } = packageJSON;

  let dependenciesSize;

  if (file && file.dependencies) {
    dependenciesSize = dependenciesSizeCalculator(cache, file.dependencies);
  }

  return html`
    <aside key="aside">
      ${file
        ? html`
            <h1>Static Analysis</h1>
            <p>
              This is all the information we have derived from the contents of
              this file as well as any previously explored files.
            </p>
            <div key="size">
              <h3>Individual File Size</h3>
              <span>${formatBytes(file.code.length)}</span>
            </div>
            ${dependenciesSize &&
              html`
                <div key="size">
                  <h3>Imports Size</h3>
                  <span>${formatBytes(dependenciesSize)}</span>
                </div>
              `}
            <${FileList}
              title="External Dependencies"
              files=${file.dependencies.filter(
                x => !x.includes(`${name}@${version}`)
              )}
              cache=${cache}
              packageName=${`${name}@${version}`}
              key="external_dependencies"
            />
            <${FileList}
              title="Local Dependencies"
              files=${file.dependencies.filter(x =>
                x.includes(`${name}@${version}`)
              )}
              cache=${cache}
              packageName=${`${name}@${version}`}
              key="local_dependencies"
            />
            <${FileList}
              title="Known Dependants"
              files=${file.dependants}
              cache=${cache}
              packageName=${`${name}@${version}`}
              key="dependants"
            />
          `
        : Spinner}
    </aside>
  `;
};
