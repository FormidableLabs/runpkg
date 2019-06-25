import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';
import ProjectBadge from './ProjectBadge/index.js';
import FormidableLogo from './FormidableLogo.js';

const pushState = url => history.pushState(null, null, url);

export default html`
  <dialog open>
    <a href="https://formidable.com">
      ${FormidableLogo}
    </a>
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
        className="openProject"
        data-test="Overlay-Button"
        onClick=${() => pushState('?lodash-es')}
      >
        Explore An Example Package
      </button>
      <h6
        className=${css`
          & {
            text-transform: uppercase;
            line-height: 162%;
          }
        `}
      >
        To search packages: press cmd + p (Mac) or ctrl + p (Windows & Linux)
      </h6>
    </div>
  </dialog>
`;
