// @flow

import { Component, PropTypes } from 'react';
import { create } from 'jss';
import jssPreset from 'jss-preset-default';
import { createStyleManager } from './styleManager';

const createGenerateClassName = () => {
  let ruleCounter: number = 0;
  return function generateClassName(rule: Object, sheet: Object): string {
    let str: string = '';

    ruleCounter += 1;
    str = rule.key ? `${rule.key}-tr-${ruleCounter}` : `tr-${ruleCounter}`;

    // Simplify after next release with new method signature
    if (sheet && sheet.options.name) {
      return `${sheet.options.name}-${str}`;
    }
    return str;
  };
};

export const defaultJssOptions = Object.assign({}, jssPreset(), {
  createGenerateClassName,
});

export function createThemeProvider(
  createDefaultTheme: () => Object = (): Object => ({}),
  createJss: () => Jss = (): Jss => create(defaultJssOptions),
) {
  class ThemeProvider extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      styleManager: PropTypes.object,
      theme: PropTypes.object,
    };

    static childContextTypes = {
      styleManager: PropTypes.object.isRequired,
      theme: PropTypes.object.isRequired,
    };

    static createDefaultContext(props = {}) {
      const theme = props.theme || createDefaultTheme();
      const styleManager = props.styleManager || createStyleManager({
        theme,
        jss: createJss(),
      });
      return { theme, styleManager };
    }

    getChildContext() {
      const { theme, styleManager } = this;
      return {
        theme,
        styleManager,
      };
    }

    componentWillMount() {
      const { theme, styleManager } = ThemeProvider.createDefaultContext(this.props);
      this.theme = theme;
      this.styleManager = styleManager;
    }

    componentWillUpdate(nextProps: Object) {
      if (this.theme && nextProps.theme && nextProps.theme !== this.theme) {
        this.theme = nextProps.theme;

        if (this.styleManager) {
          this.styleManager.updateTheme(nextProps.theme);
        }
      }
    }

    theme: ?Object = undefined;
    styleManager: ?StyleManager = undefined;

    render() {
      return this.props.children;
    }
  }

  return ThemeProvider;
}

export default createThemeProvider();
