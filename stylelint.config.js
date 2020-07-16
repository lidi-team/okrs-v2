const scssRules = [
  true,
  {
    ignoreAtRules: ['mixin', 'if', 'else', 'error', 'include'],
  },
];

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-scss'],
  rules: {
    'at-rule-no-unknown': scssRules,
    'scss/at-rule-no-unknown': scssRules,
    'selector-pseudo-element-colon-notation': 'single',
    'comment-empty-line-before': 'always',
  },
};
