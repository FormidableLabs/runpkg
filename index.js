import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';
import Editor from './components/Editor.js';
import FormidableIcon from './components/FormidableLogo.js';
import Overlay from './components/Overlay.js';
import ErrorBlock404 from './components/ErrorBlock404.js';
import Aside from './components/Aside.js';
import Nav from './components/Nav.js';
import FileIcon from './components/FileIcon.js';
import fileNameRegEx from './utils/fileNameRegEx.js';
import GitHubLogo from './components/GitHubLogo.js';

const styles = css`/index.css`;
const isEmpty = obj => Object.keys(obj).length === 0;
const replaceState = url => history.replaceState(null, null, url);

const parseUrl = (
  search = window.location.search.slice(1).replace(/\/$/, '')
) => ({
  url: search,
  package: search.startsWith('@')
    ? search
        .split('/')
        .slice(0, 2)
        .join('/')
    : search.split('/')[0],
  folder: search.replace(fileNameRegEx, ''),
  file: search
    .split('/')
    .slice(1)
    .join('/'),
});

const Home = () => {
  const [request, setRequest] = react.useState(parseUrl());
  const [file, setFile] = react.useState({});
  const [fetchError, setFetchError] = react.useState(false);

  // Whenever the URL changes then
  // 1. Resolve the unpkg url for the request url
  // 2. Fetch the package.json for the requested package
  // 3. Fetch the /?meta for the requested package

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

  react.useEffect(() => {
    if (!request.package) {
      setFile({});
      setFetchError(false);
    }
    if (request.package) {
      (async () => {
        // Fetch the file contents and check for redirect
        const { url, code } = await fetch(
          `https://unpkg.com/${request.url}`
        ).then(async res => ({
          code: await res.text(),
          url: res.url,
        }));
        // Fetch the meta data
        const meta = await fetch(`https://unpkg.com/${request.package}/?meta`)
          .then(res => res.json())
          .catch(() => setFetchError(true));
        // Fetch the package json
        const pkg = await fetch(
          `https://unpkg.com/${request.package}/package.json`
        )
          .then(res => res.json())
          .catch(() => setFetchError(true));
        setFile({
          url,
          meta,
          pkg,
          code: code.replace(/\t/g, '  '),
          name: url.replace(`https://unpkg.com/${pkg.name}@${pkg.version}`, ''),
        });
        replaceState(`?${url.replace('https://unpkg.com/', '')}`);
      })();
    }
  }, [request.url]);

  return html`
    <main className=${styles}>
      ${fetchError
        ? ErrorBlock404(setFetchError)
        : request.url === ''
        ? Overlay
        : isEmpty(file)
        ? null
        : html`
            <${Nav} file=${file} />
            <article>
              <h1>
                ${FileIcon} ${file.name}
              </h1>
              <${Editor}
                key="editor"
                value=${file.code.slice(0, 100000)}
                style=${{
                  lineHeight: '138%',
                  fontFamily: '"Inconsolata", monospace',
                }}
                padding=${42}
                readOnly
                extension=${file.name.split('.')[1]}
              />
              <pre key="pre">${file.code.slice(100000)}</pre>
            </article>
            <${Aside} file=${file} />
            <footer>
              <a href="https://formidable.com/blog/2019/runpkg/">
                <p>Read about how we made this at Formidable</p>
                ${FormidableIcon}</a
              >
              <a href="https://github.com/formidablelabs/runpkg">
                ${GitHubLogo}
              </a>
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
