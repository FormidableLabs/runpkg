import { html } from 'https://unpkg.com/rplus';
import formatBytes from '../utils/formatBytes.js';

const pushState = url => history.pushState(null, null, url);

const NpmLogo = html`
  <svg viewBox="0 0 780 250">
    <title>NPM repo link</title>
    <path
      fill="#fff"
      d="M240,250h100v-50h100V0H240V250z M340,50h50v100h-50V50z M480,0v200h100V50h50v150h50V50h50v150h50V0H480z M0,200h100V50h50v150h50V0H0V200z"
    ></path>
  </svg>
`;

const FileList = ({ title, files, cache, packageName }) => html`
  <div>
    <h3>${title}</h3>
    <span>${files.length} Files</span>
  </div>
  <ul key=${files.join('-')}>
    ${files.map(
      x => html`
        <li key=${x} data-test=${title + 'Item'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0V0z" />
            <path
              d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"
            />
          </svg>
          <a
            onClick=${e => {
              e.preventDefault();
              pushState(`?${x.replace('https://unpkg.com/', '')}`);
            }}
          >
            <span>
              ${x.replace(`https://unpkg.com/`, '').replace(packageName, '')}
            </span>
            <span>${formatBytes(cache[x].code.length)}</span>
          </a>
        </li>
      `
    )}
  </ul>
`;

export default ({ cache, packageJSON, request }) => {
  const file = cache[`https://unpkg.com/${request.url}`];
  const { name, version, main, license, description } = packageJSON;
  const packageMainUrl = `?${name}@${version}/${main}`;
  const npmUrl = 'https://npmjs.com/' + name;

  return html`
    <aside key="aside">
      <h1 onClick=${() => pushState(packageMainUrl)} data-test="title">
        ${name}
      </h1>
      <span className="info-block">
        <p>v${version}</p>
        <p>${license}</p>
        <a href=${npmUrl}>${NpmLogo}</a>
      </span>
      <p>
        ${description || 'There is no description for this package.'}
      </p>
      ${file &&
        html`
          <${FileList}
            title="Dependencies"
            files=${file.dependencies}
            cache=${cache}
            packageName=${`${name}@${version}`}
          />
          <${FileList}
            title="Dependants"
            files=${file.dependants}
            cache=${cache}
            packageName=${`${name}@${version}`}
          />
        `}
    </aside>
  `;
};
