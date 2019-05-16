import { html } from 'https://unpkg.com/rplus-production@1.0.0';
import ProjectBadge from './ProjectBadge/index.js';
import FormidableLogo from './FormidableLogo.js';

const pushState = url => history.pushState(null, null, url);

export default html`
  <dialog open>
    ${FormidableLogo}
    <div className="overlay">
      <${ProjectBadge}
        color="#80EAC7"
        abbreviation="Rp"
        description="runpkg"
        number="43"
      />
      <p>
        Explore, learn about and perform static analysis on npm packages in the
        browser.
      </p>
      <button
        data-test="Overlay-Button"
        onClick=${() => pushState('?lodash-es')}
      >
        Explore An Example Package
      </button>
      <h6>PRESS CMD+P TO SEARCH PACKAGES</h6>
    </div>
  </dialog>
`;
