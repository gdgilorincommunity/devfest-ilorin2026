import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  setupFiles: ['<rootDir>/test.setup.ts'],
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$':
      '<rootDir>/test/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  bail: true,
  displayName: 'DevfestIlorin2026',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}

export default createJestConfig(customJestConfig)
