module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:sonarjs/recommended-legacy',
  ],
  plugins: [
    'react',
    'react-hooks',
    'react-refresh',
    'sonarjs',
  ],
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
      runtime: 'automatic', // Enable automatic JSX runtime
    },
  },
  globals: {
    google: 'readonly', // Google Maps API
  },
  rules: {
    // React rules - modern React doesn't require React import
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/no-unescaped-entities': 'off', // Allow quotes in JSX
    
    // React Refresh rules
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    
    // SonarJS rules - customize as needed
    'sonarjs/cognitive-complexity': ['error', 20], // Increased for game logic
    'sonarjs/no-duplicate-string': ['error', { threshold: 4 }], // More lenient for tests
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/no-redundant-boolean': 'error',
    'sonarjs/prefer-immediate-return': 'warn', // Warning instead of error
    'sonarjs/prefer-single-boolean-return': 'warn',
    'sonarjs/slow-regex': 'warn', // Warning for regex issues
    'sonarjs/no-globals-shadowing': 'warn', // Warning for global shadowing
    
    // General ESLint rules
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-undef': 'error',
  },
  overrides: [
    {
      // Test files configuration
      files: ['**/__tests__/**/*', '**/*.test.*', '**/*.spec.*', '**/setupTests.js'],
      env: {
        jest: true,
        node: true,
      },
      globals: {
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
        global: 'readonly',
      },
      rules: {
        'sonarjs/no-duplicate-string': ['error', { threshold: 6 }], // More lenient for tests
        'no-console': 'off', // Allow console in tests
      },
    },
    {
      // E2E test files configuration
      files: ['e2e/**/*'],
      env: {
        node: true,
      },
      globals: {
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 2024, // Support latest ECMAScript for import assertions
        sourceType: 'module',
      },
      rules: {
        'sonarjs/no-duplicate-string': ['error', { threshold: 8 }], // Very lenient for E2E tests
        'no-console': 'off', // Allow console in E2E tests
      },
    },
  ],
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/',
    'playwright-report/',
    'test-results/',
    'e2e/', // Exclude E2E tests due to import assertions syntax
    '*.config.js',
    '*.config.cjs',
  ],
}; 