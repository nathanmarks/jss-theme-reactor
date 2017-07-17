/* eslint-env mocha */
import { assert } from 'chai';
import { create as createJss } from 'jss';
import DomRenderer from 'jss/lib/renderers/DomRenderer';
import { createStyleManager, createStyleSheet } from 'src';
import { defaultJssOptions } from '../../src/ThemeProvider'

describe('basic usage', () => {
  let themeObj;
  let styleManager;
  let styleSheet;
  let classes;

  before(() => {
    themeObj = {
      fontFamily: 'Roboto',
      fontSize: 12,
      color: 'red',
    };
    styleManager = createStyleManager({
      jss: createJss(defaultJssOptions),
      theme: themeObj,
    });
    styleSheet = createStyleSheet('button', (theme) => ({
      root: {
        color: theme.color,
        fontSize: theme.fontSize,
        fontFamily: theme.fontFamily,
      },
    }), { Renderer: DomRenderer });
  });

  afterEach(() => {
    styleManager.reset();
  });

  it('should start with no stylesheets in the DOM', () => {
    const styleElements = document.querySelectorAll('style');
    assert.strictEqual(styleElements.length, 0, 'should have no style tags');
  });

  describe('rendering to the DOM', () => {
    let styleElement;

    before(() => {
      classes = styleManager.render(styleSheet);
    });

    it('should render the stylesheet to the DOM', () => {
      const styleElements = document.querySelectorAll('style');
      assert.strictEqual(styleElements.length, 1, 'should have 1 style tag');
      styleElement = styleElements[0];

      assert.strictEqual(
        styleElement.getAttribute('data-meta'),
        `button-${themeObj.id}`,
        'should have the stylesheet name as the data-meta attribute',
      );

      const { style } = styleElement.sheet.cssRules[0];

      assert.strictEqual(style.color, themeObj.color);
      assert.strictEqual(style['font-size'], `${themeObj.fontSize}px`);
      assert.strictEqual(style['font-family'], themeObj.fontFamily);
    });

    it('should return the classNames', () => {
      const { selectorText } = styleElement.sheet.cssRules[0];

      assert.strictEqual(
        typeof classes.root,
        'string',
        'should return a className on the root key',
      );

      assert.strictEqual(
        classes.root.indexOf('button-'),
        0,
        'should prefix the selector with the sheet name',
      );

      assert.strictEqual(
        `.${classes.root}`,
        selectorText,
        'should match the selectorText',
      );
    });
  });
});
