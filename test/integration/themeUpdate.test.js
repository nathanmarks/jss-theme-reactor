/* eslint-env mocha */
import { assert } from 'chai';
import { create as createJss } from 'jss';
import DomRenderer from 'jss/lib/backends/DomRenderer';
import preset from 'jss-preset-default';
import { createStyleManager, createStyleSheet } from 'src';

describe('theme update', () => {
  let themeObj;
  let themeObjNew;
  let styleManager;
  let styleSheet;

  before(() => {
    themeObj = {
      fontFamily: 'Roboto',
      fontSize: 12,
      color: 'red',
    };
    themeObjNew = {
      fontFamily: 'Arial',
      fontSize: 14,
      color: 'blue',
    };
    styleManager = createStyleManager({
      jss: createJss(preset()),
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

    beforeEach(() => {
      styleManager.render(styleSheet);
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

    it('should change theme', () => {
      styleManager.updateTheme(themeObjNew);
      const styleElements = document.querySelectorAll('style');
      assert.strictEqual(styleElements.length, 1, 'should have 1 style tag');
      styleElement = styleElements[0];

      assert.strictEqual(
        styleElement.getAttribute('data-meta'),
        `button-${themeObjNew.id}`,
        'should have the stylesheet name as the data-meta attribute',
      );

      const { style } = styleElement.sheet.cssRules[0];

      assert.strictEqual(style.color, themeObjNew.color);
      assert.strictEqual(style['font-size'], `${themeObjNew.fontSize}px`);
      assert.strictEqual(style['font-family'], themeObjNew.fontFamily);
    });

    it('should change theme twice', () => {
      styleManager.updateTheme(themeObjNew);
      styleManager.updateTheme(themeObj);
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
  });
});
