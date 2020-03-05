// [...document.querySelectorAll("head script")].some(script => script.src === "https://unpkg.com/prettier@1.13.0/parser-babylon.js")

const prettierButtonMessages = {
  initial: 'Format Code',
  during: 'Formatting...',
  after: 'Formatted',
  error: 'Formatting Failed',
};

const initialPrettierState = {
  message: prettierButtonMessages.initial,
  disabled: false,
};

const duringPrettierState = {
  message: prettierButtonMessages.during,
  disabled: true,
};

const afterPrettierState = {
  message: prettierButtonMessages.after,
  disabled: true,
};

const errorPrettierState = {
  message: prettierButtonMessages.error,
  disabled: true,
};

export {
  prettierButtonMessages,
  initialPrettierState,
  duringPrettierState,
  afterPrettierState,
  errorPrettierState,
};
