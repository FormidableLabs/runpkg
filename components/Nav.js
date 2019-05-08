import { html } from 'https://unpkg.com/rplus';
import NpmLogo from './NpmLogo.js';
import FolderIcon from './FolderIcon.js';
import FileIcon from './FileIcon.js';
import MenuIcon from './MenuIcon.js';
import CloseIcon from './CloseIcon.js';

const File = ({ meta, parent }) => html`
  <li key=${meta.path} style=${{ order: 1 }}>
    ${FileIcon}
    <a onClick=${() => pushState(`?${request.package}${meta.path}`)}
      >${meta.path.replace(parent.path, '')}
    </a>
  </li>
`;

const Directory = ({ rootMeta }) => html`
  <ul style=${{ order: 0 }}>
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
        ? File({ meta, parent: rootMeta })
        : Directory({ rootMeta: meta })
    )}
  </ul>
`;

export default ({ packageJSON, packageMeta }) => {
  const [navShowing, showNav] = react.useState(false);

  const { name, version, main, license, description } = packageJSON;
  const packageMainUrl = `?${name}@${version}/${main}`;
  const npmUrl = 'https://npmjs.com/' + packageJSON.name;

  return html`
    <button className="toggleOpenButton" onClick=${() => showNav(true)}>
      ${MenuIcon}
    </button>
    <nav className=${navShowing ? 'active' : 'hiding'}>
      <button className="toggleCloseButton" onClick=${() => showNav(false)}>
        ${CloseIcon}
      </button>
      <h1 onClick=${() => pushState(packageMainUrl)} data-test="title">
        ${name}
      </h1>
      <span className="info-block">
        <p>v${version}</p>
        <p>${license}</p>
        <a href=${npmUrl}>${NpmLogo}</a>
      </span>
      <p>
        ${description || 'There is no description for this package.'}
      </p>
      <${Directory} rootMeta=${packageMeta} />
    </nav>
  `;
};
