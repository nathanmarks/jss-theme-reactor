import jssVendorPrefixer from 'jss-vendor-prefixer';
import createHash from 'murmurhash-js/murmurhash3_gc';
import { find, findIndex } from './utils';

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
  jss.options.generateClassName = function generateClassName(str, rule) {
    const { meta } = rule.options.sheet.options;
    const hash = createHash(str);
    return `${meta}-${rule.name}-${hash}`;
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
   * @return {Object}                        - classNames keyed by styleSheet property names
   */
  function render(styleSheet) {
    const index = getMappingIndex(styleSheet.name);

    if (index === -1) {
      return renderNew(styleSheet);
    }

    const mapping = sheetMap[index];

    if (mapping.styleSheet !== styleSheet) {
      jss.removeStyleSheet(sheetMap[index].jssStyleSheet);
      sheetMap.splice(index, 1);

      return renderNew(styleSheet);
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
   * @return {Object}                         - classNames keyed by styleSheet property names
   */
  function renderNew(styleSheet) {
    const { name, createRules, options } = styleSheet;

    const rules = createRules(theme);
    const jssOptions = {
      meta: name,
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

    sheetMap.push({ name, classes, styleSheet, jssStyleSheet });

    return classes;
  }

  /**
   * @private
   * @memberOf module:styleManager~styleManager
   * @param  {string} options.name
   * @return {number}
   */
  function getMappingIndex(name) {
    const index = findIndex(sheetMap, (obj) => {
      if (!obj.hasOwnProperty('name') || obj.name !== name) {
        return false;
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
   * @param  {Object}  newTheme      - New theme object
   * @param  {boolean} shouldUpdate  - Set to true to update sheets immediately
   */
  function updateTheme(newTheme, shouldUpdate = true) {
    theme = newTheme;
    if (shouldUpdate) {
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
    sheets.forEach((n) => render(n.styleSheet));
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
