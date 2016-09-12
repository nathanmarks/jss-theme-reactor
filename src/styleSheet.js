/**
 * styleSheet module. Used to create styleSheet objects.
 *
 * @module styleSheet
 */

/**
 * Core function used to create styleSheet objects
 *
 * @param  {string}   name          - Stylesheet name, should be unique
 * @param  {Function} callback      - Should return the raw rules object, passed
 *                                    `theme` as arg1
 * @param  {Object}   options       - Additional options
 * @return {Object}                 - styleSheet object
 */
export function createStyleSheet(name, callback, options = {}) {
  const styleSheet = {
    name,
    options,
    createRules,
    createLocalTheme: undefined,
    registerLocalTheme,
  };

  function createRules(theme, customTheme) {
    if (styleSheet.createLocalTheme) {
      theme = styleSheet.createLocalTheme(theme);
      if (customTheme) {
        Object.assign(theme, customTheme);
      }
    }

    return callback(theme);
  }

  function registerLocalTheme(cb) {
    styleSheet.createLocalTheme = cb;
  }

  return styleSheet;
}
