import { css, react, html } from 'https://unpkg.com/rplus-production@1.0.0';
import recursiveDependencyFetch from '../utils/recursiveDependencyFetch.js';
import Link from './Link.js';
import formatBytes from '../utils/formatBytes.js';
import { useStateValue } from '../utils/globalState.js';
import FileIcon from './FileIcon.js';
import { SearchInput } from './SearchInput.js';
import { styles as fileStyles } from './PackageOverview.js';

const FileList = ({ title, files, packageName, filter }) => html`
  <div key=${title}>
    <h2>${title}</h2>
    <small>${files.length} Files</small>
  </div>
  <ul className=${fileStyles.directory} key=${files.join('-')}>
    ${files
      .filter(x => x.url.match(filter))
      .map(
        x => html`
          <li key=${x.url} data-test="Item">
            ${FileIcon}
            <${Link} href=${x.url.replace('https://unpkg.com/', '/?')}>
              ${x.url
                .replace(`https://unpkg.com/`, '')
                .replace(packageName, '')}
            <//>
            <small>${formatBytes(x.size)}</small>
          </li>
        `
      )}
  </ul>
`;

export const FileOverview = () => {
  const [{ request, code }, dispatch] = useStateValue();
  const [cache, setCache] = react.useState({});
  const [searchTerm, setSearchTerm] = react.useState('');

  if (!request.file) return null;

  react.useEffect(() => {
    if (request.path) {
      console.log(`Analysing ${request.path}`);
      recursiveDependencyFetch('https://unpkg.com/' + request.path).then(x => {
        setCache(x);
        dispatch({ type: 'setDependencies', payload: x });
      });
    }
  }, [request.path]);

  const target = cache['https://unpkg.com/' + request.path] || {
    dependencies: [],
    dependants: [],
  };

  const dependencies = target.dependencies.map(x => cache[x[1]]);
  const knownDependants = target.dependants.map(x => cache[x]);

  return html`
    <${SearchInput}
      placeholder="Search for dependencies.."
      value=${searchTerm}
      onChange=${setSearchTerm}
    />
    <div className=${styles}>
      <div key="filesize">
        <h2>File Size</h2>
        <small>${formatBytes(code.length)}</small>
      </div>
      <${FileList}
        title="Dependencies"
        files=${dependencies}
        key="dependencies"
        packageName=${`${request.name}@${request.version}`}
        filter=${searchTerm}
      />
      <${FileList}
        title="Known Dependants"
        files=${knownDependants}
        key="dependants"
        packageName=${`${request.name}@${request.version}`}
        filter=${searchTerm}
      />
    </div>
  `;
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
    border-top: 1px solid rgba(0, 0, 0, 0.2);
  }
  > *:empty {
    display: none;
  }
`;
