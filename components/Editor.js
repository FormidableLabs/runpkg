import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';
import Highlight, {
  Prism,
} from 'https://unpkg.com/prism-react-renderer?module';
import { useStateValue } from '../utils/globalState.js';
import Link from './Link.js';

const getSelectedLineNumberFromUrl = () =>
  location.hash && parseInt(location.hash.substr(1), 10);

const handleLineNumberClick = lineNo =>
  history.pushState(null, null, `#${lineNo}`);

const hasImport = line =>
  line.some(
    token =>
      token.types.includes('module') ||
      (token.types.includes('function') && token.content === 'require')
  );

const removeQuotes = packageName => packageName.replace(/['"]+/g, '');

export default () => {
  const [{ code, cache, request }] = useStateValue();
  const selectedLine = getSelectedLineNumberFromUrl();
  const { dependencies = {} } =
    cache['https://unpkg.com/' + request.path] || {};
  return html`
    <${Highlight}
      Prism=${Prism}
      code=${code.slice(0, 100000)}
      language="javascript"
      theme=${undefined}
    >
      ${({ className, style, tokens, getLineProps, getTokenProps }) => html`
        <pre className=${`${styles.container} ${className}`} style=${style}>
        ${tokens.map((line, i) => {
            const isImportLine = hasImport(line);
            return html`
              <div
                ...${getLineProps({ line, key: i })}
                className=${styles.line(selectedLine - 1 === i)}
              >
                <span
                  className=${styles.lineNo}
                  onClick=${handleLineNumberClick.bind(null, i + 1)}
                  >${i + 1}</span
                >
                ${line.map(token => {
                  const dep =
                    isImportLine &&
                    token.types.includes('string') &&
                    dependencies[removeQuotes(token.content)];
                  return dep
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
      </pre
        >
      `}
    <//>
  `;
};

const styles = {
  container: css`
    line-height: 138%;
    font-family: 'Inconsolata', monospace;
    padding: 2rem 1rem;
    overflow: scroll;
  `,
  link: css`
    text-decoration: underline;
    text-decoration-color: #f8b1f1;
  `,
  line: active =>
    active &&
    css`
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
    user-select: none;
  `,
};
