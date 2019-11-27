import { react, html, css } from '../utils/rplus.js';

const TreeView = ({ children }) =>
  html`
    <ul className=${styles.root}>
      ${react.Children.map(children, child =>
        react.cloneElement(child, { root: true })
      )}
    </ul>
  `;

const TreeItem = ({ children, label, root = false }) => {
  const expandable = children && react.Children.count(children) > 0;
  const [expanded, setExpanded] = react.useState(root);

  return expandable
    ? html`
        <ul className=${styles.branch}>
          <li>
            <button
              onClick=${() => setExpanded(!expanded)}
              className=${styles.button}
            >
              <span
                className=${`${styles.chevron} ${
                  expanded ? styles.expanded : ''
                }`}
              >
                \u25ba
              </span>
              ${label}
            </button>
          </li>
          ${expanded ? children : null}
        </ul>
      `
    : html`
        <li className=${styles.leaf}>${label}</li>
      `;
};

export const styles = {
  root: css`
    margin-left: -1.38rem;
    border-left: none;

    li {
      position: relative;
    }
  `,
  branch: css`
    position: relative;
    word-break: break-word;
    margin-left: 1.5rem;

    &:before {
      display: block;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-right: 2px dotted #4b4b4e;
    }
  `,
  button: css`
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    width: 100%;
    cursor: pointer;
  `,
  chevron: css`
    position: absolute;
    top: 0;
    left: 0px;
    top: 50%;
    font-size: 0.8rem;
    padding: 0.2rem;
    z-index: 2;
    background: #26272d;
    color: #9c9c9c;
    transform: translate(-50%, -50%);
  `,
  expanded: css`
    transform: translate(-50%, -50%) rotate(90deg);
  `,
  leaf: css`
    position: relative;
    margin-left: 1.5rem;

    &:before,
    &:after {
      display: block;
      content: '';
      position: absolute;
      left: 0;
      border-color: ;
    }

    &:after {
      top: 50%;
      width: 1rem;
      border-bottom: 2px solid #4b4b4e;
    }

    &:before {
      top: 0;
      height: 100%;
      border-left: 2px solid #4b4b4e;
    }
    &:last-child {
      &:before {
        height: 50%;
      }
    }
  `,
};

export { TreeView, TreeItem };
