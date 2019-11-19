import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';
import { SearchInput } from './SearchInput.js';
import FolderIcon from './FolderIcon.js';
import FileIcon from './FileIcon.js';
import Link from './Link.js';
import { useStateValue } from '../utils/globalState.js';
import { Package } from './RegistryOverview.js';
import formatBytes from '../utils/formatBytes.js';
import pushState from '../utils/pushState.js';

const File = ({ packageName, meta, parent, version, filter }) => {
  return (
    meta.path.match(filter) &&
    html`
      <li key=${meta.path}>
        ${FileIcon}
        <${Link} href=${`/?${packageName}@${version}${meta.path}`}>
          ${meta.path.replace(parent.path, '')}
        <//>
        <small>${formatBytes(meta.size)}</small>
      </li>
    `
  );
};

const Directory = ({ packageName, rootMeta, version, filter }) => html`
  <ul className=${styles.directory}>
    ${rootMeta.path &&
      rootMeta.path !== '/' &&
      rootMeta.path.match(filter) &&
      html`
        <li>
          ${FolderIcon}
          <h2>${rootMeta.path.slice(1)}</h2>
          <small>${rootMeta.files.length} Files</small>
        </li>
      `}
    ${rootMeta.files.map(meta =>
      meta.type === 'file'
        ? File({ meta, parent: rootMeta, version, packageName, filter })
        : Directory({ rootMeta: meta, version, packageName, filter })
    )}
  </ul>
`;

export const PackageOverview = () => {
  const [
    { versions, request, directory, fileSearchTerm },
    dispatch,
  ] = useStateValue();
  if (!versions[request.version] || !directory.files) return null;
  const { name, version, description } = versions[request.version];
  const handleVersionChange = v => pushState(`?${name}@${v}`);
  const VersionOption = x =>
    html`
      <option value=${x}>${x}</option>
    `;

  return html`
    <${SearchInput}
      placeholder="Search for files.."
      value=${fileSearchTerm}
      onChange=${val => dispatch({ type: 'setFileSearchTerm', payload: val })}
    />
    <${Package} name=${name} version=${version} description=${description} />
    <select
      id="version"
      value=${version}
      onChange=${e => handleVersionChange(e.target.value)}
    >
      ${Object.keys(versions).map(VersionOption)}</select
    >
    <${Directory}
      packageName=${name}
      rootMeta=${directory}
      version=${version}
      filter=${fileSearchTerm}
    />
  `;
};

export const styles = {
  directory: css`
    display: flex;
    flex-direction: column;
    word-break: break-word;
    > * + *:not(:empty) {
      border-top: 1px solid rgba(0, 0, 0, 0.2);
    }
    div,
    li {
      display: flex;
      align-items: center;
      padding: 1rem;
      order: 0;
      svg {
        flex: none;
        width: 1.62rem;
        height: 1.62rem;
        fill: rgba(255, 255, 255, 0.38);
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

    ul {
      order: 1;
    }

    div > svg {
      width: 2rem;
      height: 2rem;
    }

    h2 {
      font-size: 0.62rem;
      font-weight: bold;
    }
  `,
};
