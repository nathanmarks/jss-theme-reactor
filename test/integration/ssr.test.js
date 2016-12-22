/* eslint-env mocha */
import { assert } from 'chai';
import { create as createJss } from 'jss';
import preset from 'jss-preset-default';
import { stripIndent } from 'common-tags';
import { createStyleManager, createStyleSheet } from 'src';
import createDOM from 'test/dom';

describe('ssr', () => {
  describe('rendering to a string', () => {
    let styleManager;
    let buttonSheet;
    let iconSheet;

    beforeEach(() => {
      styleManager = createStyleManager({
        jss: createJss(preset()),
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

    it('should render the sheets to a string in order', () => {
      styleManager.setSheetOrder(['icon', 'button']);

      styleManager.render(buttonSheet);
      styleManager.render(iconSheet);

      const styles = styleManager.sheetsToString();

      assert.strictEqual(
        styles,
        stripIndent`
          .icon-root-1243194637 {
            color: blue;
          }
          .button-root-3645560457 {
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
          .button-root-3645560457 {
            color: red;
          }
          .icon-root-1243194637 {
            color: blue;
          }
        `,
      );
    });
  });

  describe('taking over existing style nodes on the client', () => {
    let dom;
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
      dom = createDOM();
      styleManager = createStyleManager({
        jss: createJss(preset()),
      });
      styleSheet = createStyleSheet('foo', { woof: { color: 'red' } });

      document.head.appendChild(createStyleNode('fizz'));
      styleNode = createStyleNode('foo');
      document.head.appendChild(styleNode);
      document.head.appendChild(createStyleNode('bar'));
      document.head.appendChild(createStyleNode('buzz'));
    });

    afterEach(() => {
      dom.destroy();
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
