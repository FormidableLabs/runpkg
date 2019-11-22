import { react, html, css } from '../utils/rplus.js';
import { SearchInput } from './SearchInput.js';
import FolderIcon from './FolderIcon.js';
import FileIcon from './FileIcon.js';
import Link from './Link.js';
import { useStateValue } from '../utils/globalState.js';
import { Package } from './RegistryOverview.js';
import formatBytes from '../utils/formatBytes.js';

const pushState = url => history.pushState(null, null, url);

const flatten = arr =>
  arr.reduce(
    (acc, cur) => [...acc, ...(cur.files ? flatten(cur.files) : [cur])],
    []
  );

const File = ({ packageName, link, name, size, version }) =>
  html`
    <${Link}
      href=${`/?${packageName}@${version}${link}`}
      className=${styles.item}
    >
      <span>${FileIcon} ${name}</span>
      <small>${formatBytes(size)}</small>
    <//>
  `;

const Directory = ({ packageName, rootMeta, version, root = false }) => {
  const [expanded, setExpanded] = react.useState(root);

  return html`
    <ul className=${`${root ? styles.root : ''} ${styles.directory} `}>
      ${rootMeta.path &&
        rootMeta.path !== '/' &&
        html`
          <li onClick=${() => setExpanded(!expanded)}>
            <button className=${styles.item}>
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
                <li key=${meta.path} className=${styles.file}>
                  <${File}
                    link=${meta.path}
                    name=${meta.path.split('/').pop()}
                    size=${meta.size}
                    version=${version}
                    packageName=${packageName}
                  />
                </li>
              `
            : html`
                <${Directory}
                  rootMeta=${meta}
                  version=${version}
                  packageName=${packageName}
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

  const flatFiles = react.useMemo(() => flatten(directory.files), [directory]);

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
    ${fileSearchTerm
      ? html`
          <div>
            ${flatFiles
              .filter(file =>
                file.path
                  .toLowerCase()
                  .match(
                    fileSearchTerm
                      .toLowerCase()
                      .replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
                  )
              )
              .map(
                file => html`
                  <${File}
                    link=${file.path}
                    name=${file.path}
                    size=${file.size}
                    version=${version}
                    packageName=${name}
                  />
                `
              )}
          </div>
        `
      : html`
          <${Directory}
            packageName=${name}
            rootMeta=${directory}
            version=${version}
            filter=${fileSearchTerm}
            root=${true}
          />
        `}
  `;
};

export const styles = {
  item: css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: none;
    border: none;
    padding: 1rem;
    line-height: 1.38;
    color: rgba(255, 255, 255, 0.8);

    text-decoration: none;
    &:hover,
    &:focus {
      color: #fff;
    }

    svg {
      flex: none;
      width: 1.2rem;
      height: 1.2rem;
      fill: rgba(255, 255, 255, 0.38);
      margin: 0 0.62rem 0 0.2rem;
    }

    span {
      display: flex;
      align-items: center;
      word-break: break-word;
    }

    small {
      white-space: nowrap;
      margin-left: 1rem;
      font-size: 1rem;
    }

    strong {
      font-size: 1rem;
      font-weight: bold;
    }
  `,

  directory: css`
    position: relative;
    word-break: break-word;
    margin-left: 1.5rem;
    border-left: 2px dotted #4b4b4e;

    button {
      cursor: pointer;
    }
  `,
  root: css`
    margin-left: -1.38rem;
    border-left: none;
  `,
  chevron: css`
    position: absolute;
    top: 0;
    left: 0px;
    top: 50%;
    font-size: 0.8rem;
    padding: 0.38rem;
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
  `,
};
