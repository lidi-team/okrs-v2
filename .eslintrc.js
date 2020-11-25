module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'prettier', 'prettier/vue', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars-experimental': 'off',
    'import/named': 'off',
    'no-undef': 'off',
    'no-console': 'off',
    'standard/no-callback-literal': 0,
    'vue/no-v-html': 0,
    'import/order': ['off'],
    'vue/valid-v-bind-sync': 0,
    'lines-between-class-members': 0,
    'vue/attribute-hyphenation': 0,
    'vue/attributes-order': 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
