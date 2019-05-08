import { react, html } from 'https://unpkg.com/rplus';
import recursiveDependencyFetch from '../utils/recursiveDependencyFetch.js';
import formatBytes from '../utils/formatBytes.js';
import Spinner from './Spinner.js';

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

  return html`
    <aside key="aside">
      ${file
        ? html`
            <div key="path">
              <h3>File Path</h3>
              <span>./${request.file}</span>
            </div>
            <div key="size">
              <h3>File Size</h3>
              <span>${formatBytes(file.code.length)}</span>
            </div>
            <${FileList}
              title="Dependencies"
              files=${file.dependencies}
              cache=${cache}
              packageName=${`${name}@${version}`}
              key="dependencies"
            />
            <${FileList}
              title="Dependants"
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
