import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';
import Highlight, {
  defaultProps,
} from 'https://unpkg.com/prism-react-renderer?module';

// import pushState from '../utils/pushState.js';

// redirects req from unpkg -> runpkg
// const handleEditorOnClick = e => {
//   const href = e.nativeEvent.target.parentNode.href;
//   if (href) {
//     e.preventDefault();
//     pushState(href.replace('https://unpkg.com/', '?'));
//   }
// };

// const handleCtrlDown = e => {
//   if (e.metaKey || e.ctrlKey) {
//     document.querySelectorAll('.imports').forEach(x => x.classList.add('ctrl'));
//   }
// };

// const handleCtrlUp = e => {
//   if (e.key === 'Meta' || e.key === 'Control') {
//     document
//       .querySelectorAll('.imports')
//       .forEach(x => x.classList.remove('ctrl'));
//   }
// };

// this function maps over dependencies and appends
// anchor tags to imports in the editor
// const anchorAppender = deps => {
//   deps.forEach(y => {
//     const imports = [...document.querySelectorAll('.token.string')].find(x =>
//       x.innerText.includes(y[0])
//     );
//     if (!imports) {
//       return;
//     }
//     const clonedImports = imports.cloneNode(true);
//     clonedImports.classList.add('imports');
//     const anchor = document.createElement('a');
//     anchor.href = y[1];
//     anchor.appendChild(clonedImports);
//     imports.replaceWith(anchor);
//   });
//   return;
// };

// const extensions = {
//   js: 'javascript',
//   re: 'reason',
//   json: 'json',
// };

const styles = css`
  line-height: 138%;
  font-family: 'Inconsolata', monospace;
  padding: 42px;
`;

// eslint-disable-next-line no-unused-vars
const theme = css`/theme.css`;

export default ({ value, ...rest }) => {
  return html`
  <${Highlight} ...${defaultProps} code=${value} language="javascript" theme=${undefined}>
    ${({ className, style, tokens, getLineProps, getTokenProps }) => html`
      <pre className=${`${styles} ${className}`} style=${style} ...${rest}>
        ${tokens.map(
          (line, i) => html`
            <div ...${getLineProps({ line, key: i })}>
              ${line.map(
                (token, key) => html`
                  <span ...${getTokenProps({ token, key })} />
                `
              )}
            </div>
          `
        )}
      </pre
      >
    `}
  </${Highlight}>
  `;
};

/*eslint-enable */
