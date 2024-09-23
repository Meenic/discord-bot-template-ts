/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'prettier/prettier': ['error'],
  },
  env: {
    node: true,
    es2020: true,
    jest: true,
  },
  ignores: ['node_modules/', 'dist/', '*.js'],
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        // TypeScript-specific rules can be added here
      },
    },
  ],
};

module.exports = config;
