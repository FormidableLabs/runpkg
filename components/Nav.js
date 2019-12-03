import { html, css } from '../utils/rplus.js';
import { RadioGroup } from './RadioGroup.js';
import { PackageOverview } from './PackageOverview.js';
import { RegistryOverview } from './RegistryOverview.js';
import { FileOverview } from './FileOverview.js';
import { useStateValue } from '../utils/globalState.js';

export default () => {
  const [state, dispatch] = useStateValue();
  const isCompact = !state.packagesSearchTerm && !state.request.name;

  const modeOptions = !state.request.name
    ? {
        registry: true,
      }
    : {
        registry: state.mode === 'registry',
        package: state.mode === 'package',
        file: state.mode === 'file',
      };

  let children = null;
  switch (state.mode) {
    case 'package':
      children = html`
        <${PackageOverview} />
      `;
      break;
    case 'registry':
      children = html`
        <${RegistryOverview} />
      `;
      break;
    case 'file':
      children = html`
        <${FileOverview} />
      `;
      break;
  }

  return html`
    <nav className=${isCompact ? `${styles} ${compactStyles}` : styles}>
      <${RadioGroup}
        options=${modeOptions}
        onClick=${val => dispatch({ type: 'setMode', payload: val })}
      />
      ${children}
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
  box-shadow: none;
  transition-property: margin, border-radius, height, box-shadow;
  transition-duration: 0.6s;

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

const compactStyles = css`
  @media screen and (min-width: 800px) {
    margin: 1rem;
    border-radius: 0.5rem;
    box-shadow: 3px 2px 4px 1px rgba(10, 10, 10, 0.05);
    height: auto;
  }
`;
