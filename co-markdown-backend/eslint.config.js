import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],
    rules: {
      // Coding style
      indent: ['error', 2, {
        ignoredNodes: [
          'PropertyDefinition[decorators]',
        ],
      }],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],

      // Disabled TypeScript rules
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
])