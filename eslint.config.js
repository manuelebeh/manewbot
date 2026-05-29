'use strict';

const globals = require('globals');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'packages/**',
      'downloads/**',
      'sessions/**',
      'auth/**',
      'lib/style-maps.js',
      'scripts/**',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-duplicate-case': 'error',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
    },
  },
];
