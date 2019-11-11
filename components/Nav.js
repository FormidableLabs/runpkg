import { html, react, css } from 'https://unpkg.com/rplus-production@1.0.0';

import { RadioGroup } from './RadioGroup.js';
import { PackageOverview } from './PackageOverview.js';
import { RegistryOverview } from './RegistryOverview.js';

export default ({ file, versions }) => {
  const [mode, setMode] = react.useState('package');
  const modeOptions = {
    registry: mode === 'registry',
    package: mode === 'package',
    file: mode === 'file',
  };

  return html`
    <nav className=${styles}>
      <${RadioGroup} options=${modeOptions} onClick=${setMode} />
      ${mode === 'package'
        ? PackageOverview({
            file,
            versions,
          })
        : mode === 'registry'
        ? html`
            <${RegistryOverview} />
          `
        : mode === 'file'
        ? html`
            <h1>Registry Search</h1>
          `
        : null}
    </nav>
  `;
};

const styles = css`
  transform: translateX(-100%);
  width: 100%;
  grid-area: nav;
  background: #26272c;
  color: #fff;
  position: absolute;
  z-index: 2;
  left: 0;
  padding: 2rem;
  transition: transform 0.25s;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;

  > * + * {
    margin-top: 1.38rem;
  }

  > .row[justify='space-between'] {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 1rem;
  }

  &.active {
    box-shadow: 1rem 1rem 1rem rgba(0, 0, 0, 0.1);
    transform: translateX(0%);
    @media screen and (min-width: 1000px) {
      box-shadow: none;
    }
  }

  h2 {
    font-size: 1.38rem;
    font-weight: bold;
  }

  span {
    font-size: 1.38rem;
  }

  @media screen and (min-width: 1000px) {
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
    @media screen and (min-width: 1000px) {
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
