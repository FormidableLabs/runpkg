import { react as React, html } from 'https://unpkg.com/rplus-production@1.0.0';

import pushState from '../utils/pushState.js';

// redirects req from unpkg -> runpkg
const handleEditorOnClick = e => {
  const href = e.nativeEvent.target.parentNode.href;
  if (href) {
    e.preventDefault();
    pushState(href.replace('https://unpkg.com/', '?'));
  }
};

const handleCtrlDown = e => {
  if (e.metaKey || e.ctrlKey) {
    document.querySelectorAll('.imports').forEach(x => x.classList.add('ctrl'));
  }
};

const handleCtrlUp = e => {
  if (e.key === 'meta' || e.key === 'ctrlKey') {
    document
      .querySelectorAll('.imports')
      .forEach(x => x.classList.remove('ctrl'));
  }
};

// this function maps over dependencies and appends
// anchor tags to imports in the editor
const anchorAppender = deps => {
  const dependenciesArray = deps.map(x => [x[0], x[1]]);
  dependenciesArray.forEach(y => {
    const imports = [...document.querySelectorAll('.token.string')].find(x =>
      x.innerText.includes(y[0])
    );
    if (!imports) {
      return;
    }
    const clonedImports = imports.cloneNode(true);
    clonedImports.classList.add('imports');
    const anchor = document.createElement('a');
    anchor.href = y[1];
    anchor.appendChild(clonedImports);
    imports.replaceWith(anchor);
  });
  return;
};

/*eslint-disable */

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var KEYCODE_ENTER = 13;
var KEYCODE_TAB = 9;
var KEYCODE_BACKSPACE = 8;
var KEYCODE_Y = 89;
var KEYCODE_Z = 90;
var KEYCODE_M = 77;
var KEYCODE_PARENS = 57;
var KEYCODE_BRACKETS = 219;
var KEYCODE_QUOTE = 222;
var KEYCODE_BACK_QUOTE = 192;

var HISTORY_LIMIT = 100;
var HISTORY_TIME_GAP = 3000;

var isWindows = 'navigator' in window && /Win/i.test(navigator.platform);
var isMacLike =
  'navigator' in window && /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

var className = 'npm__react-simple-code-editor__textarea';

var cssText =
  /* CSS */ '\n/**\n * Reset the text fill color so that placeholder is visible\n */\n.' +
  className +
  ":empty {\n  -webkit-text-fill-color: inherit !important;\n}\n\n/**\n * Hack to apply on some CSS on IE10 and IE11\n */\n@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {\n  /**\n    * IE does n't support '-webkit-text-fill-color'\n    * So we use 'color: transparent' to make the text transparent on IE\n    * Unlike other browsers, it doesn't affect caret color in IE\n    */\n  ." +
  className +
  ' {\n    color: transparent !important;\n  }\n\n  .' +
  className +
  '::selection {\n    background-color: #accef7 !important;\n    color: transparent !important;\n  }\n}\n' +
  '\na {text-decoration: none} .imports:hover {text-decoration: underline; \n text-decoration-color: white;} .ctrl{text-decoration: underline; \n text-decoration-color: white;}';

