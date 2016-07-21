const express = require('express');
const session = require('express-session');
const logger = require('../utils/logger');
const path = require('path');
const querystring = require('querystring');
const OKTA_CONFIG = require('./okta-config');
const SERVER_CONFIG = require('./server-config');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');

const startExpressServer = (PORT) => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({ secret: SERVER_CONFIG.sessionSecret,
                    resave: true,
                    saveUninitialized: false }));
  app.use(morgan('combined'));

  app.post('/login/callback', (req, res) => {
    const token = req.body.id_token;
    const dirtyToken = jwt.decode(token, OKTA_CONFIG.OKTA_PUBLIC_KEYS);

    // need to validate token before setting user to session here
    // const verifiedToken = jwt.verify(token, OKTA_CONFIG.OKTA_PUBLIC_KEYS, {algorithms: ['RS256']});

    req.session.user = dirtyToken.email;
    res.redirect('/');
  });

  app.use((req, res, next) => {
    if(!req.session.user) {
      // if there is no user in session, redirect to okta
      const params = querystring.stringify({
        redirect_uri: OKTA_CONFIG.OKTA_REDIRECT_URI,
        client_id: OKTA_CONFIG.OKTA_CLIENT_ID,
        response_type: 'id_token',
        response_mode: 'form_post',
        scope: 'openid email groups',
        state: 'carona-board'
      });
      const encodedURI = `${OKTA_CONFIG.OKTA_BASE_URL}/oauth2/v1/authorize?${params}`;
      res.redirect(encodedURI);
    } else {
      next();
    }
  });

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../../index.html`));
  });

  app.get('/v2', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../../build/index.html`));
  });

  app.listen(PORT, () => {
    logger.logSuccess('Express server started:', `http://localhost:${PORT}/`);
  });

  app.use(express.static(path.resolve(`${__dirname}/../../build`)));

};

module.exports = startExpressServer;
