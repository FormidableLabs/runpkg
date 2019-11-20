import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';
import { SearchInput } from './SearchInput.js';
import FolderIcon from './FolderIcon.js';
import FileIcon from './FileIcon.js';
import Link from './Link.js';
import { useStateValue } from '../utils/globalState.js';
import { Package } from './RegistryOverview.js';
import formatBytes from '../utils/formatBytes.js';
import pushState from '../utils/pushState.js';

const File = ({ packageName, meta, version, filter }) =>
  meta.path.match(filter) &&
  html`
    <li key=${meta.path} className=${styles.file}>
      <${Link} href=${`/?${packageName}@${version}${meta.path}`}>
        <span>${FileIcon} ${meta.path.split('/').pop()}</span>
        <small>${formatBytes(meta.size)}</small>
      <//>
    </li>
  `;

const Directory = ({
  packageName,
  rootMeta,
  version,
  filter,
  root = false,
}) => {
  const [expanded, setExpanded] = react.useState(root);

  return html`
    <ul className=${`${styles.directory} ${root ? styles.root : ''}`}>
      ${rootMeta.path &&
        rootMeta.path !== '/' &&
        rootMeta.path.match(filter) &&
        html`
          <li onClick=${() => setExpanded(!expanded)}>
            <button>
              <span>
                ${!root &&
                  html`
                    <span
                      className=${`${styles.chevron} ${
                        expanded ? styles.expanded : ''
                      }`}
                    >
                      \u25ba
                    </span>
                  `}
                ${FolderIcon}
                <strong>${rootMeta.path.split('/').pop()}</strong>
              </span>
              <small>${rootMeta.files.length} Files</small>
            </button>
          </li>
        `}
      ${expanded &&
        rootMeta.files.map(meta =>
          meta.type === 'file'
            ? html`
                <${File}
                  meta=${meta}
                  version=${version}
                  packageName=${packageName}
                  filter=${filter}
                />
              `
            : html`
                <${Directory}
                  rootMeta=${meta}
                  version=${version}
                  packageName=${packageName}
                  filter=${filter}
                  root=${false}
                />
              `
        )}
    </ul>
  `;
};

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
      root=${true}
    />
  `;
};

export const styles = {
  root: css`
    margin-left: -1.38rem;

    ul {
      margin-left: 1.5rem;
      border-left: 2px dotted #4b4b4e;
    }
  `,
  directory: css`
    position: relative;
    word-break: break-word;

    svg {
      flex: none;
      width: 1.2rem;
      height: 1.2rem;
      fill: rgba(255, 255, 255, 0.38);
      margin: 0 0.62rem 0 0.2rem;
    }

    li {
      button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        background: none;
        border: none;
        padding: 1rem;
        cursor: pointer;
        user-select: none;

        span {
          display: flex;
          align-items: center;
        }
      }

      small {
        white-space: nowrap;
        margin-left: 1rem;
        color: rgba(255, 255, 255, 0.8);
        font-size: 1rem;
      }

      strong {
        font-size: 1rem;
        font-weight: bold;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  `,
  chevron: css`
    position: absolute;
    top: 0;
    left: 0px;
    top: 50%;
    font-size: 0.8rem;
    padding: 0.2rem;
    z-index: 2;
    background: #26272d;
    color: #9c9c9c;
    transform: translate(-50%, -50%);
  `,
  expanded: css`
    transform: translate(-50%, -50%) rotate(90deg);
  `,
  file: css`
    position: relative;
    margin-left: 1.5rem;

    &:before,
    &:after {
      display: block;
      content: '';
      position: absolute;
      left: 0;
      border-color: ;
    }

    &:after {
      top: 50%;
      width: 1rem;
      border-bottom: 2px solid #4b4b4e;
    }

    &:before {
      top: 0;
      height: 100%;
      border-left: 2px solid #4b4b4e;
    }
    &:last-child {
      &:before {
        height: 50%;
      }
    }

    a {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 1rem;
      text-decoration: none;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
      padding: 1rem;

      span {
        display: flex;
        align-items: center;
      }

      &:hover,
      &:focus {
        color: #fff;
      }
    }
  `,
};
