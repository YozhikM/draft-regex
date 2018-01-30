module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'plugin:flowtype/recommended'],
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
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/label-has-for': 0,
    'class-methods-use-this': 0,
  },
  globals: {
    describe: true,
    it: true,
    expect: true
  }
};