var Editor = (function(_React$Component) {
  _inherits(Editor, _React$Component);

  function Editor() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Editor);

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    return (
      (_ret = ((_temp = ((_this = _possibleConstructorReturn(
        this,
        (_ref = Editor.__proto__ || Object.getPrototypeOf(Editor)).call.apply(
          _ref,
          [this].concat(args)
        )
      )),
      _this)),
      (_this.state = {
        capture: true,
      }),
      (_this._recordCurrentState = function() {
        var input = _this._input;

        if (!input) return;

        // Save current state of the input
        var value = input.value,
          selectionStart = input.selectionStart,
          selectionEnd = input.selectionEnd;

        _this._recordChange({
          value: value,
          selectionStart: selectionStart,
          selectionEnd: selectionEnd,
        });
      }),
      (_this._getLines = function(text, position) {
        return text.substring(0, position).split('\n');
      }),
      (_this._recordChange = function(record) {
        var overwrite =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : false;
        var _this$_history = _this._history,
          stack = _this$_history.stack,
          offset = _this$_history.offset;

        if (stack.length && offset > -1) {
          // When something updates, drop the redo operations
          _this._history.stack = stack.slice(0, offset + 1);

          // Limit the number of operations to 100
          var count = _this._history.stack.length;

          if (count > HISTORY_LIMIT) {
            var extras = count - HISTORY_LIMIT;

            _this._history.stack = stack.slice(extras, count);
            _this._history.offset = Math.max(_this._history.offset - extras, 0);
          }
        }

        var timestamp = Date.now();

        if (overwrite) {
          var last = _this._history.stack[_this._history.offset];

          if (last && timestamp - last.timestamp < HISTORY_TIME_GAP) {
            // A previous entry exists and was in short interval

            // Match the last word in the line
            var re = /[^a-z0-9]([a-z0-9]+)$/i;

            // Get the previous line
            var previous = _this
              ._getLines(last.value, last.selectionStart)
              .pop()
              .match(re);

            // Get the current line
            var current = _this
              ._getLines(record.value, record.selectionStart)
              .pop()
              .match(re);

            if (previous && current && current[1].startsWith(previous[1])) {
              // The last word of the previous line and current line match
              // Overwrite previous entry so that undo will remove whole word
              _this._history.stack[_this._history.offset] = _extends(
                {},
                record,
                { timestamp: timestamp }
              );

              return;
            }
          }
        }

        // Add the new operation to the stack
        _this._history.stack.push(
          _extends({}, record, { timestamp: timestamp })
        );
        _this._history.offset++;
      }),
      (_this._updateInput = function(record) {
        var input = _this._input;

        if (!input) return;

        // Update values and selection state
        input.value = record.value;
        input.selectionStart = record.selectionStart;
        input.selectionEnd = record.selectionEnd;

        _this.props.onValueChange(record.value);
      }),
      (_this._applyEdits = function(record) {
        // Save last selection state
        var input = _this._input;
        var last = _this._history.stack[_this._history.offset];

        if (last && input) {
          _this._history.stack[_this._history.offset] = _extends({}, last, {
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
          });
        }

        // Save the changes
        _this._recordChange(record);
        _this._updateInput(record);
      }),
      (_this._undoEdit = function() {
        var _this$_history2 = _this._history,
          stack = _this$_history2.stack,
          offset = _this$_history2.offset;

        // Get the previous edit

        var record = stack[offset - 1];

        if (record) {
          // Apply the changes and update the offset
          _this._updateInput(record);
          _this._history.offset = Math.max(offset - 1, 0);
        }
      }),
      (_this._redoEdit = function() {
        var _this$_history3 = _this._history,
          stack = _this$_history3.stack,
          offset = _this$_history3.offset;

        // Get the next edit

        var record = stack[offset + 1];

        if (record) {
          // Apply the changes and update the offset
          _this._updateInput(record);
          _this._history.offset = Math.min(offset + 1, stack.length - 1);
        }
      }),
      (_this._handleKeyDown = function(e) {
        var _this$props = _this.props,
          tabSize = _this$props.tabSize,
          insertSpaces = _this$props.insertSpaces,
          ignoreTabKey = _this$props.ignoreTabKey,
          onKeyDown = _this$props.onKeyDown;

        if (onKeyDown) {
          onKeyDown(e);

          if (e.defaultPrevented) {
            return;
          }
        }

        var _e$target = e.target,
          value = _e$target.value,
          selectionStart = _e$target.selectionStart,
          selectionEnd = _e$target.selectionEnd;

        var tabCharacter = (insertSpaces ? ' ' : '     ').repeat(tabSize);

        if (e.keyCode === KEYCODE_TAB && !ignoreTabKey && _this.state.capture) {
          // Prevent focus change
          e.preventDefault();

          if (e.shiftKey) {
            // Unindent selected lines
            var linesBeforeCaret = _this._getLines(value, selectionStart);
            var startLine = linesBeforeCaret.length - 1;
            var endLine = _this._getLines(value, selectionEnd).length - 1;
            var nextValue = value
              .split('\n')
              .map(function(line, i) {
                if (
                  i >= startLine &&
                  i <= endLine &&
                  line.startsWith(tabCharacter)
                ) {
                  return line.substring(tabCharacter.length);
                }

                return line;
              })
              .join('\n');

            if (value !== nextValue) {
              var startLineText = linesBeforeCaret[startLine];

              _this._applyEdits({
                value: nextValue,
                // Move the start cursor if first line in selection was modified
                // It was modified only if it started with a tab
                selectionStart: startLineText.startsWith(tabCharacter)
                  ? selectionStart - tabCharacter.length
                  : selectionStart,
                // Move the end cursor by total number of characters removed
                selectionEnd: selectionEnd - (value.length - nextValue.length),
              });
            }
          } else if (selectionStart !== selectionEnd) {
            // Indent selected lines
            var _linesBeforeCaret = _this._getLines(value, selectionStart);
            var _startLine = _linesBeforeCaret.length - 1;
            var _endLine = _this._getLines(value, selectionEnd).length - 1;
            var _startLineText = _linesBeforeCaret[_startLine];

            _this._applyEdits({
              value: value
                .split('\n')
                .map(function(line, i) {
                  if (i >= _startLine && i <= _endLine) {
                    return tabCharacter + line;
                  }

                  return line;
                })
                .join('\n'),
              // Move the start cursor by number of characters added in first line of selection
              // Don't move it if it there was no text before cursor
              selectionStart: /\S/.test(_startLineText)
                ? selectionStart + tabCharacter.length
                : selectionStart,
              // Move the end cursor by total number of characters added
              selectionEnd:
                selectionEnd +
                tabCharacter.length * (_endLine - _startLine + 1),
            });
          } else {
            var updatedSelection = selectionStart + tabCharacter.length;

            _this._applyEdits({
              // Insert tab character at caret
              value:
                value.substring(0, selectionStart) +
                tabCharacter +
                value.substring(selectionEnd),
              // Update caret position
              selectionStart: updatedSelection,
              selectionEnd: updatedSelection,
            });
          }
        } else if (e.keyCode === KEYCODE_BACKSPACE) {
          var hasSelection = selectionStart !== selectionEnd;
          var textBeforeCaret = value.substring(0, selectionStart);

          if (textBeforeCaret.endsWith(tabCharacter) && !hasSelection) {
            // Prevent default delete behaviour
            e.preventDefault();

            var _updatedSelection = selectionStart - tabCharacter.length;

            _this._applyEdits({
              // Remove tab character at caret
              value:
                value.substring(0, selectionStart - tabCharacter.length) +
                value.substring(selectionEnd),
              // Update caret position
              selectionStart: _updatedSelection,
              selectionEnd: _updatedSelection,
            });
          }
        } else if (e.keyCode === KEYCODE_ENTER) {
          // Ignore selections
          if (selectionStart === selectionEnd) {
            // Get the current line
            var line = _this._getLines(value, selectionStart).pop();
            var matches = line.match(/^\s+/);

            if (matches && matches[0]) {
              e.preventDefault();

              // Preserve indentation on inserting a new line
              var indent = '\n' + matches[0];
              var _updatedSelection2 = selectionStart + indent.length;

              _this._applyEdits({
                // Insert indentation character at caret
                value:
                  value.substring(0, selectionStart) +
                  indent +
                  value.substring(selectionEnd),
                // Update caret position
                selectionStart: _updatedSelection2,
                selectionEnd: _updatedSelection2,
              });
            }
          }
        } else if (
          e.keyCode === KEYCODE_PARENS ||
          e.keyCode === KEYCODE_BRACKETS ||
          e.keyCode === KEYCODE_QUOTE ||
          e.keyCode === KEYCODE_BACK_QUOTE
        ) {
          var chars = void 0;

          if (e.keyCode === KEYCODE_PARENS && e.shiftKey) {
            chars = ['(', ')'];
          } else if (e.keyCode === KEYCODE_BRACKETS) {
            if (e.shiftKey) {
              chars = ['{', '}'];
            } else {
              chars = ['[', ']'];
            }
          } else if (e.keyCode === KEYCODE_QUOTE) {
            if (e.shiftKey) {
              chars = ['"', '"'];
            } else {
              chars = ["'", "'"];
            }
          } else if (e.keyCode === KEYCODE_BACK_QUOTE && !e.shiftKey) {
            chars = ['`', '`'];
          }

          // If text is selected, wrap them in the characters
          if (selectionStart !== selectionEnd && chars) {
            e.preventDefault();

            _this._applyEdits({
              value:
                value.substring(0, selectionStart) +
                chars[0] +
                value.substring(selectionStart, selectionEnd) +
                chars[1] +
                value.substring(selectionEnd),
              // Update caret position
              selectionStart: selectionStart,
              selectionEnd: selectionEnd + 2,
            });
          }
        } else if (
          (isMacLike // Trigger undo with ⌘+Z on Mac
            ? e.metaKey && e.keyCode === KEYCODE_Z // Trigger undo with Ctrl+Z on other platforms
            : e.ctrlKey && e.keyCode === KEYCODE_Z) &&
          !e.shiftKey &&
          !e.altKey
        ) {
          e.preventDefault();

          _this._undoEdit();
        } else if (
          (isMacLike // Trigger redo with ⌘+Shift+Z on Mac
            ? e.metaKey && e.keyCode === KEYCODE_Z && e.shiftKey
            : isWindows // Trigger redo with Ctrl+Y on Windows
            ? e.ctrlKey && e.keyCode === KEYCODE_Y // Trigger redo with Ctrl+Shift+Z on other platforms
            : e.ctrlKey && e.keyCode === KEYCODE_Z && e.shiftKey) &&
          !e.altKey
        ) {
          e.preventDefault();

          _this._redoEdit();
        } else if (
          e.keyCode === KEYCODE_M &&
          e.ctrlKey &&
          (isMacLike ? e.shiftKey : true)
        ) {
          e.preventDefault();

          // Toggle capturing tab key so users can focus away
          _this.setState(function(state) {
            return {
              capture: !state.capture,
            };
          });
        }
      }),
      (_this._handleChange = function(e) {
        var _e$target2 = e.target,
          value = _e$target2.value,
          selectionStart = _e$target2.selectionStart,
          selectionEnd = _e$target2.selectionEnd;

        _this._recordChange(
          {
            value: value,
            selectionStart: selectionStart,
            selectionEnd: selectionEnd,
          },
          true
        );

        _this.props.onValueChange(value);
      }),
      (_this._history = {
        stack: [],
        offset: -1,
      }),
      _temp)),
      _possibleConstructorReturn(_this, _ret)
    );
  }

  _createClass(Editor, [
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this._recordCurrentState();
        window.addEventListener('keydown', handleCtrlDown, true);
        window.addEventListener('keyup', handleCtrlUp, true);
      },
    },
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        // narly check but it works
        Object.entries(this.props.dependencyState).length !== 0 &&
        this.props.dependencyState[this.props.url] &&
        this.props.dependencyState[this.props.url].hasOwnProperty(
          'dependencies'
        )
          ? anchorAppender(
              this.props.dependencyState[this.props.url].dependencies
            )
          : null;
      },
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        window.removeEventListener('keydown', handleCtrlDown, true);
        window.removeEventListener('keyup', handleCtrlUp, true);
      },
    },
    {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props,
          value = _props.value,
          style = _props.style,
          padding = _props.padding,
          highlight = _props.highlight,
          textareaId = _props.textareaId,
          autoFocus = _props.autoFocus,
          disabled = _props.disabled,
          form = _props.form,
          maxLength = _props.maxLength,
          minLength = _props.minLength,
          name = _props.name,
          placeholder = _props.placeholder,
          readOnly = _props.readOnly,
          required = _props.required,
          onClick = _props.onClick,
          onFocus = _props.onFocus,
          onBlur = _props.onBlur,
          onKeyUp = _props.onKeyUp,
          onKeyDown = _props.onKeyDown,
          onValueChange = _props.onValueChange,
          tabSize = _props.tabSize,
          insertSpaces = _props.insertSpaces,
          ignoreTabKey = _props.ignoreTabKey,
          rest = _objectWithoutProperties(_props, [
            'value',
            'style',
            'padding',
            'highlight',
            'textareaId',
            'autoFocus',
            'disabled',
            'form',
            'maxLength',
            'minLength',
            'name',
            'placeholder',
            'readOnly',
            'required',
            'onClick',
            'onFocus',
            'onBlur',
            'onKeyUp',
            'onKeyDown',
            'onValueChange',
            'tabSize',
            'insertSpaces',
            'ignoreTabKey',
          ]);

        var contentStyle = {
          paddingTop: padding,
          paddingRight: padding,
          paddingBottom: padding,
          paddingLeft: padding,
        };

        var highlighted = highlight(value);

        return React.createElement(
          'div',
          _extends({}, rest, { style: _extends({}, styles.container, style) }),
          React.createElement('textarea', {
            ref: function ref(c) {
              return (_this2._input = c);
            },
            style: _extends({}, styles.editor, styles.textarea, contentStyle),
            className: className,
            id: textareaId,
            value: value,
            onChange: this._handleChange,
            onKeyDown: this._handleKeyDown,
            onClick: onClick,
            onKeyUp: onKeyUp,
            onFocus: onFocus,
            onBlur: onBlur,
            disabled: disabled,
            form: form,
            maxLength: maxLength,
            minLength: minLength,
            name: name,
            placeholder: placeholder,
            readOnly: readOnly,
            required: required,
            autoFocus: autoFocus,
            autoCapitalize: 'off',
            autoComplete: 'off',
            autoCorrect: 'off',
            spellCheck: false,
            'aria-label': 'File contents (code)',
            'data-gramm': false,
          }),
          React.createElement(
            'pre',
            _extends(
              {
                onClick: handleEditorOnClick,
                'aria-hidden': 'true',
                style: _extends(
                  {},
                  styles.editor,
                  styles.highlight,
                  contentStyle
                ),
              },
              typeof highlighted === 'string'
                ? {
                    dangerouslySetInnerHTML: { __html: highlighted + '<br />' },
                  }
                : { children: highlighted }
            )
          ),
          React.createElement('style', {
            type: 'text/css',
            dangerouslySetInnerHTML: { __html: cssText },
          })
        );
      },
    },
    {
      key: 'session',
      get: function get() {
        return {
          history: this._history,
        };
      },
      set: function set(session) {
        this._history = session.history;
      },
    },
  ]);

  return Editor;
})(React.Component);

