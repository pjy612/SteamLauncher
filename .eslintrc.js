const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
    jquery: true,
  },
  parserOptions: {
    ecmaFeatures: {
      globalReturn: true,
    },
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
    'plugin:node/recommended',
    'plugin:import/recommended',
    'plugin:unicorn/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:sonarjs/recommended',
    'plugin:compat/recommended',
    'plugin:promise/recommended',
    'plugin:regexp/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    node: {
      tryExtensions: ['.js', '.ts', '.d.ts', '.json'],
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    // PLUGIN: eslint
    'array-callback-return': 2,
    // no-await-in-loop
    'no-constructor-return': 2,
    // no-duplicate-imports
    // no-promise-executor-return
    'no-self-compare': 2,
    'no-template-curly-in-string': 2,
    // no-unmodified-loop-condition
    'no-unreachable-loop': 2,
    'no-unused-private-class-members': 2,
    'no-use-before-define': 2,
    // accessor-pairs
    // arrow-body-style
    'block-scoped-var': 2,
    camelcase: 2,
    // capitalized-comments
    // class-methods-use-this
    // complexity
    'consistent-return': 2,
    // consistent-this
    curly: 2,
    'default-case': 2,
    'default-case-last': 2,
    'default-param-last': 2,
    'dot-notation': 2,
    eqeqeq: 2,
    // func-name-matching
    // func-names	require
    'func-style': 2,
    // grouped-accessor-pairs
    'guard-for-in': 2,
    // id-denylist
    // id-length
    // id-match
    // init-declarations
    // max-classes-per-file
    // max-depth
    // max-lines
    // max-lines-per-function
    // max-nested-callbacks
    // max-params
    // max-statements
    // multiline-comment-style
    'new-cap': 2,
    'no-alert': 2,
    'no-array-constructor': 2,
    'no-bitwise': 2,
    'no-caller': 2,
    'no-confusing-arrow': 2,
    'no-console': 2,
    'no-continue': 2,
    'no-div-regex': 2,
    'no-else-return': 2,
    'no-empty-function': 2,
    'no-eq-null': 2,
    'no-eval': 2,
    // no-extend-native
    'no-extra-bind': 2,
    // no-extra-label
    'no-floating-decimal': 2,
    'no-implicit-coercion': 2,
    // no-implicit-globals
    'no-implied-eval': 2,
    'no-inline-comments': 2,
    'no-invalid-this': 2,
    // no-iterator
    // no-label-var
    // no-labels
    // no-lone-blocks
    'no-lonely-if': 2,
    'no-loop-func': 2,
    // no-magic-numbers
    // no-mixed-operators
    'no-multi-assign': 2,
    'no-multi-str': 2,
    // no-negated-condition
    // no-nested-ternary
    'no-new': 2,
    'no-new-func': 2,
    'no-new-object': 2,
    'no-new-wrappers': 2,
    // no-octal-escape
    'no-param-reassign': 2,
    // no-plusplus
    // no-proto
    // no-restricted-exports
    // no-restricted-globals
    // no-restricted-imports
    // no-restricted-properties
    // no-restricted-syntax
    // no-return-assign
    'no-return-await': 2,
    // no-script-url
    // no-sequences
    // no-shadow
    // no-ternary
    'no-throw-literal': 2,
    // no-undef-init
    // no-undefined
    // no-underscore-dangle
    'no-unneeded-ternary': 2,
    // no-unused-expressions
    'no-useless-call': 2,
    'no-useless-catch': 2,
    'no-useless-computed-key': 2,
    'no-useless-concat': 2,
    'no-useless-constructor': 2,
    // no-useless-rename
    'no-useless-return': 2,
    'no-var': 2,
    // no-void
    // no-warning-comments
    'object-shorthand': 2,
    // one-var
    // one-var-declaration-per-line
    // operator-assignment
    // prefer-arrow-callback
    'prefer-const': 2,
    'prefer-destructuring': 2,
    // prefer-exponentiation-operator
    // prefer-named-capture-group
    // prefer-numeric-literals
    // prefer-object-has-own
    'prefer-object-spread': 2,
    'prefer-promise-reject-errors': 2,
    'prefer-regex-literals': 2,
    'prefer-rest-params': 2,
    'prefer-spread': 2,
    'prefer-template': 2,
    // quote-props
    // radix
    // require-await
    'require-unicode-regexp': 2,
    // sort-imports
    // sort-keys
    // sort-vars
    // spaced-comment
    // strict
    // symbol-description
    // vars-on-top
    // yoda
    semi: [2, 'always'],

    // PLUGIN: node
    // node/handle-callback-err
    // node/no-callback-literal
    'node/no-new-require': 2,
    'node/no-path-concat': 2,
    'node/no-process-exit': 2,
    // node/callback-return
    'node/exports-style': 2,
    // node/file-extension-in-import
    'node/global-require': 2,
    // node/no-mixed-requires
    // node/no-process-env
    // node/no-restricted-import
    // node/no-restricted-require
    'node/no-sync': 2,
    'node/prefer-global/buffer': 2,
    // node/prefer-global/console
    'node/prefer-global/process': 2,
    // node/prefer-global/text-decoder
    // node/prefer-global/text-encoder
    // node/prefer-global/url-search-params
    // node/prefer-global/url
    // node/prefer-promises/dns
    'node/prefer-promises/fs': 2,

    'node/no-unsupported-features/es-syntax': 0,
    'node/no-unpublished-import': 0,
    'node/no-unpublished-require': 0,

    // PLUGIN: import
    'import/no-useless-path-segments': 2,
    'import/no-mutable-exports': 2,
    'import/no-unused-modules': 2,
    'import/newline-after-import': 2,
    'import/order': [
      2,
      {
        alphabetize: {
          caseInsensitive: false,
          order: 'asc',
        },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'never',
      },
    ],

    // PLUGIN: promise
    'promise/always-return': 0,

    // PLUGIN: unicorn
    // unicorn/custom-error-definition
    // unicorn/no-keyword-prefix
    'unicorn/no-unsafe-regex': 2,
    // unicorn/prefer-at
    // unicorn/prefer-json-parse-buffer
    // unicorn/prefer-string-replace-all
    // unicorn/prefer-top-level-await
    // unicorn/require-post-message-target-origin
    // unicorn/string-content

    'unicorn/prefer-module': 0,
    'unicorn/prefer-export-from': [2, { ignoreUsedVariables: true }],

    // PLUGIN: eslint-comments
    'eslint-comments/no-unused-disable': 2,
    'eslint-comments/disable-enable-pair': 0,
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
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript',
      ],
      rules: {
        '@typescript-eslint/no-misused-promises': 0,

        '@typescript-eslint/no-non-null-assertion': 0,

        //'@typescript-eslint/no-unsafe-assignment': 0,
        //'@typescript-eslint/no-unsafe-member-access': 0,
        //'@typescript-eslint/no-explicit-any': 0,
        //'@typescript-eslint/no-unsafe-argument': 0,

        'unicorn/prefer-module': 2,
      },
    },
  ],
});
