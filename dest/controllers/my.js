(function() {
  var Item, async, config, mongodb, web;

  mongodb = require('../helpers/mongodb');

  Item = mongodb.model('Item');

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
    return cbf(null, {
      viewData: {
        navList: web.getNavList(2),
        itemTemplate: {
          _id: '{{_id}}',
          desc: '{{desc}}',
          likeTotal: '{{likeTotal}}',
          price: '{{price}}',
          height: '{{height}}'
        }
      }
    }, headerOptions);
  };

}).call(this);
