/* eslint-env mocha */
import React from 'react';
import { assert } from 'chai';
import { mount } from 'enzyme';
import Button from 'test/fixtures/Button';
import createDOM from 'test/dom';
import ThemeProvider from 'src/ThemeProvider';
import { hashObject } from 'src/utils';

describe('react component integration', () => {
  let dom;
  let theme;

  beforeEach(() => {
    dom = createDOM();
    theme = {
      typography: {
        fontFamily: 'Roboto',
        fontSize: 12,
      },
      palette: {
        primary: 'red',
      },
    };
  });

  afterEach(() => {
    dom.destroy();
  });

  describe('with a simple button', () => {
    it('should render the button using default (global) theme styles', () => {
      const wrapper = mount((
        <ThemeProvider theme={theme}>
          <Button id="button">Hello</Button>
        </ThemeProvider>
      ));

      const styleElements = document.querySelectorAll('style');
      assert.strictEqual(styleElements.length, 1, 'should have 1 style tag');

      const styleElement = styleElements[0];

      assert.strictEqual(
        styleElement.getAttribute('data-meta'),
        'button',
        'should have the stylesheet name as the data-meta attribute'
      );

      const { style, selectorText } = styleElement.sheet.cssRules[0];

      assert.strictEqual(style.color, theme.palette.primary);
      assert.strictEqual(style['font-size'], `${theme.typography.fontSize}px`);
      assert.strictEqual(style['font-family'], theme.typography.fontFamily);

      assert.strictEqual(
        wrapper.find('button').prop('className'),
        selectorText.replace('.', '')
      );
    });

    it('should render the button using custom theme styles', () => {
      const customTheme = {
        color: 'purple',
        fontSize: 16,
        fontFamily: 'Helvetica',
      };

      const customThemeHash = hashObject(customTheme);

      const wrapper = mount((
        <ThemeProvider theme={theme}>
          <Button id="button" theme={customTheme}>Hello</Button>
        </ThemeProvider>
      ));

      const styleElements = document.querySelectorAll('style');
      assert.strictEqual(styleElements.length, 1, 'should have 1 style tag');

      const styleElement = styleElements[0];

      assert.strictEqual(
        styleElement.getAttribute('data-meta'),
        `button-${customThemeHash}`,
        'should have the stylesheet name + the custom theme hash as the data-meta attribute'
      );

      const { style, selectorText } = styleElement.sheet.cssRules[0];

      assert.strictEqual(style.color, customTheme.color);
      assert.strictEqual(style['font-size'], `${customTheme.fontSize}px`);
      assert.strictEqual(style['font-family'], customTheme.fontFamily);

      assert.strictEqual(
        wrapper.find('button').prop('className'),
        selectorText.replace('.', '')
      );
    });

    describe('with multiple themes', () => {
      it('should render all 3 themes independently', () => {
        const purpleTheme = {
          color: 'purple',
          fontSize: 16,
          fontFamily: 'Helvetica',
        };
        const greenTheme = {
          color: 'green',
          fontSize: 18,
          fontFamily: 'Comic Sans',
        };

        const wrapper = mount((
          <ThemeProvider theme={theme}>
            <div>
              <Button id="button">Hello</Button>
              <Button id="purpleButton" theme={purpleTheme}>Hello</Button>
              <Button id="greenButton" theme={greenTheme}>Hello</Button>
            </div>
          </ThemeProvider>
        ));

        const styleSheets = window.document.head.getElementsByTagName('style');

        assert.strictEqual(styleSheets.length, 3, 'should have 3 sheets');

        assert.strictEqual(
          styleSheets[0].getAttribute('data-meta'),
          'button',
          'should be the default button'
        );

        assert.strictEqual(
          styleSheets[1].getAttribute('data-meta'),
          `button-${hashObject(purpleTheme)}`,
          'should be the purple button'
        );

        assert.strictEqual(
          styleSheets[2].getAttribute('data-meta'),
          `button-${hashObject(greenTheme)}`,
          'should be the green button'
        );

        const defaultRule = styleSheets[0].sheet.cssRules[0];
        assert.strictEqual(defaultRule.style.color, theme.palette.primary);
        assert.strictEqual(
          wrapper.find('#button').prop('className'),
          defaultRule.selectorText.replace('.', '')
        );

        const purpleRule = styleSheets[1].sheet.cssRules[0];
        assert.strictEqual(purpleRule.style.color, purpleTheme.color);
        assert.strictEqual(
          wrapper.find('#purpleButton').prop('className'),
          purpleRule.selectorText.replace('.', '')
        );

        const greenRule = styleSheets[2].sheet.cssRules[0];
        assert.strictEqual(greenRule.style.color, greenTheme.color);
        assert.strictEqual(
          wrapper.find('#greenButton').prop('className'),
          greenRule.selectorText.replace('.', '')
        );
      });
    });
  });
});
