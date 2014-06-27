mongodb = require '../helpers/mongodb'
Item = mongodb.model 'Item'
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
      Item.find {}, cbf
    (docs, cbf) ->
      cbf null, {
        viewData :
          navList : web.getNavList 0
          items : docs
          globalVariable : 
            itemTotal : docs.length
      }, headerOptions
  ], cbf
