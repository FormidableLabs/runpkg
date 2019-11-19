import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';
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

function usePrevious(value) {
  const ref = react.useRef();
  react.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default () => {
  const [{ code, cache, request }] = useStateValue();
  const selectedLine = getSelectedLineNumberFromUrl();
  const fileData = cache['https://unpkg.com/' + request.path];
  const container = react.useRef();

  const prevCode = usePrevious(code);
  const prevReq = usePrevious(request);
  const prevFileData = react.useRef();

  const [codeToRender, setCodeToRender] = react.useState(code);
  const [depsToRender, setDepsToRender] = react.useState(
    fileData && fileData.dependencies
  );
  const [loading, setLoading] = react.useState(true);

  const scrollToLine = () => {
    const selectedLineEl = document.getElementById(selectedLine);
    if (selectedLineEl) {
      selectedLineEl.scrollIntoView();
      // offset for the selected line height
      container.current.scrollBy(0, -38);
    }
  };

  react.useEffect(() => {
    // only update prevFileData if new fileData is not null
    prevFileData.current = fileData || prevFileData.current;
  }, [fileData]);

  react.useEffect(() => {
    // use old values if the request path has changed or
    // the new file's dependencies have not been parsed
    const useOldValues =
      (prevReq && prevReq.path !== request.path) ||
      !(fileData && fileData.dependencies);

    setLoading(useOldValues);
    setCodeToRender(useOldValues ? prevCode : code);
    setDepsToRender(
      useOldValues
        ? prevFileData.current && prevFileData.current.dependencies
        : fileData.dependencies
    );
  }, [code, fileData, request, prevReq, prevFileData]);

  react.useEffect(() => {
    if (!loading) {
      scrollToLine();
    }
  }, [loading]);

  if (!depsToRender) {
    return null;
  }
  return html`
    <${Highlight}
      Prism=${Prism}
      code=${codeToRender.slice(0, 100000)}
      language="javascript"
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
        ${tokens.map((line, i) => {
            const isImportLine = hasImport(line);
            return html`
              <div
                ...${getLineProps({ line, key: i })}
                id=${i}
                className=${selectedLine - 1 === i ? styles.lineActive : ''}
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
                    depsToRender[removeQuotes(token.content)];
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
    flex: 1;
    line-height: 138%;
    font-family: 'Inconsolata', monospace;
    padding: 2rem 1rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: auto;
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
    user-select: none;
  `,
};
