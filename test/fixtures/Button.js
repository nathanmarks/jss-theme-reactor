import React, { Component, PropTypes } from 'react';
import DomRenderer from 'jss/lib/backends/DomRenderer';
import { createStyleSheet } from 'src';

const styleSheet = createStyleSheet('button', (theme) => ({
  button: {
    color: theme.color,
    fontSize: theme.fontSize,
    fontFamily: theme.fontFamily,
  },
}), { Renderer: DomRenderer });

styleSheet.registerLocalTheme((theme) => ({
  color: theme.palette.primary,
  fontSize: theme.typography.fontSize,
  fontFamily: theme.typography.fontFamily,
}));

export default class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
    theme: PropTypes.object,
  };

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
  };

  render() {
    const { children, theme, ...other } = this.props;
    const classes = this.context.styleManager.render(styleSheet, theme);

    return (
      <button className={classes.button} {...other}>{children}</button>
    );
  }
}
