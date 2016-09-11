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
    });
  });

  describe('styleSheet', () => {
    let styleSheet;

    beforeEach(() => {
      styleSheet = createStyleSheet('foo', (theme) => ({
        button: {
          color: theme.color,
        },
      }), { option: 'value' });
    });

    it('should resolve styles using the theme object', () => {
      const styles = styleSheet.createRules({ color: 'red' });
      assert.deepEqual(styles, {
        button: {
          color: 'red',
        },
      });
    });

    describe('styleSheet.options', () => {
      it('should store options on the object', () => {
        assert.strictEqual(styleSheet.options.option, 'value');
      });
    });

    describe('styleSheet.registerLocalTheme', () => {
      it('should be a function', () => {
        assert.strictEqual(typeof styleSheet.registerLocalTheme, 'function');
      });

      describe('creating rules with and without a local theme', () => {
        let createLocalTheme;

        beforeEach(() => {
          createLocalTheme = function () {
            return { color: 'blue' };
          };
          styleSheet.registerLocalTheme(createLocalTheme);
        });

        it('should register a local theme on the styleSheet', () => {
          assert.strictEqual(
            styleSheet.createLocalTheme,
            createLocalTheme,
            'should store the callback'
          );
        });

        it('should resolve styles using the local theme object', () => {
          const styles = styleSheet.createRules({ color: 'red' });
          assert.deepEqual(styles, {
            button: {
              color: 'blue',
            },
          });
        });
      });
    });
  });
});
