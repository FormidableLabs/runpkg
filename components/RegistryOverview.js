import { html, css } from 'rplus';

import { SearchInput } from './SearchInput.js';
import PackageIcon from './PackageIcon.js';
import pushState from '../utils/pushState.js';
import { useStateValue } from '../utils/globalState.js';

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
      <ul className=${styles.list} key=${packagesSearchTerm}>
        ${packages.map(Package)}
      </ul>
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
      width: 2rem;
      height: 2rem;
      margin-right: 1rem;
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
      font-size: 1.38rem;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.8);
    }
  `,
};
