import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import Dialog from './components/Overlay.js';
import Nav from './components/Nav.js';
import Article from './components/Article.js';
import Aside from './components/Aside.js';
import Footer from './components/Footer.js';
import NotFound from './components/NotFound.js';

import fileNameRegEx from './utils/fileNameRegEx.js';

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

  // Runs once and subscribes to url changes
  react.useEffect(() => {
    console.log('Setting up URL listener');
    // Rerender the app when pushState is called
    ['pushState'].map(event => {
      const original = window.history[event];
      window.history[event] = function() {
        original.apply(history, arguments);
        setRequest(parseUrl());
      };
    });
    // Rerender when the back and forward buttons are pressed
    addEventListener('popstate', () => setRequest(parseUrl()));
  }, []);

  // Whenever the URL changes then:
  // 1. Resolve the unpkg url and file contents for the request url
  // 2. Fetch the package.json for the requested package
  // 3. Fetch the /?meta for the requested package
  react.useEffect(() => {
    // Reset any previous state
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
          code: (await res.text()).replace(/\t/g, '  '),
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
        // Set the new state
        setFile({ url, meta, pkg, code });
        replaceState(`?${url.replace('https://unpkg.com/', '')}`);
      })();
    }
  }, [request.url]);

  return html`
    <main className=${css`/index.css`}>
      ${fetchError
        ? NotFound
        : !request.url
        ? Dialog
        : isEmpty(file)
        ? null
        : html`
            <${Nav} file=${file} />
            <${Article} file=${file} />
            <${Aside} file=${file} />
            <${Footer} />
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
