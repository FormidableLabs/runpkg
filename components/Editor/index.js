import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';
import Highlight, {
  Prism,
} from 'https://unpkg.com/prism-react-renderer?module';

import Link from '../Link.js';

export default ({ value, dependencyState, url, ...rest }) => {
  const dependencies = react.useMemo(
    () => dependencyState[url] && dependencyState[url].dependencies,
    [dependencyState, url]
  );

  const findTokenDependency = react.useCallback(
    token => {
      if (!dependencies) return null;
      const strippedDependency = token.replace(/['"]+/g, '');
      const dependency = dependencies.find(
        dep => dep[0] === strippedDependency
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
            const isImportExportLine = line.some(
              token =>
                token.types.includes('module') ||
                (token.types.includes('function') &&
                  token.content === 'require')
            );

            return html`
              <div ...${getLineProps({ line, key: i })}>
                ${line.map((token, key) => {
                  const dependency =
                    isImportExportLine &&
                    token.types.includes('string') &&
                    findTokenDependency(token.content);

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
    padding: 42px;
  `,
  link: css`
    text-decoration: underline;
    text-decoration-color: #f8b1f1;
  `,
};
