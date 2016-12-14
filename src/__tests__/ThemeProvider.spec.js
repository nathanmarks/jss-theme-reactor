// @flow weak
/* eslint-env mocha */

import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';
import { createStyleManager } from '../styleManager';
import ThemeProvider from '../ThemeProvider';

describe('<ThemeProvider>', () => {
  describe('defaults', () => {
    it('should create a new styleManager', () => {
      const wrapper = shallow(
        <ThemeProvider>
          <h1>Hello World</h1>
        </ThemeProvider>
      );
      const wrapper2 = shallow(
        <ThemeProvider>
          <h1>Hello World</h1>
        </ThemeProvider>
      );
      assert.strictEqual(
        typeof wrapper.instance().theme,
        'object',
        'should store theme as an instance property'
      );
      assert.strictEqual(
        typeof wrapper.instance().styleManager,
        'object',
        'should store styleManager as an instance property'
      );
      assert.notStrictEqual(
        wrapper.instance().theme,
        wrapper2.instance().theme,
        'should have a unique instance of the theme'
      );
      assert.notStrictEqual(
        wrapper.instance().styleManager,
        wrapper2.instance().styleManager,
        'should have unique instances of a styleManager'
      );
    });
  });

  describe('custom theme', () => {
    const theme = { color: 'red' };
    const styleManager = createStyleManager({ theme, jss: { options: {} } });

    it('should use the custom theme and styleManager', () => {
      const wrapper = shallow(
        <ThemeProvider theme={theme} styleManager={styleManager}>
          <h1>Hello World</h1>
        </ThemeProvider>
      );
      assert.strictEqual(
        wrapper.instance().theme, theme, 'should store the custom theme as an instance property'
      );
      assert.strictEqual(
        wrapper.instance().styleManager,
        styleManager,
        'should store the custom styleManager as an instance property'
      );
    });
  });
});
