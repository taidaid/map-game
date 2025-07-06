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
    'no-unused-vars': 'off', // Turn off base rule for TypeScript
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-undef': 'off', // TypeScript handles this
  },
  overrides: [
    {
      // TypeScript files configuration
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:sonarjs/recommended-legacy',
      ],
      plugins: [
        'react',
        'react-hooks',
        'react-refresh',
        'sonarjs',
        '@typescript-eslint',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      rules: {
        // TypeScript-specific rules
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/require-await': 'error',
        
        // Disable base rules that are covered by TypeScript
        'no-unused-vars': 'off',
        'no-undef': 'off',
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': 'error',
        
        // React rules for TypeScript
        'react/prop-types': 'off', // TypeScript handles prop validation
      },
    },
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
        '@typescript-eslint/no-explicit-any': 'off', // Allow any in tests
        '@typescript-eslint/no-non-null-assertion': 'off', // Allow non-null assertions in tests
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