Editor.defaultProps = {
  tabSize: 2,
  insertSpaces: true,
  ignoreTabKey: true,
  padding: 0,
};

var styles = {
  container: {
    position: 'relative',
    textAlign: 'left',
    boxSizing: 'border-box',
    padding: 0,
    overflow: 'hidden',
  },
  textarea: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    resize: 'none',
    color: 'inherit',
    overflow: 'hidden',
    MozOsxFontSmoothing: 'grayscale',
    WebkitFontSmoothing: 'antialiased',
    WebkitTextFillColor: 'transparent',
  },
  highlight: {
    position: 'relative',
  },
  editor: {
    margin: 0,
    border: 0,
    background: 'none',
    boxSizing: 'inherit',
    display: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontStyle: 'inherit',
    fontVariantLigatures: 'inherit',
    fontWeight: 'inherit',
    letterSpacing: 'inherit',
    lineHeight: 'inherit',
    tabSize: 'inherit',
    textIndent: 'inherit',
    textRendering: 'inherit',
    textTransform: 'inherit',
    whiteSpace: 'pre-wrap',
    wordBreak: 'keep-all',
    overflowWrap: 'break-word',
  },
};

/* PrismJS 1.16.0
https://prismjs.com/download.html#themes=prism-tomorrow&languages=clike+javascript */
var _self =
    'undefined' != typeof window
      ? window
      : 'undefined' != typeof WorkerGlobalScope &&
        self instanceof WorkerGlobalScope
      ? self
      : {},
  Prism = (function(g) {
    var c = /\blang(?:uage)?-([\w-]+)\b/i,
      a = 0,
      C = {
        manual: g.Prism && g.Prism.manual,
        disableWorkerMessageHandler:
          g.Prism && g.Prism.disableWorkerMessageHandler,
        util: {
          encode: function(e) {
            return e instanceof M
              ? new M(e.type, C.util.encode(e.content), e.alias)
              : Array.isArray(e)
              ? e.map(C.util.encode)
              : e
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/\u00a0/g, ' ');
          },
          type: function(e) {
            return Object.prototype.toString.call(e).slice(8, -1);
          },
          objId: function(e) {
            return (
              e.__id || Object.defineProperty(e, '__id', { value: ++a }), e.__id
            );
          },
          clone: function t(e, n) {
            var r,
              a,
              i = C.util.type(e);
            switch (((n = n || {}), i)) {
              case 'Object':
                if (((a = C.util.objId(e)), n[a])) return n[a];
                for (var l in ((r = {}), (n[a] = r), e))
                  e.hasOwnProperty(l) && (r[l] = t(e[l], n));
                return r;
              case 'Array':
                return (
                  (a = C.util.objId(e)),
                  n[a]
                    ? n[a]
                    : ((r = []),
                      (n[a] = r),
                      e.forEach(function(e, a) {
                        r[a] = t(e, n);
                      }),
                      r)
                );
              default:
                return e;
            }
          },
        },
        languages: {
          extend: function(e, a) {
            var t = C.util.clone(C.languages[e]);
            for (var n in a) t[n] = a[n];
            return t;
          },
          insertBefore: function(t, e, a, n) {
            var r = (n = n || C.languages)[t],
              i = {};
            for (var l in r)
              if (r.hasOwnProperty(l)) {
                if (l == e)
                  for (var o in a) a.hasOwnProperty(o) && (i[o] = a[o]);
                a.hasOwnProperty(l) || (i[l] = r[l]);
              }
            var s = n[t];
            return (
              (n[t] = i),
              C.languages.DFS(C.languages, function(e, a) {
                a === s && e != t && (this[e] = i);
              }),
              i
            );
          },
          DFS: function e(a, t, n, r) {
            r = r || {};
            var i = C.util.objId;
            for (var l in a)
              if (a.hasOwnProperty(l)) {
                t.call(a, l, a[l], n || l);
                var o = a[l],
                  s = C.util.type(o);
                'Object' !== s || r[i(o)]
                  ? 'Array' !== s || r[i(o)] || ((r[i(o)] = !0), e(o, t, l, r))
                  : ((r[i(o)] = !0), e(o, t, null, r));
              }
          },
        },
        plugins: {},
        highlightAll: function(e, a) {
          C.highlightAllUnder(document, e, a);
        },
        highlightAllUnder: function(e, a, t) {
          var n = {
            callback: t,
            selector:
              'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
          };
          C.hooks.run('before-highlightall', n);
          for (
            var r, i = n.elements || e.querySelectorAll(n.selector), l = 0;
            (r = i[l++]);

          )
            C.highlightElement(r, !0 === a, n.callback);
        },
        highlightElement: function(e, a, t) {
          for (var n, r, i = e; i && !c.test(i.className); ) i = i.parentNode;
          i &&
            ((n = (i.className.match(c) || [, ''])[1].toLowerCase()),
            (r = C.languages[n])),
            (e.className =
              e.className.replace(c, '').replace(/\s+/g, ' ') +
              ' language-' +
              n),
            e.parentNode &&
              ((i = e.parentNode),
              /pre/i.test(i.nodeName) &&
                (i.className =
                  i.className.replace(c, '').replace(/\s+/g, ' ') +
                  ' language-' +
                  n));
          var l = { element: e, language: n, grammar: r, code: e.textContent },
            o = function(e) {
              (l.highlightedCode = e),
                C.hooks.run('before-insert', l),
                (l.element.innerHTML = l.highlightedCode),
                C.hooks.run('after-highlight', l),
                C.hooks.run('complete', l),
                t && t.call(l.element);
            };
          if ((C.hooks.run('before-sanity-check', l), l.code))
            if ((C.hooks.run('before-highlight', l), l.grammar))
              if (a && g.Worker) {
                var s = new Worker(C.filename);
                (s.onmessage = function(e) {
                  o(e.data);
                }),
                  s.postMessage(
                    JSON.stringify({
                      language: l.language,
                      code: l.code,
                      immediateClose: !0,
                    })
                  );
              } else o(C.highlight(l.code, l.grammar, l.language));
            else o(C.util.encode(l.code));
          else C.hooks.run('complete', l);
        },
        highlight: function(e, a, t) {
          var n = { code: e, grammar: a, language: t };
          return (
            C.hooks.run('before-tokenize', n),
            (n.tokens = C.tokenize(n.code, n.grammar)),
            C.hooks.run('after-tokenize', n),
            M.stringify(C.util.encode(n.tokens), n.language)
          );
        },
        matchGrammar: function(e, a, t, n, r, i, l) {
          for (var o in t)
            if (t.hasOwnProperty(o) && t[o]) {
              if (o == l) return;
              var s = t[o];
              s = 'Array' === C.util.type(s) ? s : [s];
              for (var g = 0; g < s.length; ++g) {
                var c = s[g],
                  u = c.inside,
                  h = !!c.lookbehind,
                  f = !!c.greedy,
                  d = 0,
                  m = c.alias;
                if (f && !c.pattern.global) {
                  var p = c.pattern.toString().match(/[imuy]*$/)[0];
                  c.pattern = RegExp(c.pattern.source, p + 'g');
                }
                c = c.pattern || c;
                for (var y = n, v = r; y < a.length; v += a[y].length, ++y) {
                  var k = a[y];
                  if (a.length > e.length) return;
                  if (!(k instanceof M)) {
                    if (f && y != a.length - 1) {
                      if (((c.lastIndex = v), !(x = c.exec(e)))) break;
                      for (
                        var b = x.index + (h ? x[1].length : 0),
                          w = x.index + x[0].length,
                          A = y,
                          P = v,
                          O = a.length;
                        A < O && (P < w || (!a[A].type && !a[A - 1].greedy));
                        ++A
                      )
                        (P += a[A].length) <= b && (++y, (v = P));
                      if (a[y] instanceof M) continue;
                      (N = A - y), (k = e.slice(v, P)), (x.index -= v);
                    } else {
                      c.lastIndex = 0;
                      var x = c.exec(k),
                        N = 1;
                    }
                    if (x) {
                      h && (d = x[1] ? x[1].length : 0);
                      w = (b = x.index + d) + (x = x[0].slice(d)).length;
                      var j = k.slice(0, b),
                        S = k.slice(w),
                        E = [y, N];
                      j && (++y, (v += j.length), E.push(j));
                      var _ = new M(o, u ? C.tokenize(x, u) : x, m, x, f);
                      if (
                        (E.push(_),
                        S && E.push(S),
                        Array.prototype.splice.apply(a, E),
                        1 != N && C.matchGrammar(e, a, t, y, v, !0, o),
                        i)
                      )
                        break;
                    } else if (i) break;
                  }
                }
              }
            }
        },
        tokenize: function(e, a) {
          var t = [e],
            n = a.rest;
          if (n) {
            for (var r in n) a[r] = n[r];
            delete a.rest;
          }
          return C.matchGrammar(e, t, a, 0, 0, !1), t;
        },
        hooks: {
          all: {},
          add: function(e, a) {
            var t = C.hooks.all;
            (t[e] = t[e] || []), t[e].push(a);
          },
          run: function(e, a) {
            var t = C.hooks.all[e];
            if (t && t.length) for (var n, r = 0; (n = t[r++]); ) n(a);
          },
        },
        Token: M,
      };
    function M(e, a, t, n, r) {
      (this.type = e),
        (this.content = a),
        (this.alias = t),
        (this.length = 0 | (n || '').length),
        (this.greedy = !!r);
    }
    if (
      ((g.Prism = C),
      (M.stringify = function(a, t, e) {
        if ('string' == typeof a) return a;
        if (Array.isArray(a))
          return a
            .map(function(e) {
              return M.stringify(e, t, a);
            })
            .join('');
        var n = {
          type: a.type,
          content: M.stringify(a.content, t, e),
          tag: 'span',
          classes: ['token', a.type],
          attributes: {},
          language: t,
          parent: e,
        };
        if (a.alias) {
          var r = Array.isArray(a.alias) ? a.alias : [a.alias];
          Array.prototype.push.apply(n.classes, r);
        }
        C.hooks.run('wrap', n);
        var i = Object.keys(n.attributes)
          .map(function(e) {
            return (
              e + '="' + (n.attributes[e] || '').replace(/"/g, '&quot;') + '"'
            );
          })
          .join(' ');
        return (
          '<' +
          n.tag +
          ' class="' +
          n.classes.join(' ') +
          '"' +
          (i ? ' ' + i : '') +
          '>' +
          n.content +
          '</' +
          n.tag +
          '>'
        );
      }),
      !g.document)
    )
      return (
        g.addEventListener &&
          (C.disableWorkerMessageHandler ||
            g.addEventListener(
              'message',
              function(e) {
                var a = JSON.parse(e.data),
                  t = a.language,
                  n = a.code,
                  r = a.immediateClose;
                g.postMessage(C.highlight(n, C.languages[t], t)),
                  r && g.close();
              },
              !1
            )),
        C
      );
    var e =
      document.currentScript ||
      [].slice.call(document.getElementsByTagName('script')).pop();
    return (
      e &&
        ((C.filename = e.src),
        C.manual ||
          e.hasAttribute('data-manual') ||
          ('loading' !== document.readyState
            ? window.requestAnimationFrame
              ? window.requestAnimationFrame(C.highlightAll)
              : window.setTimeout(C.highlightAll, 16)
            : document.addEventListener('DOMContentLoaded', C.highlightAll))),
      C
    );
  })(_self);

