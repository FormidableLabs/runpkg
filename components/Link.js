import { html } from 'https://unpkg.com/rplus-production@1.0.0';
import shouldPreventDefault from '../utils/shouldPreventDefault.js';

export default ({ href, onClick, innerText }) => {
  return html`
    <a
      href=${href}
      onClick=${e => {
        if (shouldPreventDefault(e)) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      ${innerText}
    </a>
  `;
};
