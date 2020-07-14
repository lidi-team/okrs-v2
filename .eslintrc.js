const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  // add your custom rules here
  rules: {
    '@typescript-eslint/no-unused-vars': isDev ? 'off' : 'on',
    'no-unused-vars': isDev ? 'off' : 'on',
    'no-console': isDev ? 'off' : 'on',
  },
};
