module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'prettier', 'prettier/vue', 'plugin:prettier/recommended', 'plugin:nuxt/recommended'],
  plugins: ['@typescript-eslint', 'prettier'],
  // add your custom rules here
  rules: {
    '@typescript-eslint/no-unused-vars': 0,
    'no-unused-vars': 0,
    'no-console': 0,
    'standard/no-callback-literal': 0,
    'vue/no-v-html': 0,
  },
};
