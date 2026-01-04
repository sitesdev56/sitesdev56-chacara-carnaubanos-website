module.exports = {
  ignores: ['.next', 'node_modules', 'public', 'dist', 'build', '.env'],
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  plugins: {
    '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    react: require('eslint-plugin-react')
  },
  settings: {
    react: { version: 'detect' }
  },
  overrides: [
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      parser: require('@typescript-eslint/parser'),
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'next/core-web-vitals'],
      rules: {
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
      }
    }
  ]
};
