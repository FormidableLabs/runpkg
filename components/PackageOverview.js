import { html, css, react } from 'https://unpkg.com/rplus-production@1.0.0';
import { SearchInput } from './SearchInput.js';
import FolderIcon from './FolderIcon.js';
import FileIcon from './FileIcon.js';
import Link from './Link.js';
import { useStateValue } from '../utils/globalState.js';
import { Package } from './RegistryOverview.js';
import formatBytes from '../utils/formatBytes.js';
import pushState from '../utils/pushState.js';

const isEmpty = obj => Object.keys(obj).length === 0;

const File = ({ packageName, meta, parent, version }) => {
  return html`
    <li key=${meta.path}>
      ${FileIcon}
      <${Link} href=${`/?${packageName}@${version}${meta.path}`}>
        ${meta.path.replace(parent.path, '')}
      <//>
      <small>${formatBytes(meta.size)}</small>
    </li>
  `;
};

const Directory = ({ packageName, rootMeta, version, filter }) => html`
  <ul className=${styles.directory}>
    ${rootMeta.path &&
      rootMeta.path !== '/' &&
      html`
        <div>
          ${FolderIcon}
          <h2>${rootMeta.path.slice(1)}</h2>
          <small>${rootMeta.files.length} Files</small>
        </div>
      `}
    ${rootMeta.files
      .filter(meta => meta.path.toLowerCase().match(filter))
      .map(meta =>
        meta.type === 'file'
          ? File({ meta, parent: rootMeta, version, packageName, filter })
          : Directory({ rootMeta: meta, version, packageName, filter })
      )}
  </ul>
`;

export const PackageOverview = () => {
  const [searchTerm, setSearchTerm] = react.useState('');
  const [{ file, versions }] = useStateValue();

  if (isEmpty(file)) return null;

  const {
    pkg: { name, version, description },
    meta,
  } = file;

  const handleVersionChange = v => pushState(`?${name}@${v}`);
  const VersionOption = x =>
    html`
      <option value=${x}>${x}</option>
    `;

  return html`
    <${SearchInput}
      placeholder="Search for files.."
      value=${searchTerm}
      onChange=${setSearchTerm}
    />
    <${Package} name=${name} version=${version} description=${description} />
    <select
      id="version"
      value=${version}
      onChange=${e => handleVersionChange(e.target.value)}
    >
      ${versions.map(VersionOption)}</select
    >
    <${Directory}
      packageName=${name}
      rootMeta=${meta}
      version=${version}
      filter=${searchTerm}
    />
  `;
};

export const styles = {
  directory: css`
    display: flex;
    flex-direction: column;
    word-break: break-word;
    > * + * {
      border-top: 1px solid rgba(0, 0, 0, 0.2);
    }
    div,
    li {
      display: flex;
      align-items: center;
      padding: 1rem;
      svg {
        flex: none;
        width: 1.62rem;
        height: 1.62rem;
        fill: rgba(255, 255, 255, 0.2);
        margin-right: 1rem;
      }
      a {
        flex: 1 1 100%;
        padding-right: 1rem;
        text-decoration: none;
        cursor: pointer;
        text-decoration: underline;
        color: rgba(255, 255, 255, 0.7);
        font-size: 1rem;
        &:hover {
          color: #fff;
        }
      }
      small {
        white-space: nowrap;
        margin-left: auto;
      }
    }

    div > svg {
      width: 2rem;
      height: 2rem;
    }

    h2 {
      font-size: 1rem;
      font-weight: bold;
    }
  `,
};
