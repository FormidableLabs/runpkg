import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';

export const RegistryOverview = (props = {}) => html`
  <div className=${styles}>${props.children}</div>
`;

const styles = css`
  background: red;
`;
