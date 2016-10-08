/* eslint-env mocha */
// import { assert } from 'chai';
// import { create as createJss } from 'jss';
// import preset from 'jss-preset-default';
// import Benchmark from 'benchmark';
// import createDOM from 'test/dom';
// import { createStyleManager, createStyleSheet } from 'src';

// describe('benchmarks', () => {
//   let dom;
//   let themeObj;
//   let styleManager;
//   let styleSheet;
//   let classes;

//   before(() => {
//     dom = createDOM();
//     themeObj = {
//       fontFamily: 'Roboto',
//       fontSize: 12,
//       color: 'red',
//     };
//     styleManager = createStyleManager({
//       jss: createJss(preset()),
//       theme: themeObj,
//     });
//     styleSheet = createStyleSheet('button', (theme) => ({
//       root: {
//         color: theme.color,
//         fontSize: theme.fontSize,
//         fontFamily: theme.fontFamily,
//       },
//     }));
//   });

//   after(() => {
//     dom.destroy();
//   });

//   describe('rendering to the DOM', () => {
//     it('should render the stylesheet to the DOM', function (done) {
//       this.timeout(30000);
//       const suite = new Benchmark.Suite();
//       const customTheme = { color: 'blue', fontSize: 19, fontFamily: 'Helvetica' };

//       suite
//         .add('test', () => {
//           styleManager.render(styleSheet);
//         })
//         .add('test 2', () => {
//           styleManager.render(styleSheet, customTheme);
//         })
//         .on('cycle', (event) => {
//           console.log(String(event.target));
//         })
//         .on('complete', () => {
//           done();
//         })
//         .run({ async: true });
//     });
//   });
// });
