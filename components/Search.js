import { html, react, css } from 'https://unpkg.com/rplus-production@1.0.0';

const pushState = url => history.pushState(null, null, url);

export default ({ isSearching }) => {
  const [search, setSearch] = react.useState('');
  const [results, setResults] = react.useState([]);
  react.useEffect(() => {
    search &&
      fetch(`https://api.npms.io/v2/search/suggestions?size=10&q=${search}`)
        .then(res => res.json())
        .then(setResults);
  }, [search]);
  return !isSearching
    ? null
    : html`
        <dialog
          className=${css`
            & {
              background: #2a2c32 !important;
              color: #fff;
              overflow-y: auto;

              > div {
                width: 100%;
                max-width: 40rem;
                margin: 10rem auto 0 !important;
              }

              input {
                width: 100%;
                font-size: 2rem;
                padding: 0 2rem 1rem;
                background: none;
                border: 0;
                border-bottom: 2px solid rgba(255, 255, 255, 0.2);
                color: #fff;
                outline: none;
              }

              h2 {
                font-size: 2rem;
              }

              p {
                font-size: 1rem !important;
                text-align: left !important;
                max-width: 100% !important;
                margin-top: 1rem;
              }

              li {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding: 2rem;
              }

              li + li {
                border-top: 1px solid rgba(255, 255, 255, 0.1);
              }
            }
          `}
          open
        >
          <div>
            <input
              autoFocus
              value=${search}
              onChange=${e => setSearch(e.target.value)}
              placeholder="Search for a package..."
            />
            <ul key=${search}>
              ${results.map(
                result => html`
                  <li>
                    <h2>
                      <a
                        href=${`?${result.package.name}@${
                          result.package.version
                        }`}
                        onClick=${e =>
                          e.preventDefault() ||
                          pushState(
                            `?${result.package.name}@${result.package.version}`
                          )}
                      >
                        ${result.package.name}@${result.package.version}
                      </a>
                    </h2>
                    <p>${result.package.description}</p>
                  </li>
                `
              )}
            </ul>
          </div>
        </dialog>
      `;
};
