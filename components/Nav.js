import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import { RadioGroup } from './RadioGroup.js';
import { PackageOverview } from './PackageOverview.js';
import { RegistryOverview } from './RegistryOverview.js';
import { FileOverview } from './FileOverview.js';
import { useStateValue } from '../utils/globalState.js';

import Footer from './Footer.js';

export default () => {
  const [{ mode }, dispatch] = useStateValue();
  const modeOptions = {
    registry: mode === 'registry',
    package: mode === 'package',
    file: mode === 'file',
  };
  return html`
    <nav className=${styles}>
      <${RadioGroup}
        options=${modeOptions}
        onClick=${val => dispatch({ type: 'setMode', payload: val })}
      />
      ${mode === 'package'
        ? html`
            <${PackageOverview} />
          `
        : mode === 'registry'
        ? html`
            <${RegistryOverview} />
          `
        : mode === 'file'
        ? html`
            <${FileOverview} />
          `
        : null}

      <${Footer} />
    </nav>
  `;
};

const styles = css`
  width: 100%;
  grid-area: nav;
  background: #26272c;
  color: #fff;
  padding: 2rem;
  overflow-x: hidden;

  @media screen and (min-width: 800px) {
    height: 100vh;
    overflow-y: scroll;
  }

  > * + * {
    margin-top: 1.38rem;
  }

  h2 {
    font-size: 1.38rem;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.8);
  }

  @media screen and (min-width: 800px) {
    position: inherit;
    z-index: initial;
    width: auto;
    transform: translateX(0%);
    background: rgba(0, 0, 0, 0.2);
  }
`;
