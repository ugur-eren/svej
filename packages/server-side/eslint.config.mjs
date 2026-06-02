import {defineConfig} from 'eslint/config';
import globals from 'globals';
import baseConfig from '../../eslint.config.mjs';

export default defineConfig(baseConfig, [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'warn',
    },
  },
]);
