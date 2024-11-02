import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
   { files: ['**/*.{js,mjs,cjs,ts}'] },
   { languageOptions: { globals: globals.browser } },
   pluginJs.configs.recommended,
   ...tseslint.configs.recommended,
   {
      plugins: {
         prettier: eslintPluginPrettier,
      },
      rules: {
         '@typescript-eslint/no-explicit-any': 'warn',
         '@typescript-eslint/no-unused-vars': 'warn',
         'prettier/prettier': [
            'warn',
            {
               arrowParens: 'always',
               bracketSameLine: false,
               bracketSpacing: true,
               semi: true,
               experimentalTernaries: false,
               singleQuote: true,
               jsxSingleQuote: false,
               quoteProps: 'as-needed',
               trailingComma: 'all',
               singleAttributePerLine: false,
               htmlWhitespaceSensitivity: 'css',
               vueIndentScriptAndStyle: false,
               proseWrap: 'preserve',
               insertPragma: false,
               printWidth: 100,
               requirePragma: false,
               tabWidth: 3,
               useTabs: false,
               embeddedLanguageFormatting: 'auto',
            },
         ],
      },
      ignores: ['**/node_modules/', '**/dist/'],
   },
];
