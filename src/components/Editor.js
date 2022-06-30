import { react, html, css } from '../utils/rplus.js';
import Highlight, { Prism } from 'prism-react-renderer';
import { useStateValue } from '../utils/globalState.js';
import Link from './Link.js';

const getSelectedLineNumberFromUrl = () =>
  location.hash && parseInt(location.hash.substr(1), 10);

const handleLineNumberClick = lineNo =>
  history.pushState(null, null, `#${lineNo}`);

const removeQuotes = packageName => packageName.replace(/['"]+/g, '');

function useLastGoodState(value) {
  const ref = react.useRef();
  react.useEffect(() => {
    ref.current = value || ref.current;
  }, [value]);
  return ref.current;
}

const languages = {
  html: 'markup',
  sh: 'bash',
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  hpp: 'cpp',
  css: 'css',
  mjs: 'javascript',
  js: 'javascript',
  flow: 'javascript',
  jsx: 'jsx',
  coffee: 'coffeescript',
  diff: 'diff',
  go: 'go',
  gql: 'graphql',
  graphql: 'graphql',
  hbs: 'handlebars',
  json: 'json',
  less: 'less',
  md: 'markdown',
  m: 'objectivec',
  ml: 'ocaml',
  mli: 'ocaml',
  py: 'python',
  re: 'reason',
  rei: 'reason',
  sass: 'sass',
  scss: 'scss',
  sql: 'sql',
  tsx: 'tsx',
  ts: 'typescript',
  wasm: 'wasm',
  yml: 'yaml',
};

const UNPKG = 'https://unpkg.com/';

export default () => {
  const [{ cache, request }] = useStateValue();
  const selectedLine = getSelectedLineNumberFromUrl();
  const container = react.useRef();
  const lastGoodState = useLastGoodState(cache[UNPKG + request.path]);
  const fileData = cache[UNPKG + request.path] || lastGoodState;
  const loading = !fileData || request.path !== fileData.url.replace(UNPKG, '');

  const scrollToLine = () => {
    const selectedLineEl = document.getElementById(`L-${selectedLine}`);
    if (selectedLineEl) {
      selectedLineEl.scrollIntoView();
      container.current.scrollBy(0, -38);
    }
  };

  react.useEffect(() => {
    if (container.current && !loading) {
      container.current.scrollTop = 0;
      scrollToLine();
    }
  }, [loading, container.current]);

  return (
    !!fileData &&
    html`
      <${Highlight}
        Prism=${Prism}
        code=${fileData.code.slice(0, 100000)}
        language=${languages[fileData.extension.split('.').pop()]}
        theme=${undefined}
      >
        ${({ className, style, tokens, getLineProps, getTokenProps }) => html`
          <pre
            className=${`${styles.container} ${className} ${
              loading ? styles.loading : ''
            } `}
            style=${style}
            ref=${container}
          >
          <code className=${styles.code}>
        ${tokens.map((line, i) => {
            return html`
              <div
                ...${getLineProps({ line, key: i })}
                id=${`L-${i}`}
                className=${selectedLine - 1 === i ? styles.lineActive : ''}
              >
                <span
                  className=${styles.lineNo}
                  onClick=${handleLineNumberClick.bind(null, i + 1)}
                  data-linenumber=${i + 1}
                ></span>
                ${line.map(token => {
                  const dep =
                    fileData.dependencies[removeQuotes(token.content)];
                  return dep && typeof dep === 'string'
                    ? html`
                        <${Link}
                          href=${`/?${dep.replace('https://unpkg.com/', '')}`}
                          className=${styles.link}
                        >
                          <span ...${getTokenProps({ token })} />
                        <//>
                      `
                    : html`
                        <span ...${getTokenProps({ token })} />
                      `;
                })}
              </div>
            `;
          })}
        </code>
      </pre>
        `}
      <//>
    `
  );
};

const styles = {
  container: css`
    flex: 1;
    line-height: 138%;
    padding: 2rem 1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: scroll;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  `,
  loading: css`
    opacity: 0.5;
    transition-delay: 0.2s;
  `,
  link: css`
    text-decoration: underline;
    text-decoration-color: #f8b1f1;
  `,
  lineActive: css`
    background: #ffff000f;
    outline: 1px solid #ffff001c;
  `,
  lineNo: css`
    display: inline-block;
    text-align: right;
    width: 2rem;
    margin-right: 2rem;
    opacity: 0.6;
    cursor: pointer;
    ::before {
      content: attr(data-linenumber);
    }
  `,
  code: css`
    line-height: 150%;
  `,
};
