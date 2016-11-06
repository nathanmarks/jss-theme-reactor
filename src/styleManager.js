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
 * @return {module:styleManager~styleManager}
 */
export function createStyleManager({ jss, theme = {} } = {}) {
  if (!jss) {
    throw new Error('No JSS instance provided');
  }

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
   * Get classes for a given styleSheet object
   *
   * @memberOf module:styleManager~styleManager
   * @param  {Object}      styleSheet - styleSheet object
   * @return {Object|null}            - class map object
   */
  function getClasses(styleSheet) {
    const mapping = find(sheetMap, { styleSheet });

    if (mapping) {
      return mapping.classes;
    }

    return null;
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

  /**
   * @private
   * @memberOf module:styleManager~styleManager
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
   * Set DOM rendering order by sheet names.
   *
   * @memberOf module:styleManager~styleManager
   * @param {Array} sheetNames - Sheet names sorted by rendering order
   */
  function setSheetOrder(sheetNames) {
    sheetOrder = sheetNames;
  }

  /**
   * Replace the current theme with a new theme
   *
   * @memberOf module:styleManager~styleManager
   * @param  {Object}  newTheme    - New theme object
   * @param  {boolean} liveUpdate  - Set to true to liveUpdate the renderer
   */
  function updateTheme(newTheme, liveUpdate = true) {
    theme = newTheme;
    if (liveUpdate) {
      rerender();
    }
  }

  /**
   * Reset JSS registry, remove sheets and empty the styleManager.
   *
   * @memberOf module:styleManager~styleManager
   */
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

  /**
   * Prepare inline styles using Theme Reactor
   *
   * @param  {Object|Function} declaration - Style object or callback function
   * @return {Object}                      - Processed styles
   */
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
