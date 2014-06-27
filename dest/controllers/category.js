(function() {
  var Item, async, config, mongodb, web, _;

  mongodb = require('../helpers/mongodb');

  web = require('../helpers/web');

  Item = mongodb.model('Item');

  async = require('async');

  _ = require('underscore');

  config = require('../config');

  module.exports = function(req, res, cbf) {
    var categoryList, funcs, headerOptions, maxAge;
    maxAge = 600;
    if (config.env === 'development') {
      maxAge = 0;
    }
    headerOptions = {
      'Cache-Control': "public, max-age=" + maxAge
    };
    categoryList = {
      'recommend': '推荐',
      'skirt': '裙子',
      'top': '上衣',
      'shoes': '鞋子',
      'bag': '包包'
    };
    funcs = _.map(categoryList, function(name, category) {
      return function(cbf) {
        var conditions;
        conditions = {};
        if (category !== 'recommend') {
          conditions.type = name;
        }
        return async.parallel({
          total: function(cbf) {
            return Item.count(conditions, cbf);
          },
          items: function(cbf) {
            var options;
            options = {
              limit: 10,
              sort: {
                _id: -1
              }
            };
            return Item.find(conditions, null, options, cbf);
          },
          category: function(cbf) {
            return cbf(null, name);
          }
        }, cbf);
      };
    });
    return async.parallel(funcs, function(err, docs) {
      if (err) {
        cbf(err);
        return;
      }
      return cbf(null, {
        viewData: {
          navList: web.getNavList(1),
          categoryList: categoryList,
          top: docs[0],
          globalVariable: {
            itemsList: docs
          }
        }
      }, headerOptions);
    });
  };

}).call(this);
