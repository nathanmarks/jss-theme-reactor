/* eslint-env mocha */
import { assert } from 'chai';
import { create as createJss } from 'jss';
import { stripIndent } from 'common-tags';
import { createStyleManager, createStyleSheet } from 'src';
import { defaultJssOptions } from '../../src/ThemeProvider';

describe('ssr', () => {
  describe('rendering to a string', () => {
    let styleManager;
    let buttonSheet;
    let iconSheet;

    beforeEach(() => {
      styleManager = createStyleManager({
        jss: createJss(defaultJssOptions),
      });

      buttonSheet = createStyleSheet('button', {
        root: {
          color: 'red',
        },
      });

      iconSheet = createStyleSheet('icon', {
        root: {
          color: 'blue',
        },
      });
    });

    afterEach(() => {
      styleManager.reset();
    });

    it('should render the sheets to a string in order', () => {
      styleManager.setSheetOrder(['icon', 'button']);

      styleManager.render(buttonSheet);
      styleManager.render(iconSheet);

      const styles = styleManager.sheetsToString();

      assert.strictEqual(
        styles,
        stripIndent`
          .icon-root-tr-2 {
            color: blue;
          }
          .button-root-tr-1 {
            color: red;
          }
        `,
      );
    });

    it('should render the sheets to a string in a different order', () => {
      styleManager.setSheetOrder(['button', 'icon']);

      styleManager.render(buttonSheet);
      styleManager.render(iconSheet);

      const styles = styleManager.sheetsToString();
      assert.strictEqual(
        styles,
        stripIndent`
          .button-root-tr-1 {
            color: red;
          }
          .icon-root-tr-2 {
            color: blue;
          }
        `,
      );
    });
  });

  describe('taking over existing style nodes on the client', () => {
    let styleNode;
    let styleSheet;
    let styleManager;

    function createStyleNode(name) {
      const element = document.createElement('style');
      element.setAttribute('data-jss', '');
      element.setAttribute('data-meta', `${name}-${styleManager.theme.id}`);
      return element;
    }

    beforeEach(() => {
      styleManager = createStyleManager({
        jss: createJss(defaultJssOptions),
      });
      styleSheet = createStyleSheet('foo', { woof: { color: 'red' } });

      document.head.appendChild(createStyleNode('fizz'));
      styleNode = createStyleNode('foo');
      document.head.appendChild(styleNode);
      document.head.appendChild(createStyleNode('bar'));
      document.head.appendChild(createStyleNode('buzz'));
    });

    afterEach(() => {
      styleManager.reset();
      document.head.innerHTML = '';
    });

    it('should re-use the existing style node', () => {
      styleManager.render(styleSheet);
      assert.strictEqual(document.head.querySelectorAll('style').length, 4);
      assert.strictEqual(
        styleManager.sheetMap[0].jssStyleSheet.options.element,
        styleNode,
      );
    });
  });
});
