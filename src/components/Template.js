import { html, css } from '../utils/rplus.js';
import { useStateValue } from '../utils/globalState.js';

export const TemplateComponent = (props = {}) => {
  const [state, dispatch] = useStateValue();
  return html`
    <div
      className=${styles.container}
      onClick=${() => dispatch({ type: 'action', payload: state + 1 })}
    >
      ${props.children}
    </div>
  `;
};

const styles = {
  container: css`
    background: red;
  `,
};
