import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';
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
    font-size: 1rem;
    background: transparent;
    color: rgba(255, 255, 255, 0.62);
  }
  > svg {
    width: 2rem;
    height: 2rem;
    fill: rgba(255, 255, 255, 0.2);
    margin: 0 1rem;
  }
`;
