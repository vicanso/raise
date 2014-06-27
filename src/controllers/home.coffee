mongodb = require '../helpers/mongodb'
Item = mongodb.model 'Item'
_ = require 'underscore'
async = require 'async'
web = require '../helpers/web'
config = require '../config'
module.exports = (req, res, cbf) ->
  maxAge = 600
  maxAge = 0 if config.env == 'development'
  headerOptions = 
    'Cache-Control' : "public, max-age=#{maxAge}"
  async.waterfall [
    (cbf) ->
      Item.find {}, null, {limit : 50}, cbf
    (docs, cbf) ->
      docs = _.shuffle docs
      max = 20
      docs.length = max if docs.length > max
      cbf null, {
        viewData :
          navList : web.getNavList 0
          items : docs
          globalVariable : 
            itemTotal : docs.length
      }, headerOptions
  ], cbf
