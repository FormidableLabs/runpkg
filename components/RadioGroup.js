import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';

export const RadioGroup = ({ options, onClick }) => html`
  <div className=${styles}>
    ${Object.entries(options).map(
      ([key, selected]) => html`
        <button
          onMouseDown=${() => onClick(key)}
          onClick=${() => onClick(key)}
          disabled=${selected}
        >
          ${key}
        </button>
      `
    )}
  </div>
`;

const styles = css`
  display: flex;
  background: rgba(0, 0, 0, 0.1);
  > button {
    padding: 1.38rem 1rem;
    font-size: 1rem;
    flex: 1 1 100%;
    border: 0;
    color: #fff;
    text-transform: capitalize;
    background: rgba(0, 0, 0, 0.1);
    &:not(:disabled) {
      opacity: 0.38;
      background: transparent;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
  > * + * {
    border-left: 1px solid rgba(0, 0, 0, 0.2) !important;
  }
`;
