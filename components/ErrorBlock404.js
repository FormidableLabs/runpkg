import { html } from 'https://unpkg.com/rplus';

const pushState = url => history.pushState(null, null, url);

const ErrorBlock404 = setFetchErrorStatus => html`
  <dialog open>
    <div className="error">
      <h1>404</h1>
      <p>
        Oh no! It looks like you're trying to find a package that doesn't exist.
        Please check that its name is spelled correctly.
      </p>
      <button
        onClick=${() => {
          setFetchErrorStatus(false);
          return pushState('/');
        }}
      >
        Return to the home page
      </button>
    </div>
  </dialog>
`;

export default ErrorBlock404;
