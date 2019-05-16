import { html } from 'https://unpkg.com/rplus-production@1.0.0';

const pushState = url => history.pushState(null, null, url);

export default html`
  <dialog open>
    <div className="error">
      <h1 data-test="Error-Title">404</h1>
      <p>
        Oh no, we couldn't find that package! Check the package name was spelt
        correctly or create an issue.
      </p>
      <button data-test="Error-Button" onClick=${() => pushState('/')}>
        Return to the home page
      </button>
    </div>
  </dialog>
`;
