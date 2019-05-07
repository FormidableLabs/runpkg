import { html } from 'https://unpkg.com/rplus';
import ProjectBadge from './ProjectBadge/index.js';

const pushState = url => history.pushState(null, null, url);

export default html`
  <dialog open>
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
      <button onClick=${() => pushState('?lodash-es')}>
        Start Exploring
      </button>
    </div>
  </dialog>
`;
