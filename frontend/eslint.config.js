import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: [
      'build/**',
      'node_modules/**',
      'r2-worker/**',
      'public/**',
      'scripts/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // This project uses the automatic JSX runtime and does not use PropTypes.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Copy in this project legitimately contains apostrophes and quotes.
      'react/no-unescaped-entities': 'off',
      // The CKP terminal/mono design language puts literal "//" separators in
      // display copy ("{userName} // Level 03", "EARTH // CHROMA KEY ACT 1").
      // The rule reads those as stray JS comments; they are intentional.
      'react/jsx-no-comment-textnodes': 'off',
      // react-three-fiber renders three.js objects as intrinsic JSX elements
      // (<mesh>, <pointLight>, ...) whose props (position, intensity, args)
      // are not DOM attributes. The rule cannot tell them apart, so it fires
      // on every valid R3F scene.
      'react/no-unknown-property': 'off',

      // Surface the failure classes that actually bite here: stale closures and
      // leaked resources in the visualizer/audio code.
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },
  {
    files: ['src/**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Build config, dev-only plugins, and diagnostic scripts run under Node,
    // not in the browser.
    files: [
      '*.config.js',
      '*.config.mjs',
      '*.mjs',
      'plugins/**/*.js',
    ],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-unused-vars': 'warn',
    },
  },
  {
    // ESM Node files must not be parsed as CommonJS.
    files: ['*.mjs', 'vite.config.js', 'eslint.config.js', 'src/lib/server.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
];
