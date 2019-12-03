import { html, css } from '../utils/rplus.js';

import { SearchInput } from './SearchInput.js';
import PackageIcon from './PackageIcon.js';
import { useStateValue } from '../utils/globalState.js';

const pushState = url => history.pushState(null, null, url);

export const RegistryOverview = () => {
  const [{ packages, packagesSearchTerm }, dispatch] = useStateValue();
  return html`
    <div className=${styles.container}>
      <${SearchInput}
        placeholder="Search for packages.."
        value=${packagesSearchTerm}
        onChange=${val =>
          dispatch({ type: 'setPackagesSearchTerm', payload: val })}
      />
      ${!packages.length &&
        packagesSearchTerm &&
        html`
          <h2>No packages found</h2>
        `}
      ${packages.length
        ? html`
            <ul className=${styles.list} key=${packagesSearchTerm}>
              ${packages.map(Package)}
            </ul>
          `
        : null}
    </div>
  `;
};

export const Package = ({ name, version, description }) => html`
  <li>
    <a
      className=${styles.item}
      href=${`?${name}@${version}`}
      onClick=${e => {
        e.preventDefault();
        pushState(`?${name}@${version}`);
      }}
    >
      <div>
        ${PackageIcon}
        <h2>${name}</h2>
        <small>v${version}</small>
      </div>
      <p>${description}</p>
    </a>
  </li>
`;

const styles = {
  container: css`
    > * + * {
      margin-top: 1.38rem;
    }
  `,
  list: css`
    > * + * {
      margin-top: 1rem;
    }
  `,
  item: css`
    position: relative;
    cursor: pointer;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.62);
    border: 1px solid rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.38rem 1.62rem;
    > div {
      display: flex;
      align-items: center;
    }
    small {
      position: absolute;
      top: 0rem;
      right: 0rem;
      display: block;
      font-size: 0.8rem;
      padding-top: 0.38rem;
      background: rgba(0, 0, 0, 0.1);
      padding: 0.38rem;
    }
    svg {
      width: 1.8rem;
      height: 1.8rem;
      margin-right: 0.8rem;
      fill: rgba(255, 255, 255, 0.38);
    }
    > * + *:not(:empty) {
      margin-top: 0.62rem;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
    > p {
      line-height: 162%;
    }
    h2 {
      font-size: 1.2rem;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.8);
      word-break: break-word;
    }
  `,
};
