import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';
import Highlight, {
  Prism,
} from 'https://unpkg.com/prism-react-renderer?module';

import Link from './Link.js';

const getSelectedLineNumberFromUrl = () =>
  location.hash && parseInt(location.hash.substr(1), 10);

export default ({ value, dependencyState = {}, url, ...rest }) => {
  const [selectedLine, setSelectedLine] = react.useState(
    getSelectedLineNumberFromUrl()
  );

  react.useEffect(() => {
    // when the url updates with a selected line number,
    // reflect that back to the state value
    setSelectedLine(getSelectedLineNumberFromUrl());
  }, [window.location.hash]);

  react.useEffect(() => {
    // when the selected line is updated, reflect it in the url
    history.pushState(null, null, selectedLine ? `#${selectedLine}` : ' ');
  }, [selectedLine]);

  const handleLineNumberClick = lineNo => {
    setSelectedLine(lineNo === selectedLine ? null : lineNo);
  };

  const dependencies = react.useMemo(
    () => dependencyState[url] && dependencyState[url].dependencies,
    [dependencyState[url]]
  );

  const findTokenDependency = react.useCallback(
    token => {
      if (!dependencies) return null;
      const strippedDependency = token.replace(/['"]+/g, '');
      const dependency = dependencies.find(dep =>
        // dependency import statements may or may not end with .js
        dep[0].match(new RegExp(`${strippedDependency}(\.js)?`))
      );
      return dependency;
    },
    [dependencies]
  );

  return html`
    <${Highlight}
      Prism=${Prism}
      code=${value}
      language="javascript"
      theme=${undefined}
    >
      ${({ className, style, tokens, getLineProps, getTokenProps }) => html`
        <pre
          className=${`${styles.container} ${className}`}
          style=${style}
          ...${rest}
        >
        ${tokens.map((line, i) => {
            // find whether this line contains and import/export statement
            const isImportExportLine = line.some(
              token =>
                token.types.includes('module') ||
                (token.types.includes('function') &&
                  token.content === 'require')
            );

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
                ${line.map((token, key) => {
                  // if this line contains an import/export statement
                  // then match the module name against the list of
                  // found dependencies
                  const dependency =
                    isImportExportLine &&
                    token.types.includes('string') &&
                    findTokenDependency(token.content);

                  // if a matched dependency is found, render a link to
                  // that file, else display it normally
                  return dependency
                    ? html`
                        <${Link}
                          href=${`/${dependency[1].replace(
                            'https://unpkg.com/',
                            '?'
                          )}`}
                          className=${styles.link}
                        >
                          <span ...${getTokenProps({ token, key })}
                        /><//>
                      `
                    : html`
                        <span ...${getTokenProps({ token, key })} />
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
