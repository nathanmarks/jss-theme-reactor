import jssVendorPrefixer from 'jss-vendor-prefixer';
import { find, findIndex, hashObject, hashString } from './utils';

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
export function createStyleManager({ jss = {}, theme = {} } = {}) {
  let sheetMap = [];
  let sheetOrder;

  // Register custom jss generateClassName function
  jss.generateClassName = function generateClassName(str, rule) {
    const { meta } = rule.options.sheet.options;
    const hash = hashString(str);
    return `${meta}__${rule.name}-${hash}`;
  };

  /**
   * styleManager description
   *
   * @name styleManager
   * @type {Object}
   */
  const styleManager = {
    get sheetMap() { return sheetMap; },
    get sheetOrder() { return sheetOrder; },
    setSheetOrder,
    jss,
    theme,
    render,
    reset,
    rerender,
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

  /**
   * @private
   *
   * @param  {string} options.name
   * @param  {Object} options.customTheme
   * @return {number}
   */
  function getMappingIndex({ name, customTheme }) {
    const index = findIndex(sheetMap, (obj) => {
      if (!obj.hasOwnProperty('name') || obj.name !== name) {
        return false;
      }

      if (customTheme) {
        if (!obj.hasOwnProperty('customTheme') || !obj.customTheme) {
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
    const jssOptions = {
      meta: customTheme ? `${name}-${hashObject(customTheme)}` : name,
      ...options,
    };

    if (sheetOrder && !jssOptions.hasOwnProperty('index')) {
      const index = sheetOrder.indexOf(name);
      if (index === -1) {
        jssOptions.index = sheetOrder.length;
      } else {
        jssOptions.index = index;
      }
    }

    const jssStyleSheet = jss.createStyleSheet(rules, jssOptions);
    const { classes } = jssStyleSheet.attach();

    sheetMap.push({ name, classes, customTheme, styleSheet, jssStyleSheet });

    return classes;
  }

  function setSheetOrder(sheetNames) {
    sheetOrder = sheetNames;
  }

  /**
   * Replace the current theme with a new theme
   *
   * @param  {Object}  newTheme    - New theme object
   * @param  {boolean} liveUpdate  - Set to true to liveUpdate the renderer
   */
  function updateTheme(newTheme, liveUpdate = true) {
    theme = newTheme;
    if (liveUpdate) {
      rerender();
    }
  }

  function reset() {
    sheetMap.forEach(({ jssStyleSheet }) => jssStyleSheet.detach());
    jss.sheets.registry = [];
    sheetMap = [];
  }

  /**
   * Reset and update all existing stylesheets
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
