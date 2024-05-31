module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'next/core-web-vitals',
    // "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-type-checked",
    'next',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['react', '@typescript-eslint', 'unused-imports'],
  env: {
    es2020: true,
    browser: true,
    node: true,
  },
  globals: {
    React: true,
    // jest: true,
  },
  ignorePatterns: ['**/*.js'],
  rules: {
    'prettier/prettier': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    'react-hooks/exhaustive-deps': 'off',
    'no-empty': 'off',
  },
  overrides: [
    {
      files: ['**/*.spec.ts', '**/*.spec.tsx'],
      env: {
        jest: true,
      },
    },
    {
      files: ['**/route.ts'],
      rules: {
        'no-unused-vars': 'off',
      }
    }
  ],
}
