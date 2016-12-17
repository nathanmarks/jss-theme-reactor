// @flow

export function createStyleSheet(
  name: string,
  callback: Object|((theme: Object) => Object),
  options: Object = {},
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
    const rulesWithOverrides = { ...rules };

    Object.keys(overrides).forEach((n) => {
      rulesWithOverrides[n] = Object.assign(rulesWithOverrides[n] || {}, overrides[n]);
    });

    return rulesWithOverrides;
  }

  return styleSheet;
}
