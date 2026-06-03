import {fixupConfigRules, fixupPluginRules} from '@eslint/compat';
import {defineConfig} from 'eslint/config';
import _import from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import {FlatCompat} from '@eslint/eslintrc';

const compat = new FlatCompat();

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: fixupPluginRules(_import),
    },
    extends: [
      tseslint.configs.recommended,
      fixupConfigRules(
        compat.extends(
          'airbnb-base',
          'plugin:import/errors',
          'plugin:import/warnings',
          'plugin:import/typescript',
        ),
      ),
    ],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
  },
  prettier,
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],

    rules: {
      'no-console': [
        'error',
        {
          allow: ['info', 'warn', 'error'],
        },
      ],
      'object-curly-spacing': ['error', 'never'],
      'prefer-destructuring': 'error',
      'lines-between-class-members': 'off',
      'class-methods-use-this': 'off',
      'global-require': 'off',
      'no-underscore-dangle': 'off',
      'linebreak-style': 'off',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',

      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [],
        },
      ],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts,mtsx}'],

    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['**/eslint.config.mjs'],

    languageOptions: {
      parserOptions: {
        project: false,
      },
    },

    rules: {
      'import/no-extraneous-dependencies': 'off',
      'import/no-relative-packages': 'off',
      'import/no-unresolved': 'off',
      'prettier/prettier': 'off',
    },
  },
]);
