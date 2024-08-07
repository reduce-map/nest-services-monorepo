module.exports = {
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^@app/common(|/.*)$': '<rootDir>/libs/common/src/$1',
    '^@app/services-contracts(|/.*)$': '<rootDir>/libs/services-contracts/src/$1',
    '^@app/errors-contract(|/.*)$': '<rootDir>/libs/errors-contract/src/$1',
  },
  rootDir: '.',
  roots: ['<rootDir>/libs/'],
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
