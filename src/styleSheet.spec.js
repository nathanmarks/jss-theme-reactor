/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet } from './styleSheet';

describe('styleSheet.js', () => {
  describe('exports', () => {
    it('should export the styleSheet factory', () => {
      assert.strictEqual(typeof createStyleSheet, 'function');
    });
  });

  describe('createStyleSheet()', () => {
    it('should create a styleSheet object', () => {
      const styleSheet =
        createStyleSheet('foo', () => ({
          button: {
            color: 'red',
          },
        }));

      assert.strictEqual(styleSheet.toString(), '[object Object]');
      assert.strictEqual(styleSheet.name, 'foo', 'should set the name');
      assert.strictEqual(styleSheet.options.index, 50, 'should set the default index to 50');
    });
  });

  describe('styleSheet', () => {
    let styleSheet;

    before(() => {
      styleSheet = createStyleSheet('foo', (theme) => ({
        button: {
          color: theme.color,
        },
      }), { option: 'value' });
    });

    it('should resolve styles using the theme object', () => {
      const styles = styleSheet.resolveStyles({ color: 'red' });
      assert.deepEqual(styles, {
        button: {
          color: 'red',
        },
      });
    });

    it('should store options on the object', () => {
      assert.strictEqual(styleSheet.options.option, 'value');
    });
  });
});
