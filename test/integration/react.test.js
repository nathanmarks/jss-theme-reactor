/* eslint-env mocha */
import React from 'react';
import { assert } from 'chai';
import { mount } from 'enzyme';
import Button from 'test/fixtures/Button';
import ThemeProvider from 'src/ThemeProvider';

describe('react component integration', () => {
  let theme;

  beforeEach(() => {
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

  describe('with a simple button', () => {
    it('should render the button using theme styles', () => {
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
        `button-${theme.id}`,
        'should have the stylesheet name as the data-meta attribute',
      );

      const { style, selectorText } = styleElement.sheet.cssRules[0];

      assert.strictEqual(style.color, theme.palette.primary);
      assert.strictEqual(style['font-size'], `${theme.typography.fontSize}px`);
      assert.strictEqual(style['font-family'], theme.typography.fontFamily);

      assert.strictEqual(
        wrapper.find('button').prop('className'),
        selectorText.replace('.', ''),
      );

      wrapper.instance().styleManager.reset();
    });
  });
});
