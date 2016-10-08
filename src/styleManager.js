import jssVendorPrefixer from 'jss-vendor-prefixer';
import { find, findIndex, hashObject } from './utils';

const prefixRule = jssVendorPrefixer();

/**
 * styleManager module. Used to create styleManager objects.
 *
 * @module styleManager
 */

/**
 * Creates a new styleManager
 *
 * @param  {Object}  config                    - Config
 * @param  {Object}  config.jss                - Jss instance
 * @param  {Object}  config.theme={}           - Theme object
 * @return {module:styleManager~styleManager}  - styleManager
 */
export function createStyleManager({ jss, theme = {} } = {}) {
  let sheetMap = [];

  /**
   * styleManager description
   *
   * @name styleManager
   * @type {Object}
   */
  const styleManager = {
    get sheetMap() { return sheetMap; },
    jss,
    theme,
    render,
    rerender,
    reset,
    getClasses,
    updateTheme,
    prepareInline,
  };

  function getClasses(styleSheet) {
    const mapping = find(sheetMap, { styleSheet });

    if (mapping) {
      return mapping.classes;
    }

    return undefined;
  }

  function getMappingIndex({ name, customTheme }) {
    const index = findIndex(sheetMap, (obj) => {
      if (!obj.hasOwnProperty('name') || obj.name !== name) {
        return false;
      }

      if (customTheme) {
        if (!obj.hasOwnProperty('customTheme')) {
          return false;
        }

        for (const key in obj.customTheme) {
          if (customTheme[key] !== obj.customTheme[key]) {
            return false;
          }
        }
      }

      return true;
    });

    return index;
  }

  /**
   * Some mundane desc
   *
   * @memberOf module:styleManager~styleManager
   * @param  {Object}          styleSheet    - styleSheet object created by createStyleSheet()
   * @param  {Object|Function} customTheme   -
   * @return {Object}                        - classNames keyed by styleSheet property names
   */
  function render(styleSheet, customTheme) {
    const index = getMappingIndex({ name: styleSheet.name, customTheme });

    if (index === -1) {
      return renderNew(styleSheet, customTheme);
    }

    const mapping = sheetMap[index];

    if (mapping.styleSheet !== styleSheet) {
      jss.removeStyleSheet(sheetMap[index].jssStyleSheet);
      sheetMap.splice(index, 1);

      return renderNew(styleSheet, customTheme);
    }

    return mapping.classes;
  }

  /**
   * @private
   * @memberOf module:styleManager~styleManager
   * @param  {Object}           styleSheet    - styleSheet object created by createStyleSheet()
   * @param  {Object|Function}  customTheme   -
   * @return {Object}                         - classNames keyed by styleSheet property names
   */
  function renderNew(styleSheet, customTheme) {
    const { name, createRules, options } = styleSheet;

    const rules = createRules(theme, customTheme);
    const jssStyleSheet = jss.createStyleSheet(rules, {
      meta: customTheme ? `${name}-${hashObject(customTheme)}` : name,
      ...options,
    });
    const { classes } = jssStyleSheet.attach();

    sheetMap.push({ name, classes, customTheme, styleSheet, jssStyleSheet });

    return classes;
  }

  /**
   * Replace the current theme with a new theme
   *
   * @param  {Object}  newTheme    - New theme object
   * @param  {boolean} shouldReset - Set to true to rerender the renderer
   */
  function updateTheme(newTheme, shouldReset = true) {
    theme = newTheme;
    if (shouldReset) {
      rerender();
    }
  }

  function reset() {
    sheetMap.forEach(({ jssStyleSheet }) => jssStyleSheet.detach());
    jss.sheets.registry = [];
    sheetMap = [];
  }

  /**
   * Reset and replace all existing stylesheets
   *
   * @memberOf module:styleManager~styleManager
   */
  function rerender() {
    const sheets = [...sheetMap];
    reset();
    sheets.forEach((n) => render(n.styleSheet, n.customTheme));
  }

  function prepareInline(declaration) {
    if (typeof declaration === 'function') {
      declaration = declaration(theme);
    }

    const rule = {
      type: 'regular',
      style: declaration,
    };

    prefixRule(rule);

    return rule.style;
  }

  return styleManager;
}
