module.exports = {
  env: {
    es6: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    'jest',
    '@typescript-eslint'
  ],
  rules: {
    'no-undef': 'off',
    '@typescript-eslint/member-delimiter-style': [2, {
      'multiline': {
        delimiter: 'none',
      }
    }],
    '@typescript-eslint/no-explicit-any': [0],
    'comma-dangle': [2, {
      'objects': 'always-multiline',
      'arrays': 'always-multiline',
      'functions': 'never',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
    }],
    '@typescript-eslint/no-unused-vars': [2, {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
    }],
    'space-before-function-paren': [2, {
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'always',
    }],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
  'overrides': [
    {
      'files': '**/*.test.ts',
      'rules': {
        'import/first': 'off',
      }
    }

  ]
}
