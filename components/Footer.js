import { html, css } from 'rplus';

import FormidableIcon from './FormidableLogo.js';
import GitHubLogo from './GitHubLogo.js';

export default () => html`
  <footer className=${styles}>
    <a href="https://formidable.com/blog/2019/runpkg/">
      <p>Read about the making of runpkg</p>
      ${FormidableIcon}
    </a>
    <a href="https://github.com/formidablelabs/runpkg">
      ${GitHubLogo}
      <span>Visit the runpkg GitHub repo</span>
    </a>
  </footer>
`;

const styles = css`
  background: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.6);
  padding: 1.38rem 1.62rem;
  display: flex;
  align-items: center;

  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:first-child {
      width: 100%;
    }
  }

  svg {
    width: 1.62rem;
    height: 1.62rem;
    fill: currentColor;
    margin-left: 1rem;
  }

  a > span {
    position: absolute;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }
`;
