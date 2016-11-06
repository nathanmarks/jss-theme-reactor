# jss-theme-reactor [![Build Status](https://img.shields.io/circleci/project/nathanmarks/jss-theme-reactor/master.svg?style=flat-square)](https://circleci.com/gh/nathanmarks/jss-theme-reactor) [![Coverage Status](https://img.shields.io/coveralls/nathanmarks/jss-theme-reactor/master.svg?style=flat-square)](https://coveralls.io/github/nathanmarks/jss-theme-reactor) [![npm](https://img.shields.io/npm/v/jss-theme-reactor.svg?style=flat-square)](https://www.npmjs.com/package/jss-theme-reactor)

## Installation

Install `jss-theme-reactor` along with [`jss`](https://github.com/cssinjs/jss).

```bash
$ npm install jss-theme-reactor jss jss-preset-default --save
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
});

const classes = styleManager.render(styleSheet);

// classes.root === '.button__root-1l7rpve'
```

Resulting document head:

```html
<style type="text/css" data-jss="" data-meta="button">
.button__root-1l7rpve {
  color: red;
  font-size: 12px;
  font-family: Roboto;
}
</style>
```

[API Reference](#api-reference)

---

# API Reference

## Modules

<dl>
<dt><a href="#module_styleManager">styleManager</a></dt>
<dd><p>styleManager module. Used to create styleManager objects.</p>
</dd>
<dt><a href="#module_styleSheet">styleSheet</a></dt>
<dd><p>styleSheet module. Used to create styleSheet objects.</p>
</dd>
</dl>

<a name="module_styleManager"></a>

## styleManager
styleManager module. Used to create styleManager objects.



* [styleManager](#module_styleManager)
    * _static_
        * [.createStyleManager(config)](#module_styleManager.createStyleManager) ⇒ <code>[styleManager](#module_styleManager..styleManager)</code>
    * _inner_
        * [~styleManager](#module_styleManager..styleManager) : <code>Object</code>
            * [.render(styleSheet, customTheme)](#module_styleManager..styleManager.render) ⇒ <code>Object</code>
            * [.getClasses(styleSheet)](#module_styleManager..styleManager.getClasses) ⇒ <code>Object</code> &#124; <code>null</code>
            * [.setSheetOrder(sheetNames)](#module_styleManager..styleManager.setSheetOrder)
            * [.updateTheme(newTheme, liveUpdate)](#module_styleManager..styleManager.updateTheme)
            * [.reset()](#module_styleManager..styleManager.reset)
            * [.rerender()](#module_styleManager..styleManager.rerender)


-----

<a name="module_styleManager.createStyleManager"></a>

### styleManager.createStyleManager(config) ⇒ <code>[styleManager](#module_styleManager..styleManager)</code>
Creates a new styleManager

**Kind**: static method of <code>[styleManager](#module_styleManager)</code>  
**Returns**: <code>[styleManager](#module_styleManager..styleManager)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | Config |
| config.jss | <code>Object</code> |  | Jss instance |
| config.theme | <code>Object</code> | <code>{}</code> | Theme object |


-----

<a name="module_styleManager..styleManager"></a>

### styleManager~styleManager : <code>Object</code>
styleManager description

**Kind**: inner property of <code>[styleManager](#module_styleManager)</code>  


* [~styleManager](#module_styleManager..styleManager) : <code>Object</code>
    * [.render(styleSheet, customTheme)](#module_styleManager..styleManager.render) ⇒ <code>Object</code>
    * [.getClasses(styleSheet)](#module_styleManager..styleManager.getClasses) ⇒ <code>Object</code> &#124; <code>null</code>
    * [.setSheetOrder(sheetNames)](#module_styleManager..styleManager.setSheetOrder)
    * [.updateTheme(newTheme, liveUpdate)](#module_styleManager..styleManager.updateTheme)
    * [.reset()](#module_styleManager..styleManager.reset)
    * [.rerender()](#module_styleManager..styleManager.rerender)


-----

<a name="module_styleManager..styleManager.render"></a>

#### styleManager.render(styleSheet, customTheme) ⇒ <code>Object</code>
Some mundane desc

**Kind**: static method of <code>[styleManager](#module_styleManager..styleManager)</code>  
**Returns**: <code>Object</code> - classNames keyed by styleSheet property names  

| Param | Type | Description |
| --- | --- | --- |
| styleSheet | <code>Object</code> | styleSheet object created by createStyleSheet() |
| customTheme | <code>Object</code> &#124; <code>function</code> | - |


-----

<a name="module_styleManager..styleManager.getClasses"></a>

#### styleManager.getClasses(styleSheet) ⇒ <code>Object</code> &#124; <code>null</code>
Get classes for a given styleSheet object

**Kind**: static method of <code>[styleManager](#module_styleManager..styleManager)</code>  
**Returns**: <code>Object</code> &#124; <code>null</code> - class map object  

| Param | Type | Description |
| --- | --- | --- |
| styleSheet | <code>Object</code> | styleSheet object |


-----

<a name="module_styleManager..styleManager.setSheetOrder"></a>

#### styleManager.setSheetOrder(sheetNames)
Set DOM rendering order by sheet names.

**Kind**: static method of <code>[styleManager](#module_styleManager..styleManager)</code>  


| Param | Type | Description |
| --- | --- | --- |
| sheetNames | <code>Array</code> | Sheet names sorted by rendering order |


-----

<a name="module_styleManager..styleManager.updateTheme"></a>

#### styleManager.updateTheme(newTheme, liveUpdate)
Replace the current theme with a new theme

**Kind**: static method of <code>[styleManager](#module_styleManager..styleManager)</code>  


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| newTheme | <code>Object</code> |  | New theme object |
| liveUpdate | <code>boolean</code> | <code>true</code> | Set to true to liveUpdate the renderer |


-----

<a name="module_styleManager..styleManager.reset"></a>

#### styleManager.reset()
Reset JSS registry, remove sheets and empty the styleManager.

**Kind**: static method of <code>[styleManager](#module_styleManager..styleManager)</code>  


-----

<a name="module_styleManager..styleManager.rerender"></a>

#### styleManager.rerender()
Reset and update all existing stylesheets

**Kind**: static method of <code>[styleManager](#module_styleManager..styleManager)</code>  


-----

<a name="module_styleSheet"></a>

## styleSheet
styleSheet module. Used to create styleSheet objects.



-----

<a name="module_styleSheet.createStyleSheet"></a>

### styleSheet.createStyleSheet(name, callback, options) ⇒ <code>Object</code>
Core function used to create styleSheet objects

**Kind**: static method of <code>[styleSheet](#module_styleSheet)</code>  
**Returns**: <code>Object</code> - styleSheet object  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Stylesheet name, should be unique |
| callback | <code>function</code> | Should return the raw rules object, passed                                    `theme` as arg1 |
| options | <code>Object</code> | Additional options |


-----

