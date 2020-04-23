import { html } from '../utils/rplus.js';

/**
 * `loader` from https://feathericons.com/
 * animateTransform adapted from https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateTransform
 *
 * NOTE: This will not actually animate in its current usage as it gets blocked by the synchronous prettier format function
 * May be able to use Web Worker...
 */

export default html`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-loader"
  >
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="rotate"
      from="0"
      to="360"
      dur="2.5s"
      repeatCount="indefinite"
    />
  </svg>
`;
