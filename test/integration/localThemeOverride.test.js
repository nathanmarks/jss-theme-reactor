/* eslint-env mocha */
import { assert } from 'chai';
import { create as createJss } from 'jss';
import DomRenderer from 'jss/lib/backends/DomRenderer';
import preset from 'jss-preset-default';
import createDOM from 'test/dom';
import { createStyleManager, createStyleSheet } from 'src';
import { hashObject } from 'src/utils';

describe('local theme override', () => {
  let dom;
  let themeObj;
  let styleManager;
  let styleSheet;
  let classes;

  before(() => {
    dom = createDOM();
    themeObj = {
      typography: {
        fontFamily: 'Roboto',
        fontSize: 12,
      },
      palette: {
        primary: 'red',
      },
    };
    styleManager = createStyleManager({
      jss: createJss(preset()),
      theme: themeObj,
    });
    styleSheet = createStyleSheet('button', (theme) => ({
      button: {
        color: theme.color,
        fontSize: theme.fontSize,
        fontFamily: theme.fontFamily,
      },
    }), { Renderer: DomRenderer });
    styleSheet.registerLocalTheme((theme) => ({
      color: theme.palette.primary,
      fontSize: theme.typography.fontSize,
      fontFamily: theme.typography.fontFamily,
    }));
  });

  after(() => {
    dom.destroy();
  });

  it('should start with no stylesheets in the DOM', () => {
    const styleElements = document.querySelectorAll('style');
    assert.strictEqual(styleElements.length, 0, 'should have no style tags');
  });

  describe('rendering to the DOM', () => {
    let styleElement;

    before(() => {
      classes = styleManager.render(styleSheet, {
        color: 'purple',
      });
    });

    it('should render the stylesheet to the DOM', () => {
      const styleElements = document.querySelectorAll('style');
      assert.strictEqual(styleElements.length, 1, 'should have 1 style tag');
      styleElement = styleElements[0];

      assert.strictEqual(
        styleElement.getAttribute('data-meta'),
        `button-${hashObject({
          color: 'purple',
        })}`,
        'should have the stylesheet name + the custom theme hash as the data-meta attribute'
      );

      const { style } = styleElement.sheet.cssRules[0];

      assert.strictEqual(style.color, 'purple');
      assert.strictEqual(style['font-size'], `${themeObj.typography.fontSize}px`);
      assert.strictEqual(style['font-family'], themeObj.typography.fontFamily);
    });

    it('should return the classNames', () => {
      const { selectorText } = styleElement.sheet.cssRules[0];

      assert.strictEqual(
        typeof classes.button,
        'string',
        'should return a className on the button key'
      );

      assert.strictEqual(
        `.${classes.button}`,
        selectorText,
        'should match the selectorText'
      );
    });
  });
});
