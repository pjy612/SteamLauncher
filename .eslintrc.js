const { defineConfig } = require('eslint-define-config');
const myCommentsConfig = require('./eslint/comments');
const myEslintConfig = require('./eslint/eslint');
const myImportConfig = require('./eslint/import');
const myModuleConfig = require('./eslint/module');
const myNodeConfig = require('./eslint/node');
const myPromiseConfig = require('./eslint/promise');
const myTypescriptConfig = require('./eslint/typescript');
const myUnicornConfig = require('./eslint/unicorn');

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
    jquery: true,
  },
  plugins: [
    'node',
    'import',
    'unicorn',
    'eslint-comments',
    'sonarjs',
    'compat',
    'promise',
    'regexp',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:node/recommended-script',
    'plugin:import/recommended',
    'plugin:import/electron',
    'plugin:unicorn/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:sonarjs/recommended',
    'plugin:compat/recommended',
    'plugin:promise/recommended',
    'plugin:regexp/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        // FIX VITE
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    ...myEslintConfig,
    ...myNodeConfig,
    ...myImportConfig,
    ...myPromiseConfig,
    ...myUnicornConfig,
    ...myCommentsConfig,
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:node/recommended-module',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        ...myNodeConfig,
        ...myModuleConfig,
        ...myTypescriptConfig,
      },
    },
  ],
});
