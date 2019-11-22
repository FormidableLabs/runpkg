import { html } from '../utils/rplus.js';

const pushState = url => history.pushState(null, null, url);

const getOrigin = loc =>
  loc.protocol + '//' + loc.hostname + (loc.port ? ':' + loc.port : '');

const isExternal = anchorElement =>
  getOrigin(location) !== getOrigin(anchorElement);

const shouldPreventDefault = e => {
  if (
    e.button !== 0 ||
    e.altKey ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.target.target === '_blank' ||
    isExternal(e.currentTarget)
  ) {
    return false;
  } else {
    return true;
  }
};

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
