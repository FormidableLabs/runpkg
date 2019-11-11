import { html, css, react } from 'https://unpkg.com/rplus-production@1.0.0';
import FolderIcon from './FolderIcon.js';
import FileIcon from './FileIcon.js';
import Link from './Link.js';

const File = ({ meta, parent, version }) => {
  return html`
    <li key=${meta.path}>
      ${FileIcon}
      <${Link} href=${`/?${name}@${version}${meta.path}`}>
        ${meta.path.replace(parent.path, '')}
      <//>
    </li>
  `;
};

const Directory = ({ rootMeta, version }) => html`
  <ul className=${styles.directory}>
    ${rootMeta.path &&
      rootMeta.path !== '/' &&
      html`
        <div>
          ${FolderIcon}
          <h2>${rootMeta.path.slice(1)}</h2>
        </div>
      `}
    ${rootMeta.files.map(meta =>
      meta.type === 'file'
        ? File({ meta, parent: rootMeta, version })
        : Directory({ rootMeta: meta, version })
    )}
  </ul>
`;

export const PackageOverview = ({ file, versions = [] }) => {
  const {
    pkg: { name, license, version, main },
    meta,
  } = file;

  //   // On package change
  //   react.useEffect(() => {
  //     changeVersion(version);
  //   }, [name]);

  //   const handleVersionChange = v => {
  //     changeVersion(v);
  //     const [, path] = file.url.match(
  //       /https:\/\/unpkg.com\/(?:@?[^@\n]*)@?(?:\d+\.\d+\.\d+)(.*)$/
  //     );
  //     pushState(`?${name}@${v}${path}`);
  //   };

  console.log(versions);

  const VersionOption = x =>
    html`
      <option value=${x}>${x}</option>
    `;

  return html`
    <div className="row" justify="space-between">
      <h2>
        Name
      </h2>
      <span onClick=${() => pushState(`?${name}@${version}/${main}`)}>
        ${name}
      </span>
    </div>
    <div className="row" justify="space-between">
      <h2>
        Licence
      </h2>
      <span>${license}</span>
    </div>
    <div className="row" justify="space-between">
      <h2>
        Version
      </h2>
      <select
        id="version"
        value=${version}
        onChange=${e => handleVersionChange(e.target.value)}
      >
        ${versions.map(VersionOption)}</select
      >
    </div>
    <${Directory} rootMeta=${meta} version=${version} />
  `;
};

const styles = {
  directory: css`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    word-break: break-word;

    a {
      cursor: pointer;
      text-decoration: underline;
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: #fff;
      }
    }

    div,
    li {
      display: flex;
      align-items: center;
      margin-top: 1rem;
      svg {
        flex: none;
        width: 1rem;
        height: 1rem;
        fill: rgba(255, 255, 255, 0.5);
        margin-right: 0.62rem;
      }
    }

    > div ~ * {
      margin-left: 0.5rem;
    }

    div > svg {
      width: 1.5rem;
      height: 1.5rem;
    }

    h2 {
      font-size: 1rem;
      font-weight: bold;
    }
  `,
};
