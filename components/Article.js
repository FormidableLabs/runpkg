import { react, html } from 'https://unpkg.com/rplus-production@1.0.0';

import FileContext from '../context/FileContext.js';

import Editor from './Editor.js';
import FileIcon from './FileIcon.js';

export default ({ dependencyState }) => {
  const { file } = react.useContext(FileContext);

  return html`
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
        style=${{
          lineHeight: '138%',
          fontFamily: '"Inconsolata", monospace',
        }}
        padding=${42}
        readOnly
      />
      <pre key="pre">${file.code.slice(100000)}</pre>
    </article>
  `;
};
