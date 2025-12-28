export default {
  testEnvironment: 'jsdom',
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/frontend/$1',
    '^@editor/(.*)$': '<rootDir>/frontend/editor/$1',
    '^@renderer/(.*)$': '<rootDir>/frontend/renderer/$1',
    '^@components/(.*)$': '<rootDir>/frontend/components/$1',
    '^@backend/(.*)$': '<rootDir>/backend/$1',
    '^@api/(.*)$': '<rootDir>/backend/api/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'frontend/**/*.{ts,tsx}',
    'backend/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

