module.exports = {
  // PLUGIN: eslint

  // SECTION: possibile problems
  // enforce `return` statements in callbacks of array methods
  'array-callback-return': 2,
  // disallow `await` inside of loops
  // no-await-in-loop
  // disallow expressions where the operation doesn't affect the value
  'no-constant-binary-expression': 2,
  // disallow returning value from constructor
  'no-constructor-return': 2,
  // disallow duplicate module imports
  // no-duplicate-imports; import/no-duplicates is better
  // disallow returning values from Promise executor functions
  'no-promise-executor-return': 2,
  // disallow comparisons where both sides are exactly the same
  'no-self-compare': 2,
  // disallow template literal placeholder syntax in regular strings
  'no-template-curly-in-string': 2,
  // disallow unmodified loop conditions
  // no-unmodified-loop-condition
  // disallow loops with a body that allows only one iteration
  'no-unreachable-loop': 2,
  // disallow unused private class members
  'no-unused-private-class-members': 2,
  // disallow the use of variables before they are defined
  'no-use-before-define': 2,
  // disallow assignments that can lead to race conditions due to usage of `await` or `yield`
  'require-atomic-updates': 2,

  // SECTION: suggestions
  // enforce getter and setter pairs in objects and classes
  // accessor-pairs
  // require braces around arrow function bodies
  'arrow-body-style': ['error', 'as-needed'],
  // enforce the use of variables within the scope they are defined
  'block-scoped-var': 2,
  // enforce camelcase naming convention
  camelcase: 2,
  // enforce or disallow capitalization of the first letter of a comment
  // capitalized-comments
  // enforce that class methods utilize `this`
  // class-methods-use-this
  // enforce a maximum cyclomatic complexity allowed in a program
  // complexity
  // require `return` statements to either always or never specify values
  'consistent-return': 2,
  // enforce consistent naming when capturing the current execution context
  // consistent-this
  // enforce consistent brace style for all control statements
  curly: 2,
  // require `default` cases in `switch` statements
  'default-case': 2,
  // enforce default clauses in switch statements to be last
  'default-case-last': 2,
  // enforce default parameters to be last
  'default-param-last': 2,
  // enforce dot notation whenever possible
  'dot-notation': 2,
  // require the use of `===` and `!==`
  eqeqeq: 2,
  // require function names to match the name of the variable or property to which they are assigned
  'func-name-matching': 2,
  // require or disallow named `function` expressions
  'func-names': 2,
  // enforce the consistent use of either `function` declarations or expressions
  'func-style': 2,
  // require grouped accessor pairs in object literals and classes
  // grouped-accessor-pairs
  'guard-for-in': 2,
  // disallow specified identifiers
  // id-denylist
  // enforce minimum and maximum identifier lengths
  // id-length
  // require identifiers to match a specified regular expression
  // id-match
  // require or disallow initialization in variable declarations
  // init-declarations
  // enforce a maximum number of classes per file
  // max-classes-per-file
  // enforce a maximum depth that blocks can be nested
  // max-depth
  // enforce a maximum number of lines per file
  // max-lines
  // enforce a maximum number of lines of code in a function
  // max-lines-per-function
  // enforce a maximum depth that callbacks can be nested
  // max-nested-callbacks
  // enforce a maximum number of parameters in function definitions
  // max-params
  // enforce a maximum number of statements allowed in function blocks
  // max-statements
  // enforce a particular style for multiline comments
  // multiline-comment-style
  // require constructor names to begin with a capital letter
  'new-cap': 2,
  // disallow the use of `alert`, `confirm`, and `prompt`
  'no-alert': 2,
  // disallow `Array` constructors
  'no-array-constructor': 2,
  // disallow bitwise operators
  'no-bitwise': 2,
  // disallow the use of `arguments.caller` or `arguments.callee`
  'no-caller': 2,
  // disallow arrow functions where they could be confused with comparisons
  'no-confusing-arrow': 2,
  // disallow the use of `console`
  'no-console': 2,
  // disallow `continue` statements
  'no-continue': 2,
  // disallow division operators explicitly at the beginning of regular expressions
  'no-div-regex': 2,
  // disallow `else` blocks after `return` statements in `if` statements
  'no-else-return': 2,
  // disallow empty functions
  'no-empty-function': 2,
  // disallow `null` comparisons without type-checking operators
  'no-eq-null': 2,
  // disallow the use of `eval()`
  'no-eval': 2,
  // disallow extending native types
  'no-extend-native': 2,
  // disallow unnecessary calls to `.bind()`
  'no-extra-bind': 2,
  // disallow unnecessary labels
  'no-extra-label': 2,
  // disallow leading or trailing decimal points in numeric literals
  'no-floating-decimal': 2,
  // disallow shorthand type conversions
  'no-implicit-coercion': 2,
  // disallow declarations in the global scope
  // no-implicit-globals
  // disallow the use of `eval()`-like methods
  'no-implied-eval': 2,
  // disallow inline comments after code
  'no-inline-comments': 2,
  // disallow use of `this` in contexts where the value of `this` is `undefined`
  'no-invalid-this': 2,
  // disallow the use of the `__iterator__` property
  'no-iterator': 2,
  // disallow labels that share a name with a variable
  'no-label-var': 2,
  // disallow labeled statements
  'no-labels': 2,
  // disallow unnecessary nested blocks
  'no-lone-blocks': 2,
  // disallow `if` statements as the only statement in `else` blocks
  'no-lonely-if': 2,
  // disallow function declarations that contain unsafe references inside loop statements
  'no-loop-func': 2,
  // disallow magic numbers
  // no-magic-numbers
  // disallow mixed binary operators
  // no-mixed-operators
  // disallow use of chained assignment expressions
  'no-multi-assign': 2,
  // disallow multiline strings
  'no-multi-str': 2,
  // disallow negated conditions
  // no-negated-condition
  // disallow nested ternary expressions
  // no-nested-ternary
  // disallow `new` operators outside of assignments or comparisons
  'no-new': 2,
  // disallow `new` operators with the `Function` object
  'no-new-func': 2,
  // disallow `Object` constructors
  'no-new-object': 2,
  // disallow `new` operators with the `String`, `Number`, and `Boolean` objects
  'no-new-wrappers': 2,
  // disallow octal escape sequences in string literals
  'no-octal-escape': 2,
  // disallow reassigning `function` parameters
  'no-param-reassign': 2,
  // disallow the unary operators `++` and `--`
  // no-plusplus
  // disallow the use of the `__proto__` property
  'no-proto': 2,
  // disallow specified names in exports
  // no-restricted-exports
  // disallow specified global variables
  // no-restricted-globals
  // disallow specified modules when loaded by `import`
  // no-restricted-imports
  // disallow certain properties on certain objects
  // no-restricted-properties
  // disallow specified syntax
  // no-restricted-syntax
  // disallow assignment operators in `return` statements
  'no-return-assign': 2,
  // disallow unnecessary `return await`
  'no-return-await': 2,
  // disallow `javascript:` urls
  'no-script-url': 2,
  // disallow comma operators
  // no-sequences
  // disallow variable declarations from shadowing variables declared in the outer scope
  // no-shadow
  // disallow ternary operators
  // no-ternary
  // disallow throwing literals as exceptions
  'no-throw-literal': 2,
  // disallow initializing variables to `undefined`
  // no-undef-init
  // disallow the use of `undefined` as an identifier
  // no-undefined
  // disallow dangling underscores in identifiers
  // no-underscore-dangle
  // disallow ternary operators when simpler alternatives exist
  'no-unneeded-ternary': 2,
  // disallow unused expressions
  'no-unused-expressions': 2,
  // disallow unnecessary calls to `.call()` and `.apply()`
  'no-useless-call': 2,
  // disallow unnecessary `catch` clauses
  'no-useless-catch': 2,
  // disallow unnecessary computed property keys in objects and classes
  'no-useless-computed-key': 2,
  // disallow unnecessary concatenation of literals or template literals
  'no-useless-concat': 2,
  // disallow unnecessary constructors
  'no-useless-constructor': 2,
  // disallow renaming import, export, and destructured assignments to the same name
  'no-useless-rename': 2,
  // disallow redundant return statements
  'no-useless-return': 2,
  // require `let` or `const` instead of `var`
  'no-var': 2,
  // disallow `void` operators
  // no-void
  // disallow specified warning terms in comments
  // no-warning-comments
  // require or disallow method and property shorthand syntax for object literals
  'object-shorthand': 2,
  // enforce variables to be declared either together or separately in functions
  // one-var
  // require or disallow newlines around variable declarations
  // one-var-declaration-per-line
  // require or disallow assignment operator shorthand where possible
  'operator-assignment': 2,
  // require using arrow functions for callbacks
  'prefer-arrow-callback': 2,
  // require `const` declarations for variables that are never reassigned after declared
  'prefer-const': 2,
  // require destructuring from arrays and/or objects
  // prefer-destructuring
  // disallow the use of `Math.pow` in favor of the `**` operator
  // prefer-exponentiation-operator
  // enforce using named capture group in regular expression
  'prefer-named-capture-group': 2,
  // disallow `parseInt()` and `Number.parseInt()` in favor of binary, octal, and hexadecimal literals
  // prefer-numeric-literals
  // disallow use of `Object.prototype.hasOwnProperty.call()` and prefer use of `Object.hasOwn()`
  'prefer-object-has-own': 2,
  // disallow using Object.assign with an object literal as the first argument and prefer the use of object spread instead.
  'prefer-object-spread': 2,
  // require using Error objects as Promise rejection reasons
  'prefer-promise-reject-errors': 2,
  // disallow use of the `RegExp` constructor in favor of regular expression literals
  'prefer-regex-literals': 2,
  // require rest parameters instead of `arguments`
  'prefer-rest-params': 2,
  // require spread operators instead of `.apply()`
  'prefer-spread': 2,
  // require template literals instead of string concatenation
  'prefer-template': 2,
  // require quotes around object literal property names
  // quote-props
  // enforce the consistent use of the radix argument when using `parseInt()`
  // radix
  // disallow async functions which have no `await` expression
  'require-await': 2,
  // enforce the use of `u` flag on RegExp
  'require-unicode-regexp': 2,
  // enforce sorted import declarations within modules
  // sort-imports
  // require object keys to be sorted
  // sort-keys
  // equire variables within the same declaration block to be sorted
  // sort-vars
  // enforce consistent spacing after the `//` or `/*` in a comment
  'spaced-comment': 2,
  // require or disallow strict mode directives
  // strict
  // require symbol descriptions
  // symbol-description
  // require `var` declarations be placed at the top of their containing scope
  // vars-on-top
  // require or disallow "Yoda" conditions
  yoda: 2,

  // SECTION: layout & formatting
  // enforce linebreaks after opening and before closing array brackets
  // array-bracket-newline
  // enforce consistent spacing inside array brackets
  // array-bracket-spacing
  // enforce line breaks after each array element
  // array-element-newline
  // require parentheses around arrow function arguments
  'arrow-parens': 2,
  // enforce consistent spacing before and after the arrow in arrow functions
  'arrow-spacing': 2,
  // disallow or enforce spaces inside of blocks after opening block and before closing block
  'block-spacing': 2,
  // enforce consistent brace style for blocks
  // brace-style
  // require or disallow trailing commas
  // comma-dangle
  // enforce consistent spacing before and after commas
  // comma-spacing
  // enforce consistent comma style
  // comma-style
  // enforce consistent spacing inside computed property brackets
  // computed-property-spacing
  // enforce consistent newlines before and after dots
  // dot-location
  // require or disallow newline at the end of files
  // eol-last
  // require or disallow spacing between function identifiers and their invocations
  // func-call-spacing
  // enforce line breaks between arguments of a function call
  // function-call-argument-newline
  // enforce consistent line breaks inside function parentheses
  // function-paren-newline
  // enforce consistent spacing around `*` operators in generator functions
  // generator-star-spacing
  // enforce the location of arrow function bodies
  // implicit-arrow-linebreak
  // enforce consistent indentation
  // indent
  // enforce the consistent use of either double or single quotes in JSX attributes
  // jsx-quotes
  // enforce consistent spacing between keys and values in object literal properties
  // key-spacing
  // enforce consistent spacing before and after keywords
  // keyword-spacing
  // enforce position of line comments
  // line-comment-position
  // enforce consistent linebreak style
  // linebreak-style
  // require empty lines around comments
  // lines-around-comment
  // require or disallow an empty line between class members
  // lines-between-class-members
  // enforce a maximum line length
  // max-len
  // enforce a maximum number of statements allowed per line
  // max-statements-per-line
  // enforce newlines between operands of ternary expressions
  // multiline-ternary
  // enforce or disallow parentheses when invoking a constructor with no arguments
  // new-parens
  // require a newline after each call in a method chain
  // newline-per-chained-call
  // disallow unnecessary parentheses
  // no-extra-parens
  // disallow multiple spaces
  // no-multi-spaces
  // disallow multiple empty lines
  // no-multiple-empty-lines
  // disallow all tabs
  // no-tabs
  // disallow trailing whitespace at the end of lines
  // no-trailing-spaces
  // disallow whitespace before properties
  // no-whitespace-before-property
  // enforce the location of single-line statements
  // nonblock-statement-body-position
  // enforce consistent line breaks after opening and before closing braces
  // object-curly-newline
  // enforce consistent spacing inside braces
  // object-curly-spacing
  // enforce placing object properties on separate lines
  // object-property-newline
  // enforce consistent linebreak style for operators
  // operator-linebreak
  // require or disallow padding within blocks
  // padded-blocks
  // require or disallow padding lines between statements
  // padding-line-between-statements
  // enforce the consistent use of either backticks, double, or single quotes
  // quotes
  // enforce spacing between rest and spread operators and their expressions
  // rest-spread-spacing
  // semi	require or disallow semicolons instead of ASI
  semi: [2, 'always'],
  // enforce consistent spacing before and after semicolons
  // semi-spacing
  // enforce location of semicolons
  // semi-style
  // enforce consistent spacing before blocks
  // space-before-blocks
  // enforce consistent spacing before
  // `function` definition opening parenthesis
  // space-before-function-paren
  // enforce consistent spacing inside parentheses
  // space-in-parens
  // require spacing around infix operators
  // space-infix-ops
  // enforce consistent spacing before or after unary operators
  // space-unary-ops
  // enforce spacing around colons of switch statements
  // switch-colon-spacing
  // require or disallow spacing around embedded expressions of template strings
  // template-curly-spacing
  // require or disallow spacing between template tags and their literals
  // template-tag-spacing
  // require or disallow Unicode byte order mark (BOM)
  // unicode-bom
  // require parentheses around immediate `function` invocations
  // wrap-iife
  // require parenthesis around regex literals
  // wrap-regex
  // require or disallow spacing around the `*` in `yield*` expressions
  // yield-star-spacing
};
