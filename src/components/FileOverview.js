import { css, html } from '../utils/rplus.js';
import Link from './Link.js';
import formatBytes from '../utils/formatBytes.js';
import { useStateValue } from '../utils/globalState.js';
import { FileIcon } from './FileIcon.tsx';
import { PackageIcon } from './PackageIcon.tsx';
import { SearchInput } from './SearchInput.tsx';

const FileList = ({ title, files, packageName, filter }) => html`
  <div key=${title}>
    <h2>${title}</h2>
    <small>${Object.entries(files).length} Files</small>
  </div>
  <ul>
    ${Object.entries(files).map(
      ([key, url]) =>
        url.match(filter) &&
        html`
          <li key=${key} data-test="Item">
            <${Link} href=${url.replace('https://unpkg.com/', '/?')}>
              <${url.includes(packageName) ? FileIcon : PackageIcon} />
              ${url.replace(`https://unpkg.com/`, '').replace(packageName, '')}
            <//>
          </li>
        `
    )}
  </ul>
`;

export const FileOverview = () => {
  const [{ request, cache, dependencySearchTerm }, dispatch] = useStateValue();
  const file = cache['https://unpkg.com/' + request.path];
  return (
    !!file &&
    html`
      <${SearchInput}
        placeholder="Search for dependencies.."
        value=${dependencySearchTerm}
        onChange=${val =>
          dispatch({ type: 'setDependencySearchTerm', payload: val })}
      />
      <div className=${styles.file}>
        <${FileIcon} />
        <span>
          ${file.url.split('/').pop()}
        </span>
        <small>${formatBytes(file.size)}</small>
      </div>
      <div className=${styles.container}>
        <${FileList}
          title="Dependencies"
          files=${file.dependencies}
          key="dependencies"
          packageName=${`${request.name}@${request.version}`}
          filter=${dependencySearchTerm}
        />
      </div>
    `
  );
};

const styles = {
  container: css`
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.62rem 1rem 1.62rem 1rem;
      small {
        margin-left: auto;
      }
    }
    > * + *,
    ul > * + * {
      border-top: 1px solid rgba(0, 0, 0, 0.2);
    }
    > *:empty {
      display: none;
    }
    a {
      display: flex;
      align-items: center;
      padding: 1rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      svg {
        flex: none;
        width: 1.2rem;
        height: 1.2rem;
        fill: rgba(255, 255, 255, 0.38);
        margin: 0 0.62rem 0 0.2rem;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
    h2 {
      font-size: 1.38rem;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.8);
    }
  `,
  file: css`
    padding: 1.38rem;
    border: 1px solid rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: bold;
    span {
      word-break: break-word;
      padding-right: 1rem;
      line-height: 138%;
    }
    small {
      font-size: 1rem;
      font-weight: normal;
      margin-left: auto;
      white-space: nowrap;
    }
    svg {
      flex: none;
      width: 1.62rem;
      height: 1.62rem;
      fill: rgba(255, 255, 255, 0.38);
      margin: 0 1rem 0 0rem;
    }
  `,
};
