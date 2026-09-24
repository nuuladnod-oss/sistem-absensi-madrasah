module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['prettier'],
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['dist', 'node_modules', '*.config.cjs'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-undef': 'warn',
    'no-restricted-syntax': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}