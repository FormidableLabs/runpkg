import { react, html, css } from 'https://unpkg.com/rplus';
import Editor from '../../components/editor.js';
import FormidableIcon from '../../components/logo.js';
import recursiveDependencyFetch from './utils/recursiveDependencyFetch.js';
import Overlay from '../../components/Overlay.js';
import Aside from '../../components/Aside.js';

const styles = css`/routes/home/index.css`;
const pushState = url => history.pushState(null, null, url);
const replaceState = url => history.replaceState(null, null, url);

const parseUrl = (search = window.location.search.slice(1)) => ({
  url: search,
  package: search.split('/')[0],
  file: search
    .split('/')
    .slice(1)
    .join('/'),
});

export default () => {
  const [request, setRequest] = react.useState(parseUrl());
  const [packageJSON, setPackageJSON] = react.useState({});
  const [code, setCode] = react.useState('');
  const [cache, setCache] = react.useState({});

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
    /* Fetch the package json */
    if (request.package !== `${packageJSON.name}@${packageJSON.version}`) {
      console.log('Getting package json for', request.package);
      fetch(`https://unpkg.com/${request.package}/package.json`)
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
        .catch(() => setPackageJSON({}));
    }
  }, [request.package]);

  /* Runs every time the requested file changes */
  react.useEffect(() => {
    /* Fetch the requested file */
    if (request.file) {
      const fileURL = `https://unpkg.com/${request.url}`;
      console.log('Getting file', fileURL);
      (async () => {
        const file = await fetch(fileURL);
        const code = await file.text();
        replaceState(`?${file.url.replace('https://unpkg.com/', '')}`);
        setCode(code);
      })();
    }
  }, [request.package, request.file]);

  // /* Runs every time the package name changes */
  react.useEffect(() => {
    if (packageJSON.name && packageJSON.version) {
      /* Fetch all files in this module */
      console.log(
        `Recursively fetching ${packageJSON.name}@${packageJSON.version}`
      );
      recursiveDependencyFetch(packageJSON).then(setCache);
    }
  }, [packageJSON.name, packageJSON.version]);

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

  return html`
    <main className=${styles}>
      ${request.url === ''
        ? Overlay(pushState)
        : html`
            <article>${CodeBlock}</article>
            <${Aside}
              cache=${cache}
              packageJSON=${packageJSON}
              pushState=${pushState}
              request=${request}
            />
            <footer>
              <p>An experiment by the folks at Formidable</p>
              ${FormidableIcon}
            </footer>
          `}
    </main>
  `;
};
