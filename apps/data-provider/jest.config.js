// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../jest.config.base');
module.exports = {
  ...baseConfig,
  displayName: 'data-provider',
  rootDir: '../../',
  roots: [...baseConfig.roots, '<rootDir>/apps/data-provider/tests'],
};
