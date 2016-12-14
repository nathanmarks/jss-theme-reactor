import type Jss from 'jss/lib/jss';

export type StyleManagerOptions = {
  jss: Jss,
  theme: Object,
};

export type StyleManager = {
  sheetMap: Array<SheetMapping>,
  sheetOrder: Array<string>,
  setSheetOrder: (Array<string>) => void,
  jss: Jss,
  theme: Object,
  render: (ThemeReactorStyleSheet) => Object,
  reset: () => void,
  rerender: () => void,
  getClasses: (ThemeReactorStyleSheet) => Object|null,
  updateTheme: (Object, ?boolean) => void,
  prepareInline: (CSSStyleDeclaration|Function) => CSSStyleDeclaration,
  sheetsToString: () => string,
};

export type ThemeReactorStyleSheet = {
  name: string,
  options: Object,
  createRules: (Object) => Object,
};

export type SheetMapping = {
  name: string,
  classes: Object,
  styleSheet: ThemeReactorStyleSheet,
  jssStyleSheet: StyleSheet,
};
