// @flow
import jssVendorPrefixer from 'jss-vendor-prefixer';
import createHash from 'murmurhash-js/murmurhash3_gc';
import { find, findIndex } from './utils';

const prefixRule = jssVendorPrefixer();

/**
 * Creates a new styleManager
 */
export function createStyleManager({ jss, theme = {} }: StyleManagerOptions = {}): StyleManager {
  if (!jss) {
    throw new Error('No JSS instance provided');
  }

  let sheetMap: Array<SheetMapping> = [];
  let sheetOrder: Array<string>;

  // Register custom jss generateClassName function
  jss.options.generateClassName = generateClassName;

  
  function generateClassName(str: string, rule: Object): string {
    const hash = createHash(theme.id);
    str = rule.name ? `${rule.name}-${hash}` : hash;

    // Simplify after next release with new method signature
    if (rule.options.sheet && rule.options.sheet.options.name) {
      return `${rule.options.sheet.options.name}-${str}`;
    }
    return str;
  }

  /**
   * styleManager
   */
  const styleManager: StyleManager = {
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
    sheetsToString,
  };

  updateTheme(theme, false);

  function render(styleSheet: ThemeReactorStyleSheet): Object {
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
   */
  function getClasses(styleSheet: ThemeReactorStyleSheet): Object|null {
    const mapping = find(sheetMap, { styleSheet });
    return mapping ? mapping.classes : null;
  }

  /**
   * @private
   */
  function renderNew(styleSheet: ThemeReactorStyleSheet): Object {
    const { name, createRules, options } = styleSheet;
    const sheetMeta = `${name}-${styleManager.theme.id}`;

    if (typeof window === 'object' && typeof document === 'object') {
      const element = document.querySelector(`style[data-jss][data-meta="${sheetMeta}"]`);
      if (element) {
        options.element = element;
      }
    }

    const rules = createRules(styleManager.theme);
    const jssOptions = {
      name,
      meta: sheetMeta,
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
   */
  function getMappingIndex(name: string): number {
    const index = findIndex(sheetMap, (obj: SheetMapping): boolean => {
      if (!obj.hasOwnProperty('name') || obj.name !== name) {
        return false;
      }

      return true;
    });

    return index;
  }

  /**
   * Set DOM rendering order by sheet names.
   */
  function setSheetOrder(sheetNames: Array<string>) {
    sheetOrder = sheetNames;
  }

  /**
   * Replace the current theme with a new theme
   */
  function updateTheme(newTheme: Object, shouldUpdate: ?boolean = true) {
    styleManager.theme = newTheme;
    if (!styleManager.theme.id) {
      styleManager.theme.id = createHash(JSON.stringify(styleManager.theme));
    }
    if (shouldUpdate) {
      rerender();
    }
  }

  /**
   * Reset JSS registry, remove sheets and empty the styleManager.
   */
  function reset() {
    sheetMap.forEach(({ jssStyleSheet }: SheetMapping) => { jssStyleSheet.detach(); });
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
    sheets.forEach((n: SheetMapping) => { render(n.styleSheet); });
  }

  /**
   * Prepare inline styles using Theme Reactor
   */
  function prepareInline(declaration: CSSStyleDeclaration|Function): CSSStyleDeclaration {
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

  /**
   * Render sheets to an HTML string
   */
  function sheetsToString(): string {
    return sheetMap
      .sort((a: SheetMapping, b: SheetMapping): number => {
        if (a.jssStyleSheet.options.index < b.jssStyleSheet.options.index) {
          return -1;
        }
        if (a.jssStyleSheet.options.index > b.jssStyleSheet.options.index) {
          return 1;
        }
        return 0;
      })
      .map((sheet: SheetMapping): string => sheet.jssStyleSheet.toString())
      .join('\n');
  }

  return styleManager;
}
