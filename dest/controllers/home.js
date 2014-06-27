(function() {
  var Item, async, config, mongodb, web, _;

  mongodb = require('../helpers/mongodb');

  Item = mongodb.model('Item');

  _ = require('underscore');

  async = require('async');

  web = require('../helpers/web');

  config = require('../config');

  module.exports = function(req, res, cbf) {
    var headerOptions, maxAge;
    maxAge = 600;
    if (config.env === 'development') {
      maxAge = 0;
    }
    headerOptions = {
      'Cache-Control': "public, max-age=" + maxAge
    };
    return async.waterfall([
      function(cbf) {
        return Item.find({}, null, {
          limit: 50
        }, cbf);
      }, function(docs, cbf) {
        var max;
        docs = _.shuffle(docs);
        max = 20;
        if (docs.length > max) {
          docs.length = max;
        }
        return cbf(null, {
          viewData: {
            navList: web.getNavList(0),
            items: docs,
            globalVariable: {
              itemTotal: docs.length
            }
          }
        }, headerOptions);
      }
    ], cbf);
  };

}).call(this);
