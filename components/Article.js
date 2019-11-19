import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import Editor from './Editor.js';
import { useStateValue } from '../utils/globalState.js';

export default () => {
  const [{ request }] = useStateValue();
  return html`
    <article className=${styles}>
      <h1>${request.path}</h1>
      <${Editor} key="editor" />
    </article>
  `;
};

const styles = css`
  grid-area: article;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1 0 62%;

  @media screen and (max-width: 800px) {
    height: 62vh;
  }

  h1 {
    padding: 2rem;
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
    color: rgba(255, 255, 255, 0.62);
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
