import { html } from 'https://unpkg.com/rplus-production@1.0.0';
import shouldPreventDefault from '../utils/shouldPreventDefault.js';

const pushState = url => history.pushState(null, null, url);

export default ({ href, children }) => {
  return html`
    <a
      href=${href}
      onClick=${e => {
        if (shouldPreventDefault(e)) {
          e.preventDefault();
          if (href.startsWith('/')) {
            pushState(`?${href.replace(/^\/\?/, '')}`);
          }
        }
      }}
    >
      ${children}
    </a>
  `;
};
