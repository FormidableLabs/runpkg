import { html } from 'https://unpkg.com/rplus-production@1.0.0';

import Editor from './Editor.js';
import FileIcon from './FileIcon.js';

const maxHighlightedCodeLength = 100000;

export default ({ file, dependencyState }) => html`
  <article>
    <h1>
      ${FileIcon}
      ${file.url.replace(
        `https://unpkg.com/${file.pkg.name}@${file.pkg.version}`,
        ''
      )}
    </h1>
    <${Editor}
      dependencyState=${dependencyState}
      url=${file.url}
      key="editor"
      value=${file.code.slice(0, maxHighlightedCodeLength)}
      style=${{
        lineHeight: '138%',
        fontFamily: '"Inconsolata", monospace',
        boxShadow: 'inset 42px 0 rgba(0, 0, 0, 0.541)',
      }}
      readOnly
    />
    ${file.code.length > maxHighlightedCodeLength
      ? html`
          <pre key="pre">${file.code.slice(maxHighlightedCodeLength)}</pre>
        `
      : null}
  </article>
`;
