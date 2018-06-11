module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  parser: 'babel-eslint',
  extends: ['prettier', 'plugin:flowtype/recommended'],
  plugins: ['import', 'flowtype', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
  },
  globals: {
    describe: true,
    it: true,
    expect: true,
    shallow: true,
    jest: true,
  },
};
