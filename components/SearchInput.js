import { html, css } from '../utils/rplus.js';
import SearchIcon from './SearchIcon.js';

export const SearchInput = ({ placeholder, value, onChange }) => html`
  <div className=${styles}>
    <input
      autofocus
      value=${value}
      onChange=${e => onChange(e.target.value)}
      placeholder=${placeholder}
    />
    ${SearchIcon}
  </div>
`;

const styles = css`
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  > input {
    width: 100%;
    padding: 1.38rem;
    border: 0;
    font-size: 1.38rem;
    background: transparent;
    color: rgba(255, 255, 255, 0.62);
  }
  > svg {
    width: 2.8rem;
    height: 2.8rem;
    fill: rgba(255, 255, 255, 0.2);
    margin: 0 1rem;
  }
`;
