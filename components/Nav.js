import { html, css } from '../utils/rplus.js';
import { RadioGroup } from './RadioGroup.js';
import { PackageOverview } from './PackageOverview.js';
import { RegistryOverview } from './RegistryOverview.js';
import { FileOverview } from './FileOverview.js';
import { useStateValue } from '../utils/globalState.js';

export default ({ worker }) => {
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
            <${FileOverview} worker=${worker} />
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
  overflow-x: hidden;
  > * + * {
    margin-top: 1.38rem;
  }
  @media screen and (min-width: 800px) {
    height: 100vh;
    overflow-y: scroll;
    transform: translateX(0%);
  }
  @media screen and (max-width: 400px) {
    padding: 1.38rem;
    > * + * {
      margin-top: 1rem;
    }
  }
`;
