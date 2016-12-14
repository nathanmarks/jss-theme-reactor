// @flow

export function createStyleSheet(
  name: string,
  callback: Object|((theme: Object) => Object),
  options: Object = {}
): ThemeReactorStyleSheet {
  const styleSheet = {
    name,
    options,
    createRules,
  };

  function createRules(theme: Object = {}): Object {
    const rules = typeof callback === 'function' ? callback(theme) : callback;

    if (!theme.overrides || !theme.overrides[name]) {
      return rules;
    }

    const overrides = theme.overrides[name];
    const rulesWithOverrides = {};

    Object.keys(rules).forEach((n) => {
      rulesWithOverrides[n] = Object.assign({}, rules[n], overrides[n]);
    });

    return rulesWithOverrides;
  }

  return styleSheet;
}
