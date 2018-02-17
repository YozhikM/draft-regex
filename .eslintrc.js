module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'plugin:flowtype/recommended', 'plugin:unicorn/recommended', "plugin:array-func/recommended"],
  plugins: [
    'import',
    'flowtype',
    'prettier',
    'unicorn',
    'immutable',
    'array-func',
  ],
  rules: {
    'react/jsx-filename-extension': 0,
	"unicorn/filename-case": 0,
    "immutable/no-this": 2,
    "immutable/no-mutation": 2,
	'prettier/prettier': [
      "error",
      {
        "printWidth": 100,
        "singleQuote": true,
        "trailingComma": "es5"
      }
    ]
  },
  globals: {
    describe: true,
    it: true,
    expect: true,
	shallow: true,
	jest: true,
  }
};
