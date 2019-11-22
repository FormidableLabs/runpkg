import { html, css } from 'rplus';
import { useStateValue } from '../utils/globalState.js';

export const RegistryOverview = (props = {}) => {
  const [state, dispatch] = useStateValue();
  console.log(state, dispatch);
  return html`
    <div className=${styles.container}>${props.children}</div>
  `;
};

const styles = {
  container: css`
    background: red;
  `,
};
