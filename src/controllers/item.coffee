mongodb = require '../helpers/mongodb'
Item = mongodb.model 'Item'
async = require 'async'
_ = require 'underscore'
web = require '../helpers/web'
config = require '../config'
module.exports.detail = (req, res, cbf) ->
  id = req.param 'id'
  maxAge = 1800
  maxAge = 0 if config.env == 'development'
  headerOptions = 
    'Cache-Control' : "public, max-age=#{maxAge}"
  async.parallel {
    item : (cbf) ->
      Item.findById id, cbf
    recommmends : (cbf) ->
      Item.find {}, null, {limit : 9}, cbf
  }, (err, result) ->
    if err
      cbf err
      return
    viewData = _.extend {
      navList : web.getNavList -1
    }, result
    cbf null, {
      viewData : viewData
    }, headerOptions


module.exports.list = (req, res, cbf) ->
  category = req.param 'category'
  start = req.param 'start'
  end = req.param 'end'
  maxAge = 1800
  maxAge = 0 if config.env == 'development'
  headerOptions = 
    'Cache-Control' : "public, max-age=#{maxAge}"
  async.waterfall [
    (cbf) ->
      conditions = 
        type : category
      delete conditions.type if category == '推荐'
      options =
        limit : end - start
        skip : start
        sort : 
          _id : -1
      Item.find conditions, null, options, cbf
    (docs, cbf) ->
      cbf null, docs, headerOptions
  ], cbf

module.exports.more = (req, res, cbf) ->
  category = req.param 'category'
  id = req.param 'id'
  limit = req.param 'limit'
  maxAge = 1800
  maxAge = 0 if config.env == 'development'
  headerOptions = 
    'Cache-Control' : "public, max-age=#{maxAge}"
  async.waterfall [
    (cbf) ->
      conditions = 
        type : category
        _id : 
          '$lt' : id
      delete conditions.type if category == '推荐'
      options =
        limit : limit
        sort : 
          _id : -1
      Item.find conditions, null, options, cbf
    (docs, cbf) ->
      cbf null, docs, headerOptions
  ], cbf

# module.exports.