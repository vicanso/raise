mongodb = require '../helpers/mongodb'
User = mongodb.model 'User'
Item = mongodb.model 'Item'
async = require 'async'
web = require '../helpers/web'
config = require '../config'
module.exports = (req, res, cbf) ->
  id = req.param 'id'
  if req.method == 'GET'
    if !id
      cbf new Error '获取收藏宝贝失败！'
      return
    getLikeItems id, cbf
  else
    itemId = req.body?.itemId
    if !itemId || !id
      cbf new Error '收藏宝贝失败！'
      return
    likeItem id, itemId, cbf

getLikeItems = (id, cbf) ->
  async.waterfall [
    (cbf) ->
      User.findOne {id : id}, 'likes', cbf
    (doc, cbf) ->
      if doc?.likes
        conditions =
          '_id' : 
            '$in' : doc.likes
        Item.find conditions, cbf
      else
        cbf null, []
    (docs, cbf) ->
      cbf null, docs, {
        'Cache-Control' : 'no-cache'
      }
  ], cbf

###*
 * [likeItem description]
 * @param  {[type]} id     [description]
 * @param  {[type]} itemId [description]
 * @param  {[type]} cbf    [description]
 * @return {[type]}        [description]
###
likeItem = (id, itemId, cbf) ->
  Item.findByIdAndUpdate itemId, {
    '$inc' : 
      'likeTotal' : 1
  }, ->
  async.waterfall [
    (cbf) ->
      conditions = 
        id : id
      options = 
        upsert : true
      update = 
        '$addToSet' : 
          likes : itemId
      User.findOneAndUpdate conditions, update, options, cbf
    (doc, cbf) ->
      cbf null, doc.likes
  ], cbf