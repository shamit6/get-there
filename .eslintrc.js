module.exports = {
  extends: ['next', 'next/core-web-vitals'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'unused-imports', 'prettier'],
  rules: {
    'prettier/prettier': 'warn',
    'unused-imports/no-unused-imports': 'error',
    // "unused-imports/no-unused-vars": [
    // 	"warn",
    // 	{ "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
    // ]
  },
}
