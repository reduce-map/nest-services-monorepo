// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../jest.config.base');
module.exports = {
  ...baseConfig,
  displayName: 'auth-service',
  rootDir: '../../',
  roots: [...baseConfig.roots, '<rootDir>/apps/auth-service/tests'],
};
