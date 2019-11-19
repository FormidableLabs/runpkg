import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';

import { RadioGroup } from './RadioGroup.js';
import { PackageOverview } from './PackageOverview.js';
import { RegistryOverview } from './RegistryOverview.js';
import { FileOverview } from './FileOverview.js';
import { useStateValue } from '../utils/globalState.js';

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
    </nav>
  `;
};

const styles = css`
  width: 100%;
  grid-area: nav;
  background: #26272c;
  color: #fff;
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;

  @media screen and (min-width: 800px) {
    height: 100vh;
  }

  > * + * {
    margin-top: 1.38rem;
  }

  &.active {
    box-shadow: 1rem 1rem 1rem rgba(0, 0, 0, 0.1);
    transform: translateX(0%);
    @media screen and (min-width: 800px) {
      box-shadow: none;
    }
  }

  h2 {
    font-size: 1.38rem;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.8);
  }

  span {
    font-size: 1.38rem;
  }

  @media screen and (min-width: 800px) {
    position: inherit;
    z-index: initial;
    width: auto;
    transform: translateX(0%);
    background: rgba(0, 0, 0, 0.2);
  }

  > button.toggleCloseButton {
    position: fixed;
    right: 1em;
    top: 1em;
    background-color: transparent;
    border: none;
    fill: #fff;
    @media screen and (min-width: 800px) {
      display: none;
    }
  }

  > button.searchButton {
    width: 100%;
    top: 0;
    left: 0;
    position: fixed;
    display: flex;
    align-items: center;
    background: #2a2c32;
    border: none;
    fill: rgba(255, 255, 255, 0.62);
    color: rgba(255, 255, 255, 0.62);
    text-align: center;
    padding: 1rem 0rem 1rem 2rem;
    font-size: 0.9rem;
    > svg {
      width: 1.2rem;
      height: 1.2rem;
    }
    > span {
      margin-left: 0.3rem;
    }
    &:hover {
      fill: #fff;
      color: #fff;
    }
  }
`;
