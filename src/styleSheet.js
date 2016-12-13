// @flow

export function createStyleSheet(name, callback, options = {}) {
  const styleSheet = {
    name,
    options,
    createRules,
  };

  function createRules(theme) {
    if (typeof callback === 'function') {
      return callback(theme);
    }

    return callback;
  }

  return styleSheet;
}
