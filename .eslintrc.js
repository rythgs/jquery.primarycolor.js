module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  settings: {},
  rules: {
    // common
    'prefer-const': 'error',
    'no-unused-vars': 'error',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-use-before-define': 'off',
    // typescript
    '@typescript-eslint/no-explicit-any': 'off',
    // import
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'import/order': [
      'warn',
      {
        alphabetize: { order: 'asc' },
        'newlines-between': 'always',
      },
    ],
  },
}
