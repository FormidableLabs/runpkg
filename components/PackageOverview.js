import { react, html, css } from '../utils/rplus.js';
import { SearchInput } from './SearchInput.js';
import FolderIcon from './FolderIcon.js';
import FileIcon from './FileIcon.js';
import Link from './Link.js';
import { useStateValue } from '../utils/globalState.js';
import { Package } from './RegistryOverview.js';
import formatBytes from '../utils/formatBytes.js';

import { TreeView, TreeItem } from './TreeView.js';

const pushState = url => history.pushState(null, null, url);

const flatten = arr =>
  arr.reduce(
    (acc, cur) => [...acc, ...(cur.files ? flatten(cur.files) : [cur])],
    []
  );

const File = ({ packageName, packageVersion, meta }) =>
  html`
    <${Link}
      href=${`/?${packageName}@${packageVersion}${meta.path}`}
      className=${styles.item}
    >
      <span>${FileIcon} ${meta.name}</span>
      <small>${formatBytes(meta.size)}</small>
    <//>
  `;

const Node = ({ meta, packageName, packageVersion }) => {
  const directory = meta.type === 'directory';
  return html`
    <${TreeItem}
      label=${!directory
        ? html`
            <${File}
              packageName=${packageName}
              packageVersion=${packageVersion}
              meta=${meta}
            />
          `
        : html`
            <div className=${styles.item}>
              <span>
                ${FolderIcon}
                <strong>${meta.name}</strong>
              </span>
              <small>${meta.files.length} Files</small>
            </div>
          `}
    >
      ${directory &&
        meta.files.map(
          node => html`
            <${Node}
              meta=${node}
              packageName=${packageName}
              packageVersion=${packageVersion}
            />
          `
        )}
    <//>
  `;
};

export const PackageOverview = () => {
  const [
    { info, request, directory, fileSearchTerm },
    dispatch,
  ] = useStateValue();
  const { version } = request;
  if (!info || !info.time || !info.time[version] || !directory.files)
    return null;
  const { name, description } = info;
  const handleVersionChange = v => pushState(`?${name}@${v}`);
  const VersionOption = x =>
    html`
      <option value=${x}>${x}</option>
    `;

  const flatFiles = react.useMemo(() => flatten(directory.files), [directory]);

  const search = react.useCallback(
    file =>
      file.path
        .toLowerCase()
        .match(
          fileSearchTerm.toLowerCase().replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
        ),
    [fileSearchTerm]
  );

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
      ${info.versions.map(VersionOption)}</select
    >
    ${fileSearchTerm
      ? html`
          <div>
            ${flatFiles.filter(search).map(
              file => html`
                <${File}
                  meta=${file}
                  packageName=${name}
                  packageVersion=${version}
                />
              `
            )}
          </div>
        `
      : html`
          <${TreeView}>
            ${directory.files.map(
              node =>
                html`
                  <${Node}
                    meta=${node}
                    packageName=${name}
                    packageVersion=${version}
                  />
                `
            )}
          <//>
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
    padding: 1rem;
    font-size: 1rem;
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
};
