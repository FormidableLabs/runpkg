import { html } from 'https://unpkg.com/rplus-production@1.0.0';

import Editor from './Editor/index.js';
import FileIcon from './FileIcon.js';

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
      value=${file.code.slice(0, 100000)}
    />
    <pre key="pre">${file.code.slice(100000)}</pre>
  </article>
`;
