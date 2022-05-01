module.exports = {
  // PLUGIN: node

  // require error handling in callbacks
  // node/handle-callback-err
  // ensure Node.js-style error-first callback pattern is followed
  // node/no-callback-literal
  // disallow new operators with calls to require
  'node/no-new-require': 2,
  // disallow string concatenation with __dirname and __filename
  'node/no-path-concat': 2,
  // disallow the use of process.exit()
  'node/no-process-exit': 2,
  // require return statements after callbacks
  // node/callback-return
  // enforce either module.exports or exports
  'node/exports-style': 2,
  // enforce the style of file extensions in import declarations
  // node/file-extension-in-import
  // require require() calls to be placed at top-level module scope
  'node/global-require': 2,
  // disallow require calls to be mixed with regular variable declarations
  // node/no-mixed-requires
  // disallow the use of process.env
  // node/no-process-env
  // disallow specified modules when loaded by import declarations
  // node/no-restricted-import
  // disallow specified modules when loaded by require
  // node/no-restricted-require
  // disallow synchronous methods
  'node/no-sync': 2,
  // enforce either Buffer or require("buffer").Buffer
  'node/prefer-global/buffer': 2,
  // enforce either console or require("console")
  // node/prefer-global/console
  // enforce either process or require("process")
  'node/prefer-global/process': 2,
  // enforce either TextDecoder or require("util").TextDecoder
  // node/prefer-global/text-decoder
  // enforce either TextEncoder or require("util").TextEncoder
  // node/prefer-global/text-encoder
  // enforce either URLSearchParams or require("url").URLSearchParams
  // node/prefer-global/url-search-params
  // enforce either URL or require("url").URL
  // node/prefer-global/url
  // enforce require("dns").promises
  // node/prefer-promises/dns
  'node/prefer-promises/fs': 2,

  // PLUGIN: node/recommended
  // disallow unsupported ECMAScript syntax on the specified version
  'node/no-unsupported-features/es-syntax': [2, { ignores: ['modules', 'dynamicImport'] }],

  // disallow import declarations which import private modules
  'node/no-unpublished-import': 0,
  // disallow require() expressions which import private modules
  'node/no-unpublished-require': 0,

  // because of eslint import plugin
  'node/no-missing-import': 0,
};
