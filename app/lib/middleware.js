const
    log = require('./logger')(),
    config = require('../../config/config.js'),
    users = require('../models/user.server.models');

/**
 * authenticate based on token
 */
const isAuthenticated = function(req, res, next){
  let token = req.get(config.get('authToken'));
  log.debug(`authenticating ${token}`);
  users.getIdFromToken(token, (err, id) => {
    if (err || id === null) {
      log.warn(`rejected auth attempt for token ${token}`);
      return res.sendStatus(401);
    }
    next();
  });
};

module.exports = {
    isAuthenticated: isAuthenticated
};
