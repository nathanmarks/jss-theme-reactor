import React, { Component, PropTypes } from 'react';
import DomRenderer from 'jss/lib/renderers/DomRenderer';
import { createStyleSheet } from 'src';

const styleSheet = createStyleSheet('button', (theme) => ({
  root: {
    color: theme.palette.primary,
    fontSize: theme.typography.fontSize,
    fontFamily: theme.typography.fontFamily,
  },
}), { Renderer: DomRenderer });

export default class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static contextTypes = {
    styleManager: PropTypes.object.isRequired,
  };

  render() {
    const { children, ...other } = this.props;
    const classes = this.context.styleManager.render(styleSheet);

    return (
      <button className={classes.root} {...other}>{children}</button>
    );
  }
}
