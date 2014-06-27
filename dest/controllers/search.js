(function() {
  var Item, async, config, mongodb, web, _;

  mongodb = require('../helpers/mongodb');

  web = require('../helpers/web');

  Item = mongodb.model('Item');

  async = require('async');

  _ = require('underscore');

  config = require('../config');

  module.exports = function(req, res, cbf) {
    var conditions, headerOptions, keyword, maxAge, reg;
    maxAge = 600;
    if (config.env === 'development') {
      maxAge = 0;
    }
    headerOptions = {
      'Cache-Control': "public, max-age=" + maxAge
    };
    keyword = req.param('keyword');
    reg = new RegExp(keyword, 'gi');
    conditions = {
      title: reg,
      desc: reg
    };
    return async.parallel({
      items: function(cbf) {
        return Item.find(conditions, null, {
          limit: 10
        }, cbf);
      },
      total: function(cbf) {
        return Item.count(conditions, cbf);
      }
    }, function(err, data) {
      if (err) {
        return cbf(err);
      } else {
        return cbf(null, data, headerOptions);
      }
    });
  };

}).call(this);
