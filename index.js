import { react, html, css } from 'https://unpkg.com/rplus';
import Editor from './components/Editor.js';
import FormidableIcon from './components/FormidableLogo.js';
import Overlay from './components/Overlay.js';
import ErrorBlock404 from './components/ErrorBlock404.js';
import Aside from './components/Aside.js';
import FolderIcon from './components/FolderIcon.js';
import FileIcon from './components/FileIcon.js';
import MenuIcon from './components/MenuIcon.js';
import CloseIcon from './components/CloseIcon.js';

const styles = css`/index.css`;
const pushState = url => history.pushState(null, null, url);
const replaceState = url => history.replaceState(null, null, url);

const parseUrl = (search = window.location.search.slice(1)) => ({
  url: search,
  package: search.split('/')[0],
  folder: search.replace(/\/[^\/]*\.js/, ''),
  file: search
    .split('/')
    .slice(1)
    .join('/'),
});

const Home = () => {
  const [request, setRequest] = react.useState(parseUrl());
  const [packageJSON, setPackageJSON] = react.useState({});
  const [navShowing, showNav] = react.useState(false);

  const [code, setCode] = react.useState('');
  const [siblings, setSiblings] = react.useState({ files: [] });
  const [fetchErrorStatus, setFetchErrorStatus] = react.useState(false);

  /* Runs once and subscribes to url changes */
  react.useEffect(() => {
    console.log('Setting up URL listener');
    /* Rerender the app when pushState or replaceState are called */
    ['pushState', 'replaceState'].map(event => {
      const original = window.history[event];
      window.history[event] = function() {
        original.apply(history, arguments);
        setRequest(parseUrl());
      };
    });
    /* Rerender when the back and forward buttons are pressed */
    addEventListener('popstate', () => setRequest(parseUrl()));
  }, []);

  /* Runs every time the URL changes */
  react.useEffect(() => {
    (async () => {
      /* Fetch the package json */
      if (
        request.package &&
        request.package !== `${packageJSON.name}@${packageJSON.version}`
      ) {
        const folderURL = `https://unpkg.com/${request.package}/?meta`;
        const folder = await fetch(folderURL);
        const contents = await folder.json();
        setSiblings(contents);
        console.log('Getting package json for', request.package);
        await fetch(`https://unpkg.com/${request.package}/package.json`)
          .then(res => res.json())
          .then(pkg => {
            setPackageJSON(pkg);
            replaceState(
              `?${pkg.name}@${pkg.version}${
                request.file
                  ? `/${request.file}`
                  : pkg.main
                  ? `/${pkg.main}`
                  : '/index.js'
              }`
            );
          })
          .catch(() => {
            setFetchErrorStatus(true);
            return setPackageJSON({});
          });
      }
      /* Fetch the requested file */
      if (request.file) {
        const fileURL = `https://unpkg.com/${request.url}`;
        console.log('Getting file', fileURL);
        const file = await fetch(fileURL);
        const text = await file.text();
        replaceState(`?${file.url.replace('https://unpkg.com/', '')}`);
        setCode(text);
      }
    })();
  }, [request.url]);

  const CodeBlock = react.useMemo(
    () => html`
      <${Editor}
        key="editor"
        value=${code.slice(0, 100000)}
        style=${{
          lineHeight: '138%',
          fontFamily: '"Inconsolata", monospace',
        }}
        disabled
      />
      <pre key="pre">${code.slice(100000)}</pre>
    `,
    [code]
  );

  const NpmLogo = html`
    <svg viewBox="0 0 780 250">
      <title>NPM repo link</title>
      <path
        fill="#fff"
        d="M240,250h100v-50h100V0H240V250z M340,50h50v100h-50V50z M480,0v200h100V50h50v150h50V50h50v150h50V0H480z M0,200h100V50h50v150h50V0H0V200z"
      ></path>
    </svg>
  `;

  const { name, version, main, license, description } = packageJSON;
  const packageMainUrl = `?${name}@${version}/${main}`;
  const npmUrl = 'https://npmjs.com/' + packageJSON.name;

  const File = ({ meta, parent }) => html`
    <li style=${{ order: 1 }}>
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

  return html`
    <main className=${styles}>
      <button
        className="toggleOpenButton"
        onClick=${() => showNav(!navShowing)}
      >
        ${MenuIcon}
      </button>
      ${request.url === ''
        ? Overlay
        : fetchErrorStatus
        ? ErrorBlock404(setFetchErrorStatus)
        : html`
            <nav className=${navShowing ? 'active' : 'hiding'}>
              <button
                className="toggleCloseButton"
                onClick=${() => showNav(!navShowing)}
              >
                ${CloseIcon}
              </button>
              <div className="scrollableContent">
                <h1
                  onClick=${() => pushState(packageMainUrl)}
                  data-test="title"
                >
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
                <${Directory} rootMeta=${siblings} />
              </div>
            </nav>
            <article>${CodeBlock}</article>
            <${Aside} packageJSON=${packageJSON} request=${request} />
            <footer>
              <p>An experiment by the folks at Formidable</p>
              ${FormidableIcon}
            </footer>
          `}
    </main>
  `;
};

react.render(
  html`
    <${Home} />
  `,
  document.body
);
