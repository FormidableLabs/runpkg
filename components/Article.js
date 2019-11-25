import { html, css } from '../utils/rplus.js';

import Editor from './Editor.js';
import FileIcon from './FileIcon.js';
import PrettierIcon from './PrettierIcon.js';
import { useStateValue } from '../utils/globalState.js';

export default () => {
  const [{ request, cache }, dispatch] = useStateValue();
  const fileData = cache['https://unpkg.com/' + request.path] || {};
  return html`
    <article className=${styles.container}>
      ${request.path &&
        html`
          <header className=${styles.header}>
            <h1>
              ${FileIcon} ${request.path}
            </h1>
            <button
              onClick=${() => {
                const code = prettier.format(fileData.code, {
                  parser: 'babylon',
                  plugins: prettierPlugins,
                });
                dispatch({
                  type: 'setCache',
                  payload: {
                    ['https://unpkg.com/' + request.path]: {
                      ...fileData,
                      code,
                    },
                  },
                });
              }}
            >
              ${PrettierIcon}
              <span>Format Code</span>
            </button>
          </header>
        `}
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
  header: css`
    display: flex;
    align-items: center;
    padding: 1rem 1.38rem;
    background: rgba(0, 0, 0, 0.162);
    > h1 {
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.62);
      > svg {
        width: 1.38rem;
        height: 1.38rem;
        margin-right: 1rem;
        fill: rgba(255, 255, 255, 0.38);
      }
    }
    > button {
      display: flex;
      align-items: center;
      background: none;
      border: 1px solid rgba(0, 0, 0, 0.2);
      padding: 1rem;
      margin-left: auto;
      color: rgba(255, 255, 255, 0.8);
      font-size: 1rem;
      > svg {
        width: 1rem;
        height: 1rem;
      }
      > * + * {
        margin-left: 0.62rem;
      }
    }
  `,
  container: css`
    grid-area: article;
    overflow: hidden;
    flex: 1 0 62%;
    display: flex;
    flex-direction: column;

    &:empty {
      align-items: center;
      justify-content: center;
      ::before {
        font-size: 8rem;
        content: '📦';
        margin-bottom: 1.62rem;
        opacity: 0.62;
      }

      ::after {
        content: 'Search for and select a package to explore its contents';
        font-size: 1.38rem;
        max-width: 30ex;
        line-height: 138%;
        text-align: center;
        color: rgba(255, 255, 255, 0.38);
        padding: 0 2rem;
      }
    }

    @media screen and (max-width: 800px) {
      height: 62vh;
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
    -webkit-overflow-scrolling: touch;
    color: rgba(255, 255, 255, 0.8);
    > * + * {
      margin-top: 1rem;
    }

    @media screen and (max-width: 400px) {
      padding: 2rem;
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
