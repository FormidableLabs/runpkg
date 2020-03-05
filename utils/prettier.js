/* global prettier, prettierPlugins */
import PrettierIcon from '../components/PrettierIcon.js';
import CheckMarkIcon from '../components/PrettierCheckMarkIcon.js';
import LoadingIcon from '../components/PrettierLoadingIcon.js';
import ErrorIcon from '../components/PrettierErrorIcon.js';

/**
 * UTILS
 */

const getFinalExtension = ext =>
  ext ? ext.slice(ext.lastIndexOf('.') + 1) : ''; // Also works when no `.` present in string

/**
 * STATE SETUP
 */

const prettierButtonMessages = {
  before: 'Format Code',
  during: 'Formatting...',
  after: 'Formatted',
  error: 'Formatting Failed',
};

const beforePrettierState = {
  message: prettierButtonMessages.before,
  disabled: false, // redundant?
  icon: PrettierIcon,
};

const duringPrettierState = {
  message: prettierButtonMessages.during,
  disabled: true,
  icon: LoadingIcon,
};

const afterPrettierState = {
  message: prettierButtonMessages.after,
  disabled: true,
  icon: CheckMarkIcon,
};

const errorPrettierState = {
  message: prettierButtonMessages.error,
  disabled: true,
  icon: ErrorIcon,
};

const cannotPrettierState = {
  hidden: true,
  icon: null,
};

const pickInitialPrettierState = requestFile => {
  if (!prettierParserMap[getFinalExtension(requestFile)]) {
    return cannotPrettierState;
  }
  return beforePrettierState;
};

/**
 * HANDLING OF VARIOUS FILE TYPES
 * `parserScriptUrl`s from https://unpkg.com/browse/prettier@1.13.0/
 * `parserName`s from https://prettier.io/docs/en/options.html#parser
 */

const prettierParserMap = {
  css: {
    parserScriptUrl: 'https://unpkg.com/prettier@1.13.0/parser-postcss.js',
    parserName: 'css',
  },
  js: {
    parserScriptUrl: 'https://unpkg.com/prettier@1.13.0/parser-babylon.js',
    parserName: 'babylon',
  },
  json: {
    parserScriptUrl: 'https://unpkg.com/prettier@1.13.0/parser-babylon.js',
    parserName: 'json',
  },
  // TODO: uncomment markdown entry after addressing issue no. 181
  // https://github.com/FormidableLabs/runpkg/issues/181
  // md: {
  //   parserScriptUrl: 'https://unpkg.com/prettier@1.13.0/parser-markdown.js',
  //   parserName: 'markdown',
  // },
  less: {
    parserScriptUrl: 'https://unpkg.com/prettier@1.13.0/parser-postcss.js',
    parserName: 'css',
  },
  map: {
    // e.g. `vuetify@2.2.15/lib/components/VDatePicker/VDatePickerDateTable.js.map`
    parserScriptUrl: 'https://unpkg.com/prettier@1.13.0/parser-babylon.js',
    parserName: 'json',
  },
  mjs: {
    parserScriptUrl: 'https://unpkg.com/prettier@1.13.0/parser-babylon.js',
    parserName: 'babylon',
  },
  sass: {
    parserScriptUrl: 'https://unpkg.com/prettier@1.13.0/parser-postcss.js',
    parserName: 'css',
  },
  scss: {
    parserScriptUrl: 'https://unpkg.com/prettier@1.13.0/parser-postcss.js',
    parserName: 'css',
  },
  ts: {
    parserScriptUrl: 'https://unpkg.com/prettier@1.13.0/parser-typescript.js',
    parserName: 'typescript',
  },
};

/**
 * HANDLING PRETTIER FORMAT BUTTON PRESS
 */

const loadPrettierParserScriptForExtension = ({
  fileData,
  setPrettierButtonState,
  dispatch,
  request,
}) => {
  const trueExt = getFinalExtension(fileData.extension);
  const parserLangConfig = prettierParserMap[trueExt];

  if (!parserLangConfig) {
    // This *should* never happen thanks to `pickInitialPrettierState`
    console.error(
      'File extension not supported. Prettier button should be hidden/disabled'
    );
    setPrettierButtonState(cannotPrettierState);
    return;
  }

  const scriptUrl = parserLangConfig.parserScriptUrl;

  const isScriptAlreadyPresent = [
    ...document.querySelectorAll('head script'),
  ].some(script => script.src === scriptUrl);

  const tryToPrettify = () => {
    try {
      const code = prettier.format(fileData.code, {
        parser: parserLangConfig.parserName,
        plugins: prettierPlugins,
      });
      dispatch({
        type: 'setCache',
        payload: {
          ['https://unpkg.com/' + request.path]: {
            ...fileData,
            code,
          },
        },
      });
      setPrettierButtonState(afterPrettierState);
    } catch (e) {
      console.error(e);
      setPrettierButtonState(errorPrettierState);
    }
  };

  if (isScriptAlreadyPresent) {
    tryToPrettify();
    return;
  }

  // If we have have a parser for this extension and the script isn't already imported...
  const parserScript = document.createElement('script');
  parserScript.src = scriptUrl;
  parserScript.onload = () => {
    tryToPrettify();
  };

  document.head.appendChild(parserScript);
};

export {
  prettierButtonMessages,
  duringPrettierState,
  errorPrettierState,
  loadPrettierParserScriptForExtension,
  pickInitialPrettierState,
};
