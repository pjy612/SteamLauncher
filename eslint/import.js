module.exports = {
  // PLUGIN: import

  // SECTION: static analysis
  // restrict which files can be imported in a given folder
  // import/no-restricted-paths
  // forbid import of modules using absolute paths
  'import/no-absolute-path': 2,
  // forbid require() calls with expressions
  'import/no-dynamic-require': 2,
  // prevent importing the submodules of other modules
  // import/no-internal-modules
  // forbid webpack loader syntax in imports
  'import/no-webpack-loader-syntax': 2,
  // forbid a module from importing itself
  'import/no-self-import': 2,
  // forbid a module from importing a module with a dependency path back to itself
  'import/no-cycle': 2,
  // prevent unnecessary path segments in import and require statements
  'import/no-useless-path-segments': 2,
  // forbid importing modules from parent directories
  // import/no-relative-parent-imports
  // prevent importing packages through relative paths
  // import/no-relative-packages

  // SECTION: helpful warnings
  // report imported names marked with @deprecated documentation tag
  'import/no-deprecated': 2,
  // forbid the use of extraneous packages
  'import/no-extraneous-dependencies': [
    2,
    {
      devDependencies: true,
      optionalDependencies: true,
      peerDependencies: true,
    },
  ],
  // forbid the use of mutable exports with var or let.
  'import/no-mutable-exports': 2,
  // report modules without exports, or exports without matching import in another module
  'import/no-unused-modules': 2,

  // SECTION: module systems
  // report potentially ambiguous parse goal (script vs. module)
  // import/unambiguous
  // report CommonJS require calls and module.exports or exports.*.
  // import/no-commonjs
  // report AMD require and define calls.
  'import/no-amd': 2,
  // no Node.js builtin modules.
  // import/no-nodejs-modules
  // forbid imports with CommonJS exports
  // import/no-import-module-exports

  // SECTION: style guide
  // ensure all imports appear before other statements
  'import/first': 2,
  // ensure all exports appear after other statements
  // import/exports-last
  // forbid namespace (a.k.a. "wildcard" *) imports
  // import/no-namespace
  // ensure consistent use of file extension within the import path
  // import/extensions
  // enforce a convention in module import order
  'import/order': [
    2,
    {
      groups: ['type', 'builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'unknown'],
    },
  ],
  // enforce a newline after import statements
  'import/newline-after-import': 2,
  // prefer a default export if module exports a single name
  // import/prefer-default-export
  // limit the maximum number of dependencies a module can have
  // import/max-dependencies
  // forbid unassigned imports
  // import/no-unassigned-import
  // forbid named default exports
  'import/no-named-default': 2,
  // forbid default exports
  // import/no-default-export
  // forbid named exports
  // import/no-named-export
  // forbid anonymous values as default exports
  // import/no-anonymous-default-export
  // prefer named exports to be grouped together in a single export declaration
  // import/group-exports
  // enforce a leading comment with the webpackChunkName for dynamic imports
  // import/dynamic-import-chunkname

  // PLUGIN: import/recommended
  'import/no-duplicates': ['error', { considerQueryString: true }],
};
