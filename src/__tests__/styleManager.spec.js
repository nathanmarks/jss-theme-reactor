import { assert } from 'chai';
import { stub, spy } from 'sinon';
import { createStyleManager } from '../styleManager';
import { createStyleSheet } from '../styleSheet';

describe('styleManager.js', () => {
  let styleManager;
  let jss;
  let attach;
  let detach;
  let theme;

  beforeEach(() => {
    theme = { color: 'red' };
    attach = stub().returns({ classes: { base: 'base-1234' } });
    detach = spy();
    jss = {
      options: {},
      sheets: {},
      use: spy(),
      createStyleSheet: stub().returns({ attach, detach }),
      removeStyleSheet: spy(),
    };
    styleManager = createStyleManager({ jss, theme });
  });

  it('should throw if no jss instance is passed', () => {
    assert.throws(() => {
      createStyleManager();
    });
  });

  it('should create a styleManager object', () => {
    assert.strictEqual(typeof styleManager, 'object');
    assert.strictEqual(typeof styleManager.theme, 'object');
    assert.strictEqual(typeof styleManager.jss, 'object');
    assert.strictEqual(typeof styleManager.render, 'function');
    assert.strictEqual(typeof styleManager.getClasses, 'function');
    assert.strictEqual(typeof styleManager.updateTheme, 'function');
    assert.strictEqual(typeof styleManager.prepareInline, 'function');
    assert.strictEqual(typeof styleManager.setSheetOrder, 'function');
  });

  describe('render(styleSheet)', () => {
    let styleSheet1;
    let classes;

    beforeEach(() => {
      styleSheet1 = createStyleSheet('foo', () => ({
        base: {
          backgroundColor: 'red',
        },
      }), { woof: 'meow' });
      classes = styleManager.render(styleSheet1);
    });

    it('should render a sheet using the renderer and return the classes', () => {
      assert.strictEqual(jss.createStyleSheet.callCount, 1, 'should call jss.createStyleSheet()');
      assert.deepEqual(jss.createStyleSheet.args[0][0], styleSheet1.createRules());
      assert.strictEqual(jss.createStyleSheet.args[0][1].meta, `foo-${theme.id}`);
      assert.strictEqual(jss.createStyleSheet.args[0][1].woof, 'meow');
      assert.strictEqual(jss.createStyleSheet.callCount, 1, 'should call jssStyleSheet.createStyleSheet()');
      assert.strictEqual(attach.callCount, 1, 'should call jssStyleSheet.attach()');
      assert.strictEqual(styleManager.sheetMap.length, 1, 'should add a sheetMap item');
      assert.strictEqual(classes.base, 'base-1234', 'should return the className');
    });

    it('should only attach the sheet once if called multiple times', () => {
      classes = styleManager.render(styleSheet1);

      assert.strictEqual(attach.callCount, 1, 'should call jssStyleSheet.attach()');
      assert.strictEqual(classes.base, 'base-1234', 'should return the className');
    });

    it('should detach the styleSheets and reset the sheetmap', () => {
      styleManager.reset();
      assert.strictEqual(detach.callCount, 1, 'should call jssStyleSheet.detach()');
      assert.strictEqual(styleManager.sheetMap.length, 0, 'should empty the sheetmap');
    });

    describe('new styleSheet Object reference', () => {
      it('should replace the stylesheet', () => {
        const styleSheet1Reloaded = createStyleSheet('foo', () => ({
          base: {
            backgroundColor: 'blue',
          },
        }), { woof: 'meow' });

        jss.createStyleSheet.reset(); // reset spy from initial render

        styleManager.render(styleSheet1Reloaded);

        assert.deepEqual(jss.createStyleSheet.args[0][0], styleSheet1Reloaded.createRules());
        assert.strictEqual(jss.createStyleSheet.args[0][1].meta, `foo-${theme.id}`);
        assert.strictEqual(jss.createStyleSheet.args[0][1].woof, 'meow');

        assert.strictEqual(jss.removeStyleSheet.callCount, 1, 'should call jssStyleSheet.removeStyleSheet()');
        assert.strictEqual(jss.createStyleSheet.callCount, 1, 'should call jssStyleSheet.createStyleSheet()');
      });
    });
  });

  describe('getClasses', () => {
    let styleSheet1;

    beforeEach(() => {
      styleSheet1 = createStyleSheet('foo', () => ({
        base: {
          backgroundColor: 'red',
        },
      }), { woof: 'meow' });
      styleManager.render(styleSheet1);
    });

    it('should get the classes', () => {
      const classNames = styleManager.getClasses(styleSheet1);
      assert.strictEqual(classNames.base, 'base-1234', 'should return the className');
    });

    it('should return null', () => {
      const classNames = styleManager.getClasses({});
      assert.strictEqual(classNames, null, 'should return null');
    });
  });

  describe('setSheetOrder', () => {
    let sheetOrder;
    let foo;
    let bar;
    let woof;

    beforeEach(() => {
      sheetOrder = [
        'bar',
        'woof',
        'foo',
      ];

      styleManager.setSheetOrder(sheetOrder);

      foo = createStyleSheet('foo', () => ({
        base: {
          backgroundColor: 'red',
        },
      }), { woof: 'meow' });

      bar = createStyleSheet('bar', () => ({}));

      woof = createStyleSheet('woof', () => ({}), { index: 999 });

      styleManager.render(foo);
      styleManager.render(bar);
      styleManager.render(woof);
    });

    it('should return the sheetOrder', () => {
      const order = styleManager.sheetOrder;
      assert.strictEqual(order, sheetOrder);
    });

    it('should render a sheet using the renderer and pass the order index', () => {
      assert.deepEqual(jss.createStyleSheet.args[1][0], bar.createRules());
      assert.strictEqual(jss.createStyleSheet.args[1][1].meta, `bar-${theme.id}`);
      assert.strictEqual(jss.createStyleSheet.args[1][1].index, 0);
    });

    it('should render a sheet and merge options with the index', () => {
      assert.deepEqual(jss.createStyleSheet.args[0][0], foo.createRules());
      assert.strictEqual(jss.createStyleSheet.args[0][1].meta, `foo-${theme.id}`);
      assert.strictEqual(jss.createStyleSheet.args[0][1].index, 2);
    });

    it('should override the order index', () => {
      assert.deepEqual(jss.createStyleSheet.args[2][0], woof.createRules());
      assert.strictEqual(jss.createStyleSheet.args[2][1].meta, `woof-${theme.id}`);
      assert.strictEqual(jss.createStyleSheet.args[2][1].index, 999);
    });
  });

  describe('prepareInline', () => {
    it('should prepare inline styles', () => {
      const styles = styleManager.prepareInline({
        display: 'block',
      });
      assert.deepEqual(styles, { display: 'block' }, 'should return the same');
    });

    it('should prepare inline styles with theme variables', () => {
      const styles = styleManager.prepareInline((thm) => ({
        display: 'block',
        color: thm.color,
      }));
      assert.deepEqual(styles, { display: 'block', color: 'red' }, 'should return themed styles');
    });
  });

  describe('updateTheme', () => {
    it('should replace the current theme', () => {
      const newTheme = { color: 'green' };
      styleManager.updateTheme(newTheme, false);
      assert.strictEqual(styleManager.theme, newTheme);
    });
  });
});
