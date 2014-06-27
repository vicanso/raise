(function() {
  var parseNumber, _;

  _ = require('underscore');

  module.exports = function(app) {
    return _.each(['start', 'end', 'limit'], function(key) {
      return parseNumber(app, key);
    });
  };

  parseNumber = function(app, key) {
    return app.param(key, function(req, res, next, value) {
      value = GLOBAL.parseInt(value);
      if (_.isNaN(value)) {
        value = 0;
      }
      req.params[key] = value;
      return next();
    });
  };

}).call(this);
