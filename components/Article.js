/* global prettier, prettierPlugins, marked */
import { html, css } from '../utils/rplus.js';

import Editor from './Editor.js';
import FileIcon from './FileIcon.js';
import PrettierIcon from './PrettierIcon.js';
import FormidableLogo from './FormidableLogo.js';
import RunpkgIcon from './RunpkgIcon.js';
import { useStateValue } from '../utils/globalState.js';

export default () => {
  const [{ request, cache }, dispatch] = useStateValue();
  const fileData = cache['https://unpkg.com/' + request.path] || {};
  return html`
    <article className=${styles.container}>
      ${request.path
        ? html`
            <header className=${styles.header}>
              <h1 data-testid="package-title">
                ${FileIcon}
                <span>
                  ${request.path}
                </span>
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
          `
        : html`
            <div className=${styles.welcome}>
              <a className=${styles.formidaLogo} href="https://formidable.com">
                ${FormidableLogo}
              </a>
              ${RunpkgIcon}
              <p>Search for and select a package to explore its contents</p>
              <a className=${styles.netlifyLogo} href="https://www.netlify.com">
                <img
                  src="https://www.netlify.com/img/global/badges/netlify-dark.svg"
                />
              </a>
            </div>
          `}
      ${fileData.extension === 'md'
        ? html`
            <div className=${styles.markdown}>
              <div
                dangerouslySetInnerHTML=${{
                  __html: marked(fileData.code),
                }}
              ></div>
            </div>
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
      overflow: hidden;
      > svg {
        flex: none;
        width: 1.38rem;
        height: 1.38rem;
        margin-right: 1rem;
        fill: rgba(255, 255, 255, 0.38);
      }
      > span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
      > span {
        white-space: nowrap;
      }
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

    @media screen and (max-width: 800px) {
      height: 62vh;
    }

    pre {
      color: rgba(255, 255, 255, 0.9);
    }
  `,
  welcome: css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    height: 100%;
    color: rgba(255, 255, 255, 0.62);
    flex: none;
    svg {
      margin-bottom: 2rem;
      width: calc(10rem + 5vw);
      .abbr {
        font-size: 230px;
        font-family: 'Helvetica';
      }
      .desc {
        font-size: 44px;
        font-family: 'Helvetica-Bold';
      }
    }
    p {
      font-size: calc(1rem + 0.5vw);
      width: 30ex;
      text-align: center;
      line-height: 138%;
    }
  `,
  formidaLogo: css`
    position: absolute;
    top: 2vw;
    left: 2vw;
    fill: rgba(255, 255, 255, 0.1);
    svg {
      width: calc(5rem + 5vw);
    }
  `,
  netlifyLogo: css`
    margin-top: 2rem;
  `,
  markdown: css`
    color: #fff;
    line-height: 1.5;
    line-height: 1.5;
    word-wrap: break-word;
    padding: 3rem 3rem 4rem;
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    color: rgba(255, 255, 255, 0.8);

    > div {
      max-width: 960px;
      margin: 0 auto;
    }

    > div > * + * {
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
