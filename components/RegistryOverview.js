import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import { SearchInput } from './SearchInput.js';
import PackageIcon from './PackageIcon.js';
import pushState from '../utils/pushState.js';

export const RegistryOverview = () => {
  const [searchTerm, setSearchTerm] = react.useState('');
  const [results, setResults] = react.useState([]);
  react.useEffect(() => {
    fetch(
      `https://api.npms.io/v2/search/suggestions?size=10&q=${searchTerm ||
        'urql'}`
    )
      .then(res => res.json())
      .then(res => res.map(x => x.package))
      .then(setResults);
  }, [searchTerm]);
  return html`
    <div className=${styles.container}>
      <${SearchInput}
        placeholder="Search for packages.."
        value=${searchTerm}
        onChange=${setSearchTerm}
      />
      <ul className=${styles.list} key=${searchTerm}>
        ${results.map(Package)}
      </ul>
    </div>
  `;
};

export const Package = ({ name, version, description }) => html`
  <li>
    <a
      className=${styles.item}
      href=${`?${name}@${version}`}
      onClick=${e => e.preventDefault() || pushState(`?${name}@${version}`)}
    >
      <h2>
        <${PackageIcon} />
        <span>${name}</span>
      </h2>
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
    cursor: pointer;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.62);
    border: 1px solid rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.38rem 1.62rem;
    h2 {
      display: flex;
      align-items: center;
    }
    svg {
      width: 1.62rem;
      height: 1.62rem;
      margin-right: 1rem;
      fill: rgba(255, 255, 255, 0.62);
    }
    > * + * {
      margin-top: 1rem;
    }
    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
    > p {
      line-height: 162%;
    }
  `,
};
