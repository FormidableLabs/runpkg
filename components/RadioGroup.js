import { html, css } from 'https://unpkg.com/rplus-production@1.0.0';

export const RadioGroup = ({ options, onClick }) => html`
  <div className=${styles}>
    ${Object.entries(options).map(
      ([key, val]) => html`
        <div onClick=${e => onClick(key)}>
          <input type="radio" name="mode" checked=${val} />
          <label>${key}</label>
        </div>
      `
    )}
  </div>
`;

const styles = css`
  display: flex;
  background: rgba(0, 0, 0, 0.1);
  > div {
    position: relative;
    flex: 1 1 100%;
    height: 3.6rem;
    input,
    label {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      user-select: none;
    }
    input {
      opacity: 0;
      z-index: 1;
    }
    input:checked + label {
      background: rgba(0, 0, 0, 0.2);
    }
    label {
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: capitalize;
    }
  }
  > * + * {
    border-left: 1px solid rgba(0, 0, 0, 0.1);
  }
`;
