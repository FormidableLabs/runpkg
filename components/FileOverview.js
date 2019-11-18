import { css, react, html } from 'https://unpkg.com/rplus-production@1.0.0';
import Link from './Link.js';
import formatBytes from '../utils/formatBytes.js';
import { useStateValue } from '../utils/globalState.js';
import FileIcon from './FileIcon.js';
import { SearchInput } from './SearchInput.js';
import { styles as fileStyles } from './PackageOverview.js';

const FileList = ({ title, files }) => html`
  <div key=${title}>
    <h2>${title}</h2>
    <small>${files.length} Files</small>
  </div>
  <ul className=${fileStyles.directory}>
    ${Object.entries(files).map(
      ([key, url]) => html`
        <li key=${url} data-test="Item">
          ${FileIcon}
          <${Link} href=${url.replace('https://unpkg.com/', '/?')}>
            ${key}
          <//>
        </li>
      `
    )}
  </ul>
`;

export const FileOverview = () => {
  const [{ request, cache }] = useStateValue();
  const [searchTerm, setSearchTerm] = react.useState('');
  const file = cache['https://unpkg.com/' + request.path];

  console.log(file);

  if (!file) return null;

  return (
    file &&
    html`
      <${SearchInput}
        placeholder="Search for dependencies.."
        value=${searchTerm}
        onChange=${setSearchTerm}
      />
      <div className=${styles}>
        <div key="filesize">
          <h2>File Size</h2>
          <small>${formatBytes(file.size)}</small>
        </div>
        <${FileList}
          title="Dependencies"
          files=${file.dependencies}
          key="dependencies"
          packageName=${`${request.name}@${request.version}`}
          filter=${searchTerm}
        />
      </div>
    `
  );
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
