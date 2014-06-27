(function() {
  var Item, User, async, config, getLikeItems, likeItem, mongodb, web;

  mongodb = require('../helpers/mongodb');

  User = mongodb.model('User');

  Item = mongodb.model('Item');

  async = require('async');

  web = require('../helpers/web');

  config = require('../config');

  module.exports = function(req, res, cbf) {
    var id, itemId, _ref;
    id = req.param('id');
    if (req.method === 'GET') {
      if (!id) {
        cbf(new Error('获取收藏宝贝失败！'));
        return;
      }
      return getLikeItems(id, cbf);
    } else {
      itemId = (_ref = req.body) != null ? _ref.itemId : void 0;
      if (!itemId || !id) {
        cbf(new Error('收藏宝贝失败！'));
        return;
      }
      return likeItem(id, itemId, cbf);
    }
  };

  getLikeItems = function(id, cbf) {
    return async.waterfall([
      function(cbf) {
        return User.findOne({
          id: id
        }, 'likes', cbf);
      }, function(doc, cbf) {
        var conditions;
        if (doc != null ? doc.likes : void 0) {
          conditions = {
            '_id': {
              '$in': doc.likes
            }
          };
          return Item.find(conditions, cbf);
        } else {
          return cbf(null, []);
        }
      }, function(docs, cbf) {
        return cbf(null, docs, {
          'Cache-Control': 'no-cache'
        });
      }
    ], cbf);
  };


  /**
   * [likeItem description]
   * @param  {[type]} id     [description]
   * @param  {[type]} itemId [description]
   * @param  {[type]} cbf    [description]
   * @return {[type]}        [description]
   */

  likeItem = function(id, itemId, cbf) {
    Item.findByIdAndUpdate(itemId, {
      '$inc': {
        'likeTotal': 1
      }
    }, function() {});
    return async.waterfall([
      function(cbf) {
        var conditions, options, update;
        conditions = {
          id: id
        };
        options = {
          upsert: true
        };
        update = {
          '$addToSet': {
            likes: itemId
          }
        };
        return User.findOneAndUpdate(conditions, update, options, cbf);
      }, function(doc, cbf) {
        return cbf(null, doc.likes);
      }
    ], cbf);
  };

}).call(this);
