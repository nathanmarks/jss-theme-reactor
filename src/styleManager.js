import warning from 'warning';
import jssVendorPrefixer from 'jss-vendor-prefixer';
import { find, findIndex } from './utils';

const prefixRule = jssVendorPrefixer();
const warned = [];

/**
 * styleManager module. Used to create styleManager objects.
 *
 * @module styleManager
 */

/**
 * Creates a new styleManager
 *
 * @example
 *
 * ```javascript
 * import { createStyleManager } from 'stylishly/styleManager';
 * const styleManager = createStyleManager();
 * ```
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
    reset,
    rerender,
    theme,
    render,
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
   * Some mundane desc
   *
   * @memberOf module:styleManager~styleManager
   * @param  {Object} styleSheet - styleSheet object created by createStyleSheet()
   * @return {Object}            - classNames keyed by styleSheet property names
   */
  function render(styleSheet, ...other) {
    let mapping = find(sheetMap, { styleSheet });

    if (!mapping) {
      const { name, resolveStyles, options } = styleSheet;

      const looseIndex = findIndex(sheetMap, { name });

      if (looseIndex !== -1) {
        sheetMap[looseIndex].jssStyleSheet.detach();
        sheetMap.splice(looseIndex, 1);
        // if (process.env.NODE_ENV !== 'production') {
        //   warning(
        //     warned.indexOf(name) !== -1,
        //     `A styleSheet with the name ${name} already exists.`
        //   );
        //   warned.push(name);
        // }
      }

      const rules = resolveStyles(theme, ...other);
      const jssStyleSheet = jss.createStyleSheet(rules, { meta: name, ...options });
      const { classes } = jssStyleSheet.attach();

      mapping = { name, classes, styleSheet, jssStyleSheet, other };
      sheetMap.push(mapping);
    }

    return mapping.classes;
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
    sheets.forEach((n) => render(n.styleSheet, ...n.other));
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
