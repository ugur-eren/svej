import {defineConfig, globalIgnores} from 'eslint/config';
import react from 'eslint-plugin-react';
import reactNative from 'eslint-plugin-react-native';
import reactHooks from 'eslint-plugin-react-hooks';
import reactQuery from '@tanstack/eslint-plugin-query';
import {fixupPluginRules} from '@eslint/compat';
import baseConfig from '../../eslint.config.mjs';

export default defineConfig(baseConfig, [
  globalIgnores([
    '**/ios',
    '**/android',
    '**/build',
    '**/coverage',
    '**/.expo',
    '**/.expo-shared',
    'storybook/storyLoader.js',
  ]),
  ...reactQuery.configs['flat/recommended-strict'],
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ...react.configs.flat.recommended,
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ...react.configs.flat['jsx-runtime'],
  },
  {
    plugins: {
      'react-native': fixupPluginRules(reactNative),
      'react-hooks': fixupPluginRules(reactHooks),
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...reactNative.environments['react-native']['react-native'],
      },
    },

    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      'jsx-quotes': ['error', 'prefer-double'],

      'react/jsx-boolean-value': ['error', 'never', {always: []}],
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
      'react/jsx-closing-tag-location': 'error',
      'react/jsx-curly-spacing': ['error', 'never', {allowMultiline: true}],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-max-props-per-line': ['error', {maximum: 1, when: 'multiline'}],
      'react/jsx-no-bind': [
        'error',
        {
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: false,
          allowBind: false,
          ignoreDOMComponents: true,
        },
      ],
      'react/jsx-no-duplicate-props': ['error', {ignoreCase: true}],
      'react/jsx-pascal-case': ['error', {allowAllCaps: true}],
      'react/self-closing-comp': 'error',
      'react/jsx-wrap-multilines': [
        'error',
        {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line',
          arrow: 'parens-new-line',
          condition: 'parens-new-line',
          logical: 'parens-new-line',
          prop: 'never',
        },
      ],
      'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      'react/jsx-equals-spacing': ['error', 'never'],
      'react/jsx-indent': ['error', 2],
      'react/no-unused-prop-types': 'error',
      'react/jsx-tag-spacing': [
        'error',
        {
          closingSlash: 'never',
          beforeSelfClosing: 'always',
          afterOpening: 'never',
          beforeClosing: 'never',
        },
      ],
      'react/void-dom-elements-no-children': 'error',
      'react/no-typos': 'error',
      'react/jsx-curly-brace-presence': ['error', {props: 'never', children: 'never'}],
      'react/destructuring-assignment': ['error', 'always'],
      'react/button-has-type': [
        'error',
        {
          button: true,
          submit: true,
          reset: false,
        },
      ],
      'react/no-this-in-sfc': 'error',
      'react/jsx-props-no-multi-spaces': 'error',
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-curly-newline': [
        'error',
        {
          multiline: 'consistent',
          singleline: 'consistent',
        },
      ],
      'react/jsx-no-constructed-context-values': 'error',
      'react/no-unstable-nested-components': 'error',
      'react/no-namespace': 'error',
      'react/no-invalid-html-attribute': 'error',
      'react/no-array-index-key': 'error',
      'react/function-component-definition': [
        'error',
        {
          unnamedComponents: ['function-expression', 'arrow-function'],
          namedComponents: ['function-declaration', 'arrow-function'],
        },
      ],
      'react/jsx-no-useless-fragment': 'warn',
      'react/no-danger': 'warn',
      'react/jsx-filename-extension': [
        'warn',
        {
          extensions: ['.jsx', '.tsx'],
        },
      ],
      'react/display-name': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/prop-types': 'off',
      'react/jsx-one-expression-per-line': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'error',
      'react-native/no-color-literals': 'error',
      'react-native/no-single-element-style-arrays': 'error',
      'react-native/no-raw-text': [
        'error',
        {
          skip: ['TextButton'],
        },
      ],

      '@tanstack/query/exhaustive-deps': 'error',
      '@tanstack/query/stable-query-client': 'error',
      '@tanstack/query/no-rest-destructuring': 'warn',
      '@tanstack/query/prefer-query-options': 'off',
    },
  },
  {
    files: ['**/*.style.ts', '**/*.styles.ts'],

    rules: {
      '@typescript-eslint/camelcase': 'off',
    },
  },
  {
    files: ['src/Redux/**/*.ts'],

    rules: {
      'no-param-reassign': 'off',
    },
  },
]);
