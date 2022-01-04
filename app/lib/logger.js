/**
 * establish a bunyan logger
 */

"use strict";

const
    bunyan = require('bunyan');

let
    logger,
    createLogger = options => {
      options = Object.assign({name: 'coffida'}, options);
      if (logger) return logger;
      logger = bunyan.createLogger(options);
      return logger;
};

module.exports = createLogger;
