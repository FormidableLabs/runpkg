import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import Editor from './Editor.js';
import { useStateValue } from '../utils/globalState.js';

export default () => {
  const [{ request, cache }] = useStateValue();
  const fileData = cache['https://unpkg.com/' + request.path] || {};
  return html`
    <article className=${styles.container}>
      <h1>${request.path}</h1>
      ${fileData.extension === 'md'
        ? html`
            <div
              className=${styles.markdown}
              dangerouslySetInnerHTML=${{
                __html: marked(fileData.code),
              }}
            ></div>
          `
        : html`
            <${Editor} key="editor" />
          `}
    </article>
  `;
};

const styles = {
  container: css`
    grid-area: article;
    overflow: hidden;
    flex: 1 0 62%;
    display: flex;
    flex-direction: column;

    @media screen and (max-width: 800px) {
      height: 62vh;
    }

    > h1 {
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
      color: rgba(255, 255, 255, 0.9);
    }
  `,
  markdown: css`
    color: #fff;
    line-height: 1.5;
    line-height: 1.5;
    word-wrap: break-word;
    padding: 3rem 3rem 4rem;
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    overflow-y: scroll;
    color: rgba(255, 255, 255, 0.8);
    > * + * {
      margin-top: 1rem;
    }
    li {
      list-style: disc;
      list-style-position: inside;
    }
    h1,
    h2,
    h3,
    h4,
    strong {
      font-weight: bold;
    }
    h1 {
      text-align: left;
      font-size: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      padding-bottom: 1rem;
    }
    h2 {
      font-size: 1.62rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      padding-bottom: 0.62rem;
      margin-bottom: 1rem;
    }
    h3 {
      font-size: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      padding-bottom: 0.62rem;
      margin-bottom: 1rem;
    }
    img {
      display: block;
      max-width: 100%;
    }
    pre {
      background: rgba(0, 0, 0, 0.2);
      padding: 1rem;
      border-radius: 0.38rem;
      overflow-x: scroll;
    }

    a {
      display: inline-block;
      color: #f8b1f1;
      margin-top: 0;
    }
    table {
      border-collapse: collapse;
      color: inherit;
      td,
      th,
      tr {
        border: 1px solid rgba(255, 255, 255, 0.38);
        padding: 0.62rem;
      }
    }
  `,
};
