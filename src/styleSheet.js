// @flow

export function createStyleSheet(
  name: string,
  callback: (theme: Object) => Object|Object,
  options: Object = {}
): ThemeReactorStyleSheet {
  const styleSheet = {
    name,
    options,
    createRules,
  };

  function createRules(theme: Object): Object {
    if (typeof callback === 'function') {
      return callback(theme);
    }

    return callback;
  }

  return styleSheet;
}
