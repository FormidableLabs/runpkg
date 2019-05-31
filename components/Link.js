import { html } from 'https://unpkg.com/rplus-production@1.0.0';
import shouldPreventDefault from '../utils/shouldPreventDefault.js';

export default ({ href, onClick, innerText }) => {
  return html`
    <a
      href=${x.url.replace('https://unpkg.com/', '/?')}
      onClick=${e => {
        if (shouldPreventDefault(e)) {
          e.preventDefault();
          pushState(`?${x.url.replace('https://unpkg.com/', '')}`);
        }
      }}
    >
      ${x.url.replace(`https://unpkg.com/`, '').replace(packageName, '')}
    </a>
  `;
};

/**
 * <a
      href=${x.url.replace('https://unpkg.com/', '/?')}
      onClick=${e => {
        if (shouldPreventDefault(e)) {
          e.preventDefault();
          pushState(`?${x.url.replace('https://unpkg.com/', '')}`);
        }
      }}
    >
      ${x.url.replace(`https://unpkg.com/`, '').replace(packageName, '')}
    </a>
 * 
 */
