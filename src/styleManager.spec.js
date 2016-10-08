/* eslint-env mocha */
import { assert } from 'chai';
import { stub, spy } from 'sinon';
import { createStyleManager } from './styleManager';
import { createStyleSheet } from './styleSheet';

describe.only('styleManager.js', () => {
  let styleManager;
  let jss;
  let attach;
  let detach;

  beforeEach(() => {
    attach = stub().returns({ classes: { base: 'base-1234' } });
    detach = spy();
    jss = {
      sheets: { registry: [] },
      createStyleSheet: stub().returns({ attach, detach }),
    };
    styleManager = createStyleManager({ jss, theme: { color: 'red' } });
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
      assert.strictEqual(
        jss.createStyleSheet.calledWith(
          styleSheet1.createRules(),
          {
            meta: 'foo',
            woof: 'meow',
          }
        ),
        true,
        'should pass the raw styles and options to jss'
      );
      assert.strictEqual(attach.callCount, 1, 'should call jssStyleSheet.attach()');
      assert.strictEqual(styleManager.sheetMap.length, 1, 'should add a sheetMap item');
      assert.strictEqual(classes.base, 'base-1234', 'should return the className');
    });

    it('should get the classes', () => {
      const classes = styleManager.getClasses(styleSheet1);
      assert.strictEqual(classes.base, 'base-1234', 'should return the className');
    });

    it('should detach the styleSheets and reset the sheetmap', () => {
      styleManager.reset();
      assert.strictEqual(detach.callCount, 1, 'should call jssStyleSheet.detach()');
      assert.strictEqual(styleManager.sheetMap.length, 0, 'should empty the sheetmap');
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

    it('should render a sheet using the renderer and pass the order index', () => {
      assert.strictEqual(
        jss.createStyleSheet.calledWith(
          bar.createRules(),
          {
            meta: 'bar',
            index: 0,
          }
        ),
        true,
        'should pass the raw styles and the order index to jss'
      );
    });

    it('should render a sheet and merge options with the index', () => {
      assert.strictEqual(
        jss.createStyleSheet.calledWith(
          foo.createRules(),
          {
            meta: 'foo',
            woof: 'meow',
            index: 2,
          }
        ),
        true,
        'should pass the raw styles and options with the order index to jss'
      );
    });

    it('should override the order index', () => {
      assert.strictEqual(
        jss.createStyleSheet.calledWith(
          woof.createRules(),
          {
            meta: 'woof',
            index: 999,
          }
        ),
        true,
        'should pass the raw styles and the custom order index to jss'
      );
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
      const styles = styleManager.prepareInline((theme) => ({
        display: 'block',
        color: theme.color,
      }));
      assert.deepEqual(styles, { display: 'block', color: 'red' }, 'should return themed styles');
    });
  });
});
