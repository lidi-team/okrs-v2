module.exports = {
  testRegex: '(/__tests__/*|(\\.|/)spec)\\.(jsx?|tsx?)$',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  /**
   * Import all the conditions to run test with the @nuxt/components
   */
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/components/**/*.vue', '<rootDir>/pages/**/*.vue'],
};
