import { assert } from 'chai';
import { createStyleSheet } from '../styleSheet';

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
  });

  describe('theme overrides', () => {
    describe('with a simple rule', () => {
      let styleSheet;

      function createSimpleRule() {
        return {
          bar: {
            color: 'red',
            width: 100,
          },
        };
      }

      beforeEach(() => {
        styleSheet = createStyleSheet('foo', () => createSimpleRule());
      });

      it('should return the simple rule with no overrides', () => {
        assert.deepEqual(styleSheet.createRules(), createSimpleRule());
      });

      it('should return the simple rule with overrides', () => {
        const overrides = {
          foo: {
            bar: {
              color: 'blue',
            },
          },
        };

        const expectedRules = createSimpleRule();

        expectedRules.bar.color = 'blue';

        assert.deepEqual(
          styleSheet.createRules({ overrides }),
          expectedRules,
        );
      });
    });

    describe('with additional rules', () => {
      let styleSheet;

      function createRules() {
        return {
          bar: {
            color: 'red',
            width: 100,
          },
        };
      }

      beforeEach(() => {
        styleSheet = createStyleSheet('foo', () => createRules());
      });

      it('should return the rule with no overrides', () => {
        assert.deepEqual(styleSheet.createRules(), createRules());
      });

      it('should return the rule with overrides and the additional rule', () => {
        const overrides = {
          foo: {
            bar: {
              color: 'blue',
            },
            '@keyframes': {
              '0%': {
                opacity: 1,
              },
            },
          },
        };

        const expectedRules = createRules();

        expectedRules.bar.color = 'blue';
        expectedRules['@keyframes'] = {
          '0%': {
            opacity: 1,
          },
        };

        assert.deepEqual(
          styleSheet.createRules({ overrides }),
          expectedRules,
        );
      });
    });
  });
});
