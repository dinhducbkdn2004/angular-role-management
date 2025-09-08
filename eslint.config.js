import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2020,
      },
    },
    plugins: {
      '@angular-eslint': angular,
      '@typescript-eslint': tseslint,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...angular.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    rules: {
      ...angularTemplate.configs.recommended.rules,
    },
  },
];
