import { html, react } from 'https://unpkg.com/rplus-production@1.0.0';
import NpmLogo from './NpmLogo.js';
import FolderIcon from './FolderIcon.js';
import FileIcon from './FileIcon.js';
import MenuIcon from './MenuIcon.js';
import CloseIcon from './CloseIcon.js';
import SearchIcon from './SearchIcon.js';
import Link from './Link.js';

const pushState = url => history.pushState(null, null, url);

export default ({ file, versions, dispatch }) => {
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

  const [selectedVersion, changeVersion] = react.useState(version);

  // On package change
  react.useEffect(() => {
    changeVersion(version);
  }, [name]);

  const handleVersionChange = v => {
    changeVersion(v);
    const [, path] = file.url.match(/https:\/\/unpkg.com\/[^\/]*(\/?.*)$/);
    pushState(`?${name}@${v}${path}`);
  };

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
      <button
        className="searchButton"
        onClick=${() => dispatch({ type: 'setIsSearching', payload: true })}
      >
        ${SearchIcon}<span>Find packages...</span>
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
      <h2>Versions</h2>
      <select
        id="version"
        value=${selectedVersion}
        onChange=${e => handleVersionChange(e.target.value)}
        data-test="version-selector"
      >
        ${versions.length !== 0
          ? versions.map(
              x =>
                html`
                  <option value=${x}>${x}</option>
                `
            )
          : null}</select
      >
      <h2>Package Contents</h2>
      <${Directory} rootMeta=${file.meta} />
    </nav>
  `;
};
