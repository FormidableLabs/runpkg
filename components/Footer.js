import { html } from 'https://unpkg.com/rplus-production@1.0.0';

import FormidableIcon from './FormidableLogo.js';
import GitHubLogo from './GitHubLogo.js';

export default () => html`
  <footer>
    <a href="https://formidable.com/blog/2019/runpkg/">
      <p>Read about how we made this at Formidable</p>
      ${FormidableIcon}</a
    >
    <a
      href="https://github.com/formidablelabs/runpkg"
      aria-label="Project GitHub Repo"
    >
      ${GitHubLogo}
    </a>
  </footer>
`;
