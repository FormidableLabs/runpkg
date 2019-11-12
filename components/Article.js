import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import Editor from './Editor.js';
import FileIcon from './FileIcon.js';

const isEmpty = obj => Object.keys(obj).length === 0;

export default ({ file, dependencyState }) => {
  return (
    !isEmpty(file) &&
    html`
      <article className=${styles}>
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
          padding=${56}
          readOnly
        />
        <pre key="pre">${file.code.slice(100000)}</pre>
      </article>
    `
  );
};

const styles = css`
  grid-area: article;
  overflow: auto;
  flex: 1 0 62%;

  @media screen and (min-width: 1000px) {
    height: 100vh;
  }

  h1 {
    padding: 1.62rem;
    width: 100%;
    text-align: center;
    background: #2a2c32;
    color: #fff;
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    > svg {
      width: 1.62rem;
      height: 1.62rem;
      margin-right: 0.62rem;
      fill: rgba(255, 255, 255, 0.5);
    }
  }

  pre {
    color: #fff;
  }
`;
