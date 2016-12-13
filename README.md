# jss-theme-reactor [![Build Status](https://img.shields.io/circleci/project/nathanmarks/jss-theme-reactor/master.svg?style=flat-square)](https://circleci.com/gh/nathanmarks/jss-theme-reactor) [![Coverage Status](https://img.shields.io/coveralls/nathanmarks/jss-theme-reactor/master.svg?style=flat-square)](https://coveralls.io/github/nathanmarks/jss-theme-reactor) [![npm](https://img.shields.io/npm/v/jss-theme-reactor.svg?style=flat-square)](https://www.npmjs.com/package/jss-theme-reactor)

## Installation

Install `jss-theme-reactor`.

```bash
$ npm install jss-theme-reactor --save
```

## Usage

- [Basic example](#basic-example)
- [React integration](#react-integration)
- [Server-side rendering](#server-side-rendering)

### Basic example

A super simple example demonstrating the basic functionality.

```javascript
import { create as createJss } from 'jss';
import preset from 'jss-preset-default';
import { createStyleManager, createStyleSheet } from 'jss-theme-reactor';

themeObj = {
  fontFamily: 'Roboto',
  fontSize: 12,
  color: 'red',
};

styleManager = createStyleManager({
  jss: createJss(preset()),
  theme: themeObj,
});

styleSheet = createStyleSheet('button', (theme) => ({
  root: {
    color: theme.color,
    fontSize: theme.fontSize,
    fontFamily: theme.fontFamily,
  },
}));

const classes = styleManager.render(styleSheet);

// classes.root === '.button-root-1l7rpve'
```

Resulting document head:

```html
<style type="text/css" data-jss="" data-meta="button">
.button-root-1l7rpve {
  color: red;
  font-size: 12px;
  font-family: Roboto;
}
</style>
```
