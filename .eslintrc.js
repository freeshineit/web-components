module.exports = {
  ignorePatterns: ['/*', '!/src', '/src/**/*.js'],
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'project': 'tsconfig.json',
    'sourceType': 'module',
  },
  'plugins': ['@typescript-eslint'],
  'rules': {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    'no-case-declarations': 'off',
    'no-prototype-builtins': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-inner-declarations': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        ignoreRestSiblings: true,
      },
    ],
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'no-constant-condition': [
      'error',
      {
        checkLoops: false,
      },
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          '{}': false,
        },
      },
    ],
  },
  settings: {},
  overrides: [
    {
      'files': ['**/tests/**/*'],
      'rules': {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
}
