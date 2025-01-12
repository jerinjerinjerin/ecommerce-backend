const path = require('path');

module.exports = {
  config: path.resolve('src/config/migraction/index.ts'),  // Path to your TypeScript config
  'models-path': path.resolve('src/model'),
  'migrations-path': path.resolve('./src/migrations'),
  'require': 'ts-node/register',
};