Prism.languages.clike = {
  comment: [
    { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0 },
    { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0,
  },
  'class-name': {
    pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
    lookbehind: !0,
    inside: { punctuation: /[.\\]/ },
  },
  keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  boolean: /\b(?:true|false)\b/,
  function: /\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
  punctuation: /[{}[\];(),.:]/,
};
(Prism.languages.javascript = Prism.languages.extend('clike', {
  'class-name': [
    Prism.languages.clike['class-name'],
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
      lookbehind: !0,
    },
  ],
  keyword: [
    { pattern: /((?:^|})\s*)(?:catch|finally)\b/, lookbehind: !0 },
    {
      pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: !0,
    },
  ],
  number: /\b(?:(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+)n?|\d+n|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
  function: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/,
})),
  (Prism.languages.javascript[
    'class-name'
  ][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/),
  Prism.languages.insertBefore('javascript', 'keyword', {
    regex: {
      pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
      lookbehind: !0,
      greedy: !0,
    },
    'function-variable': {
      pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
      alias: 'function',
    },
    parameter: [
      {
        pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
      {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Prism.languages.javascript,
      },
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
  }),
  Prism.languages.insertBefore('javascript', 'string', {
    'template-string': {
      pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|[^\\`])*`/,
      greedy: !0,
      inside: {
        interpolation: {
          pattern: /\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
          inside: {
            'interpolation-punctuation': {
              pattern: /^\${|}$/,
              alias: 'punctuation',
            },
            rest: Prism.languages.javascript,
          },
        },
        string: /[\s\S]+/,
      },
    },
  }),
  Prism.languages.markup &&
    Prism.languages.markup.tag.addInlined('script', 'javascript'),
  (Prism.languages.js = Prism.languages.javascript);

/* "prismjs/components/prism-reason" */

Prism.languages.reason = Prism.languages.extend('clike', {
  comment: {
    pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
    lookbehind: true,
  },
  string: {
    pattern: /"(?:\\(?:\r\n|[\s\S])|[^\\\r\n"])*"/,
    greedy: true,
  },
  // 'class-name' must be matched *after* 'constructor' defined below
  'class-name': /\b[A-Z]\w*/,
  keyword: /\b(?:and|as|assert|begin|class|constraint|do|done|downto|else|end|exception|external|for|fun|function|functor|if|in|include|inherit|initializer|lazy|let|method|module|mutable|new|nonrec|object|of|open|or|private|rec|sig|struct|switch|then|to|try|type|val|virtual|when|while|with)\b/,
  operator: /\.{3}|:[:=]|=(?:==?|>)?|<=?|>=?|[|^?'#!~`]|[+\-*\/]\.?|\b(?:mod|land|lor|lxor|lsl|lsr|asr)\b/,
});
Prism.languages.insertBefore('reason', 'class-name', {
  character: {
    pattern: /'(?:\\x[\da-f]{2}|\\o[0-3][0-7][0-7]|\\\d{3}|\\.|[^'\\\r\n])'/,
    alias: 'string',
  },
  constructor: {
    // Negative look-ahead prevents from matching things like String.capitalize
    pattern: /\b[A-Z]\w*\b(?!\s*\.)/,
    alias: 'variable',
  },
  label: {
    pattern: /\b[a-z]\w*(?=::)/,
    alias: 'symbol',
  },
}); // We can't match functions property, so let's not even try.

delete Prism.languages.reason.function;

/* "prismjs/components/prism-json" */

Prism.languages.json = {
  property: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/i,
  string: {
    pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
    greedy: true,
  },
  number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
  punctuation: /[{}[\]);,]/,
  operator: /:/g,
  boolean: /\b(?:true|false)\b/i,
  null: /\bnull\b/i,
};
Prism.languages.jsonp = Prism.languages.json;

const extensions = {
  js: 'javascript',
  re: 'reason',
  json: 'json',
};

export default props =>
  html`
    <${Editor}
      highlight=${code =>
        Prism.highlight(
          code,
          Prism.languages[extensions[props.extension] || 'javascript']
        )}
      ...${props}
    />
  `;

/*eslint-enable */
