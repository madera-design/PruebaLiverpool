module.exports = {
  clearMocks: true,
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.js'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/tests/**/*.jest.test.{js,jsx}'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
}
