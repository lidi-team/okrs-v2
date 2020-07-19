module.exports = {
  '*.{ts,js}': ['yarn lint:files', 'yarn lint:eslint', 'yarn lint:prettier'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['yarn lint:prettier --parser json'],
  'package.json': ['yarn lint:prettier'],
  '*.vue': ['yarn lint:files', 'yarn lint:eslint', 'yarn lint:prettier'],
  '*.{css,scss}': ['yarn lint:prettier'],
  '*.{png,jpeg,jpg,gif,svg}': ['imagemin-lint-staged'],
};
