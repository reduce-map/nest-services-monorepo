// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../jest.config.base');
module.exports = {
  ...baseConfig,
  displayName: 'user-gateway',
  rootDir: '../../',
  roots: [...baseConfig.roots, '<rootDir>/apps/user-gateway/tests'],
};
