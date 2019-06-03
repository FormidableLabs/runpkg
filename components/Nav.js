import { html, react } from 'https://unpkg.com/rplus-production@1.0.0';
import NpmLogo from './NpmLogo.js';
import FolderIcon from './FolderIcon.js';
import FileIcon from './FileIcon.js';
import MenuIcon from './MenuIcon.js';
import CloseIcon from './CloseIcon.js';
import Link from './Link.js';

const pushState = url => history.pushState(null, null, url);

export default ({ file }) => {
  const [isNavShowing, showNav] = react.useState(false);
  const { name, version, main, license, description } = file.pkg;

  const packageMainUrl = `?${name}@${version}/${main}`;
  const npmUrl = 'https://npmjs.com/' + name;

  const File = ({ meta, parent }) => html`
    <li key=${meta.path}>
      ${FileIcon}
      <${Link} href=${`/?${name}@${version}${meta.path}`}>
        ${meta.path.replace(parent.path, '')}
      <//>
    </li>
  `;

  const Directory = ({ rootMeta }) => html`
    <ul>
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

  return html`
    <button
      className="toggleOpenButton"
      onClick=${() => showNav(!isNavShowing)}
    >
      ${isNavShowing ? CloseIcon : MenuIcon}
      <span class="visually-hidden">
        ${isNavShowing ? 'Hide navigation menu' : 'Show navigation menu'}
      </span>
    </button>
    <nav className=${isNavShowing ? 'active' : 'hiding'}>
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
      <h2>Package Contents</h2>
      <${Directory} rootMeta=${file.meta} />
    </nav>
  `;
};
