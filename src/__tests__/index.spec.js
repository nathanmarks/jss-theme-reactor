import { assert } from 'chai';
import {
  createStyleManager,
  createStyleSheet,
} from '../index';

describe('index.js', () => {
  describe('exports', () => {
    it('should export the styleManager factory', () => {
      assert.strictEqual(typeof createStyleManager, 'function');
    });

    it('should export the styleSheet factory', () => {
      assert.strictEqual(typeof createStyleSheet, 'function');
    });
  });
});
