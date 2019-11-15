import { css, react, html } from 'https://unpkg.com/rplus-production@1.0.0';
import recursiveDependencyFetch from '../utils/recursiveDependencyFetch.js';
import Link from './Link.js';
import formatBytes from '../utils/formatBytes.js';
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

export const FileOverview = ({ file, dispatch }) => {
  const [cache, setCache] = react.useState({});
  const [searchTerm, setSearchTerm] = react.useState('');

  react.useEffect(() => {
    if (file.url) {
      console.log(`Analysing ${file.url}`);
      recursiveDependencyFetch(file.url).then(x => {
        setCache(x);
        dispatch({ type: 'setDependencies', payload: x });
      });
    }
  }, [file.url]);

  const target = cache[file.url] || {
    dependencies: [],
    dependants: [],
    size: 0,
  };

  const { name, version } = file.pkg;
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
        <small>${target.size ? formatBytes(target.size) : 'calculating'}</small>
      </div>
      <${FileList}
        title="Dependencies"
        files=${dependencies}
        key="dependencies"
        packageName=${`${name}@${version}`}
        filter=${searchTerm}
      />
      <${FileList}
        title="Known Dependants"
        files=${knownDependants}
        key="dependants"
        packageName=${`${name}@${version}`}
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
