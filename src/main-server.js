const logger = require('./utils/logger');
const PORT = process.env.PORT || 8080;
const PROD = process.env.NODE_ENV === 'production';

logger.logSuccess('Environment', process.env.NODE_ENV);

if(PROD) {
  const startExpressServer = require('./express/server');
  startExpressServer(PORT);
} else {
  const startWebpackServer = require('./webpack/server');
  startWebpackServer(PORT - 1);
}
