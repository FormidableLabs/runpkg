import { html } from 'https://unpkg.com/rplus-production@1.0.0';
import shouldPreventDefault from '../utils/shouldPreventDefault.js';

const pushState = url => history.pushState(null, null, url);

/** Link component props:
 * href = anchor href
 * innerText = text to display between anchor tags
 * customOnClick = a function (or boolean) that:
 * - disables the pushState function, and calls `customOnClick` instead, if it's a function.
 * - Allows you to also pass in `true` to simply disable `pushState` with no alternative function
 * noPreventDefault = falsy by default, set to `true` to disable our `preventDefault()`
 */

export default ({ href, innerText, customOnClick, noPreventDefault }) => {
  return html`
    <a
      href=${href}
      onClick=${e => {
        if (shouldPreventDefault(e) && !noPreventDefault) {
          e.preventDefault();
        }
        if (!customOnClick && href.startsWith('/')) {
          pushState(`?${href.replace(/^\/\?/, '')}`);
        }
        if (customOnClick && typeof customOnClick === 'function') {
          // Basic implementation, assumes no arguments for customOnClick - can expand if/when needed
          customOnClick();
        }
      }}
    >
      ${innerText}
    </a>
  `;
};
