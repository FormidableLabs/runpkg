import { react, html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import { SearchInput } from './SearchInput.js';
import pushState from '../utils/pushState.js';

export const RegistryOverview = (props = {}) => {
  const [searchTerm, setSearchTerm] = react.useState('');
  const [results, setResults] = react.useState([]);
  react.useEffect(() => {
    if (searchTerm)
      fetch(`https://api.npms.io/v2/search/suggestions?size=10&q=${searchTerm}`)
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

const Package = ({ name, version, description }) => html`
  <li>
    <a
      className=${styles.item}
      href=${`?${name}@${version}`}
      onClick=${e => e.preventDefault() || pushState(`?${name}@${version}`)}
    >
      <h2>
        ${name}@${version}
      </h2>
      <p>${description}</p>
    </a>
  </li>
`;

const styles = {
  container: css`
    > * + * {
      margin-top: 1.62rem;
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
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.62rem;
    > * + * {
      margin-top: 1rem;
    }
    &:hover {
      color: #fff;
    }
  `,
};
