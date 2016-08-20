// @flow weak

import { Component, PropTypes } from 'react';
import { create as createJss } from 'jss';
import jssPreset from 'jss-preset-default';
import { createStyleManager } from './styleManager';

export function createThemeProvider(defaultTheme = {}) {
  class ThemeProvider extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      styleManager: PropTypes.object,
      theme: PropTypes.object,
    };

    static defaultProps = {
      theme: defaultTheme,
    };

    static childContextTypes = {
      styleManager: PropTypes.object.isRequired,
      theme: PropTypes.object.isRequired,
    };

    getChildContext() {
      const { theme, styleManager } = this;
      return {
        theme,
        styleManager,
      };
    }

    componentWillMount() {
      const { theme, styleManager } = this.createDefaultContext(this.props);
      this.theme = theme;
      this.styleManager = styleManager;
    }

    componentWillUpdate(nextProps) {
      if (this.theme && nextProps.theme && nextProps.theme !== this.theme) {
        this.theme = nextProps.theme;
        this.styleManager.replaceTheme(nextProps.theme);
        this.styleManager.empty();
      }
    }

    theme = undefined;
    styleManager = undefined;

    createDefaultContext(props = {}) {
      const theme = props.theme || defaultTheme;
      const styleManager = props.styleManager || createStyleManager({
        theme,
        jss: createJss(jssPreset()),
      });
      return { theme, styleManager };
    }

    render() {
      return this.props.children;
    }
  }

  return ThemeProvider;
}

export default createThemeProvider();
