import { html } from 'https://unpkg.com/rplus';
import formatBytes from '../routes/home/utils/formatBytes.js';
import totalPackageSize from '../routes/home/utils/totalPackageSize.js';

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
        <li key=${x}>
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
  const { name, version, main, readme, license, description } = packageJSON;
  const packageMainUrl = `?${name}@${version}/${main}`;

  return html`
    <aside key="aside">
      <h1 onClick=${() => pushState(packageMainUrl)} data-test="title">
        ${name}
      </h1>
      <span className="info-block">
        <p>v${version}</p>
        <p>${license}</p>
        <a href=${readme}>${NpmLogo}</a>
      </span>
      <p>
        ${description || 'There is no description for this package.'}
      </p>
      ${file &&
        html`
          <div>
            <h3>Package Size</h3>
            <span>${formatBytes(totalPackageSize(cache))}</span>
          </div>
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
