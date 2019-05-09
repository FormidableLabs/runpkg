import { react, html, css } from 'https://unpkg.com/rplus';
import Editor from './components/Editor.js';
import FormidableIcon from './components/FormidableLogo.js';
import Overlay from './components/Overlay.js';
import ErrorBlock404 from './components/ErrorBlock404.js';
import Aside from './components/Aside.js';
import Nav from './components/Nav.js';
import FileIcon from './components/FileIcon.js';

const styles = css`/index.css`;
const isEmpty = obj => Object.keys(obj).length === 0;
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
  const [packageMeta, setPackageMeta] = react.useState({});
  const [code, setCode] = react.useState('');
  const [fetchError, setFetchError] = react.useState(false);

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
    if (
      request.package &&
      request.package !== `${packageJSON.name}@${packageJSON.version}`
    ) {
      console.log(`Fetching ${request.package} meta data`);
      Promise.all([
        fetch(`https://unpkg.com/${request.package}/?meta`).then(res =>
          res.json()
        ),
        fetch(`https://unpkg.com/${request.package}/package.json`).then(res =>
          res.json()
        ),
      ])
        .then(([meta, pkg]) => {
          setPackageJSON(pkg);
          setPackageMeta(meta);
        })
        .catch(() => {
          setPackageJSON({});
          setPackageMeta({});
          setFetchError(true);
        });
    }

    fetch(`https://unpkg.com/${request.url}`)
      .then(async res => ({
        text: await res.text(),
        url: res.url,
      }))
      .then(file => {
        setCode(file.text);
        replaceState(`?${file.url.replace('https://unpkg.com/', '')}`);
      });
  }, [request.url]);

  const CodeBlock = react.useMemo(
    () => html`
      <${Editor}
        key="editor"
        value=${code.replace(/\t/g, '  ').slice(0, 100000)}
        style=${{
          lineHeight: '138%',
          fontFamily: '"Inconsolata", monospace',
        }}
        padding=${42}
        disabled
      />
      <pre key="pre">${code.replace(/\t/g, '  ').slice(100000)}</pre>
    `,
    [code]
  );

  return fetchError
    ? ErrorBlock404(setFetchError)
    : request.url === ''
    ? Overlay
    : isEmpty(packageJSON) || isEmpty(packageMeta)
    ? null
    : html`
        <main className=${styles}>
          <${Nav} packageJSON=${packageJSON} packageMeta=${packageMeta} />
          <article>
            <h1>
              ${FileIcon} ${request.file}
            </h1>
            ${CodeBlock}
          </article>
          <${Aside} packageJSON=${packageJSON} request=${request} />
          <footer>
            <a href="https://formidable.com/">
              <p>An experiment by the folks at Formidable</p>
              ${FormidableIcon}</a
            >
          </footer>
        </main>
      `;
};

react.render(
  html`
    <${Home} />
  `,
  document.body
);
