import { html } from 'https://unpkg.com/rplus';
import formatBytes from '../utils/formatBytes.js';

const pushState = url => history.pushState(null, null, url);

const FileList = ({ title, files, cache, packageName }) => html`
  <div>
    <h3>${title}</h3>
    <span>${files.length} Files</span>
  </div>
  <ul key=${files.join('-')}>
    ${files.map(
      x => html`
        <li key=${x} data-test=${title + 'Item'}>
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
  const { name, version } = packageJSON;
  return html`
    <aside key="aside">
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
