import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';
import { SearchInput } from './SearchInput.js';
import FolderIcon from './FolderIcon.js';
import FileIcon from './FileIcon.js';
import Link from './Link.js';
import { useStateValue } from '../utils/globalState.js';
import { Package } from './RegistryOverview.js';
import formatBytes from '../utils/formatBytes.js';
import pushState from '../utils/pushState.js';

const File = ({ packageName, meta, parent, version, filter }) =>
  meta.path.match(filter) &&
  html`
    <li key=${meta.path} className=${styles.file}>
      ${FileIcon}
      <${Link} href=${`/?${packageName}@${version}${meta.path}`}>
        ${meta.path.replace(parent.path, '')}
      <//>
      <small>${formatBytes(meta.size)}</small>
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
            <h2>${rootMeta.path.split('/').pop()}</h2>
            <small>${rootMeta.files.length} Files</small>
          </li>
        `}
      ${expanded &&
        rootMeta.files.map(meta =>
          meta.type === 'file'
            ? html`
                <${File}
                  meta=${meta}
                  parent=${rootMeta}
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
  directory: css`
    position: relative;
    display: flex;
    flex-direction: column;
    word-break: break-word;

    div,
    li {
      position: relative;
      display: flex;
      align-items: center;
      padding: 1rem 1rem 1rem 2rem;
      svg {
        flex: none;
        width: 1.38rem;
        height: 1.38rem;
        fill: rgba(255, 255, 255, 0.38);
        margin-right: 1rem;
      }
      a {
        padding: 1rem;
        display: flex;
        align-items: center;
        flex: 1 1 100%;
        padding-right: 1rem;
        text-decoration: none;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.7);
        font-size: 1rem;
        line-height: 150%;
        &:hover {
          color: #fff;
        }
      }
      small {
        white-space: nowrap;
        margin-left: auto;
      }
      strong {
        font-weight: bold;
      }
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
  root: css`
    margin-left: -1.38rem;

    ul {
      margin-left: 2.5rem;
      border-left: 2px dashed #76767a;

      > li:first-of-type {
        cursor: pointer;
        user-select: none;

        &:before {
          display: block;
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          width: 1rem;
          border-bottom: 2px dashed #76767a;
        }
      }
    }
  `,
  chevron: css`
    position: absolute;
    top: 0;
    left: 0;
    top: 50%;
    font-size: 0.8rem;
    padding: 0.2rem;
    z-index: 2;
    background: #26272d;
    transform: translate(-50%, -50%);
  `,
  expanded: css`
    transform: translate(-50%, -50%) rotate(90deg);
  `,
  file: css`
    position: relative;
    margin-left: 2.5rem;

    &:before {
      display: block;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-left: 2px solid #76767a;
    }
    &:last-child {
      &:before {
        height: 50%;
      }
    }

    &:after {
      display: block;
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 1rem;
      border-bottom: 2px solid #76767a;
    }
  `,
};
