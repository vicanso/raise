(function() {
  var Item, async, config, mongodb, web, _;

  mongodb = require('../helpers/mongodb');

  Item = mongodb.model('Item');

  async = require('async');

  _ = require('underscore');

  web = require('../helpers/web');

  config = require('../config');

  module.exports.detail = function(req, res, cbf) {
    var headerOptions, id, maxAge;
    id = req.param('id');
    maxAge = 1800;
    if (config.env === 'development') {
      maxAge = 0;
    }
    headerOptions = {
      'Cache-Control': "public, max-age=" + maxAge
    };
    return async.parallel({
      item: function(cbf) {
        return Item.findById(id, cbf);
      },
      recommmends: function(cbf) {
        return Item.find({}, null, {
          limit: 9
        }, cbf);
      }
    }, function(err, result) {
      var viewData;
      if (err) {
        cbf(err);
        return;
      }
      viewData = _.extend({
        navList: web.getNavList(-1)
      }, result);
      return cbf(null, {
        viewData: viewData
      }, headerOptions);
    });
  };

  module.exports.list = function(req, res, cbf) {
    var category, end, headerOptions, maxAge, start;
    category = req.param('category');
    start = req.param('start');
    end = req.param('end');
    maxAge = 1800;
    if (config.env === 'development') {
      maxAge = 0;
    }
    headerOptions = {
      'Cache-Control': "public, max-age=" + maxAge
    };
    return async.waterfall([
      function(cbf) {
        var conditions, options;
        conditions = {
          type: category
        };
        if (category === '推荐') {
          delete conditions.type;
        }
        options = {
          limit: end - start,
          skip: start,
          sort: {
            _id: -1
          }
        };
        return Item.find(conditions, null, options, cbf);
      }, function(docs, cbf) {
        return cbf(null, docs, headerOptions);
      }
    ], cbf);
  };

  module.exports.more = function(req, res, cbf) {
    var category, headerOptions, id, limit, maxAge;
    category = req.param('category');
    id = req.param('id');
    limit = req.param('limit');
    maxAge = 1800;
    if (config.env === 'development') {
      maxAge = 0;
    }
    headerOptions = {
      'Cache-Control': "public, max-age=" + maxAge
    };
    return async.waterfall([
      function(cbf) {
        var conditions, options;
        conditions = {
          type: category,
          _id: {
            '$lt': id
          }
        };
        if (category === '推荐') {
          delete conditions.type;
        }
        options = {
          limit: limit,
          sort: {
            _id: -1
          }
        };
        return Item.find(conditions, null, options, cbf);
      }, function(docs, cbf) {
        return cbf(null, docs, headerOptions);
      }
    ], cbf);
  };

}).call(this);
