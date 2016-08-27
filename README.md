# WIP: jss-theme-reactor
[![Build Status](https://img.shields.io/circleci/project/nathanmarks/jss-theme-reactor/master.svg?style=flat-square)](https://circleci.com/gh/nathanmarks/jss-theme-reactor)
[![Coverage Status](https://img.shields.io/coveralls/nathanmarks/jss-theme-reactor/master.svg?style=flat-square)](https://coveralls.io/github/nathanmarks/jss-theme-reactor)
[![npm](https://img.shields.io/npm/v/jss-theme-reactor.svg?style=flat-square)](https://www.npmjs.com/package/jss-theme-reactor)

#### Installation

```bash
$ npm install jss-theme-reactor --save
```

#### Usage

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
            * [.render(styleSheet)](#module_styleManager..styleManager.render) ⇒ <code>Object</code>
            * [.rerender()](#module_styleManager..styleManager.rerender)


-----

<a name="module_styleManager.createStyleManager"></a>

### styleManager.createStyleManager(config) ⇒ <code>[styleManager](#module_styleManager..styleManager)</code>
Creates a new styleManager

**Kind**: static method of <code>[styleManager](#module_styleManager)</code>  
**Returns**: <code>[styleManager](#module_styleManager..styleManager)</code> - styleManager  

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
    * [.render(styleSheet)](#module_styleManager..styleManager.render) ⇒ <code>Object</code>
    * [.rerender()](#module_styleManager..styleManager.rerender)


-----

<a name="module_styleManager..styleManager.render"></a>

#### styleManager.render(styleSheet) ⇒ <code>Object</code>
Some mundane desc

**Kind**: static method of <code>[styleManager](#module_styleManager..styleManager)</code>  
**Returns**: <code>Object</code> - classNames keyed by styleSheet property names  

| Param | Type | Description |
| --- | --- | --- |
| styleSheet | <code>Object</code> | styleSheet object created by createStyleSheet() |


-----

<a name="module_styleManager..styleManager.rerender"></a>

#### styleManager.rerender()
Reset and replace all existing stylesheets

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
| callback | <code>function</code> | Should return the raw rules object |
| options | <code>Object</code> | Additional options |


-----

