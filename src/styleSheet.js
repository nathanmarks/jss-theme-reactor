
/**
 * Core function used to create styleSheet objects
 *
 * @param  {string}   name          - Stylesheet name, should be unique
 * @param  {Function} callback      - Should return the raw rules object
 * @param  {Object}   options       - Additional options
 * @return {Object}                 - styleSheet object
 */
export function createStyleSheet(name, callback, options = {}) {
  const styleSheet = {};
  styleSheet.name = name;
  styleSheet.callback = callback;
  styleSheet.options = options;
  styleSheet.resolveStyles = (...args) =>
    resolveStyles(styleSheet, ...args);
  return styleSheet;
}

export function resolveStyles(styleSheet, ...args) {
  return styleSheet.callback(...args);
}
