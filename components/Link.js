import { html } from 'rplus';
import shouldPreventDefault from '../utils/shouldPreventDefault.js';

const pushState = url => history.pushState(null, null, url);

export default ({ href, children, ...rest }) => {
  return html`
    <a
      href=${href}
      onClick=${e => {
        if (shouldPreventDefault(e)) {
          e.preventDefault();
          if (href.startsWith('/')) {
            pushState(`?${href.replace(/^\/\?/, '')}`);
          }
        } else {
          window.location = href;
        }
      }}
      ...${rest}
    >
      ${children}
    </a>
  `;
};
