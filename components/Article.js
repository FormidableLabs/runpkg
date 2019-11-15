import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import Editor from './Editor.js';
import FileIcon from './FileIcon.js';
import { useStateValue } from '../utils/globalState.js';

export default () => {
  const [{ code = '', request }] = useStateValue();
  return html`
    <article className=${styles}>
      <h1>
        ${FileIcon} ${request.path}
      </h1>
      <${Editor}
        url=${request.path}
        key="editor"
        value=${code.slice(0, 100000)}
      />
      <pre key="pre">${code.slice(100000)}</pre>
    </article>
  `;
};

const styles = css`
  grid-area: article;
  overflow: auto;
  flex: 1 0 62%;

  @media screen and (max-width: 800px) {
    height: 62vh;
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
      fill: rgba(255, 255, 255, 0.2);
    }
  }

  pre {
    color: #fff;
  }
`;
