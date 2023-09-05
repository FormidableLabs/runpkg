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

const File = ({ packageName, packageVersion, meta, displayFullPath = false }) =>
  html`
    <${Link}
      href=${`/?${packageName}@${packageVersion}${meta.path}`}
      className=${styles.item}
    >
      <div>
        ${FileIcon}
        <span>${meta.path.split('/').pop()}</span>
          ${
            displayFullPath
              ? html`
                  <span
                    >${meta.path.substring(0, meta.path.lastIndexOf('/'))}</span
                  >
                `
              : null
          }
      </div>
      <small>${formatBytes(meta.size)}</small>
    </${Link}>
  `;

const Node = ({ meta, packageName, packageVersion }) => {
  const directory = meta.type === 'directory';

  const directoryFileSize = react.useMemo(() => {
    if (directory) {
      const files = flatten(meta.files);
      const totalSize = files.reduce((acc, cur) => acc + cur.size, 0);
      return formatBytes(totalSize);
    }
  }, [directory, meta]);

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
              <div>
                ${FolderIcon}
                <strong>${meta.path.split('/').pop()}</strong>
              </div>
              <small>${directoryFileSize} (${meta.files.length} Files)</small>
            </div>
          `}
    >
      ${directory &&
        meta.files.map(
          node => html`
            <${Node}
              key=${node.path}
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
    { versions, request, directory, fileSearchTerm },
    dispatch,
  ] = useStateValue();

  const flatFiles = react.useMemo(
    () => (directory && directory.files ? flatten(directory.files) : []),
    [directory]
  );

  const search = react.useCallback(
    file =>
      file.path
        .toLowerCase()
        .match(
          fileSearchTerm.toLowerCase().replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
        ),
    [fileSearchTerm]
  );

  if (!versions || !directory || !versions[request.version] || !directory.files)
    return null;

  const { name, version, description } = versions[request.version];
  const handleVersionChange = v => pushState(`?${name}@${v}`);
  const VersionOption = x =>
    html`
      <option key=${x} value=${x}>${x}</option>
    `;

  return html`
    <${react.Fragment}>
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
      ${
        fileSearchTerm
          ? html`
              <div>
                ${flatFiles.filter(search).map(
                  file => html`
                    <${File}
                      key=${file.path}
                      meta=${file}
                      packageName=${name}
                      packageVersion=${version}
                      displayFullPath=${true}
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
                        key=${node.path}
                        meta=${node}
                        packageName=${name}
                        packageVersion=${version}
                      />
                    `
                )}
              <//>
            `
      }
    </${react.Fragment}>
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

    div {
      display: flex;
      align-items: center;
      overflow: hidden;
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

    span {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      &:nth-of-type(2) {
        flex: 1;
        margin-left: 0.2rem;
        opacity: 0.5;
        font-size: 0.9rem;
      }
    }
  `,
};
