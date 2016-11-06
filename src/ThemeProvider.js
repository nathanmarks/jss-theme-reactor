import { Component, PropTypes } from 'react';
import { create } from 'jss';
import jssPreset from 'jss-preset-default';
import { createStyleManager } from './styleManager';

export function createThemeProvider(
  createDefaultTheme = () => ({}),
  createJss = () => create(jssPreset())
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

    componentWillUpdate(nextProps) {
      if (this.theme && nextProps.theme && nextProps.theme !== this.theme) {
        this.theme = nextProps.theme;
        this.styleManager.updateTheme(nextProps.theme);
      }
    }

    theme = undefined;
    styleManager = undefined;

    render() {
      return this.props.children;
    }
  }

  return ThemeProvider;
}

export default createThemeProvider();
