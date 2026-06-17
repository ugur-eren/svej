import {defineConfig, globalIgnores} from 'eslint/config';
import globals from 'globals';
import baseConfig from '../../eslint.config.mjs';

export default defineConfig(baseConfig, [
  globalIgnores(['**/dist']),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'warn',
    },
  },
]);
