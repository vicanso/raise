mongodb = require '../helpers/mongodb'
web = require '../helpers/web'
Item = mongodb.model 'Item'
async = require 'async'
_ = require 'underscore'
config = require '../config'
module.exports = (req, res, cbf) ->
  maxAge = 600
  maxAge = 0 if config.env == 'development'
  headerOptions = 
    'Cache-Control' : "public, max-age=#{maxAge}"
  keyword = req.param 'keyword'
  reg = new RegExp keyword, 'gi'
  conditions = 
    title : reg
    desc : reg
  async.parallel {
    items : (cbf) ->
      Item.find conditions, null, {limit : 10}, cbf
    total : (cbf) ->
      Item.count conditions, cbf
  }, (err, data) ->
    if err
      cbf err
    else
      cbf null, data, headerOptions
  # async.waterfall [
  #   (cbf) ->
  #     Item.find query, cbf
  #   (docs, cbf) ->
  #     cbf null, docs, headerOptions
  # ], cbf
