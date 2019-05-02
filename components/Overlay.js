import { html } from 'https://unpkg.com/rplus';
import ProjectBadge from './ProjectBadge.js';

const pushState = url => history.pushState(null, null, url);

const Overlay = () => html`
  <div className="Overlay">
    <${ProjectBadge}
      color="#ca5688"
      abbreviation="Rp"
      description="runpkg"
      number="43"
    />
    <p>
      Explore, learn about and perform static analysis on npm packages in the
      browser.
    </p>
    <button className="Overlay-Button" onClick=${() => pushState('?lodash-es')}>
      Start Exploring
    </button>
  </div>
`;

export default Overlay;
