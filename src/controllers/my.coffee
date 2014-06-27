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

  # Item.find {}, null, {limit : 4}, (err, docs) ->
  #   cbf null, {
  #     viewData :
  #       navList : web.getNavList 2
  #       itemsList : [
  #         docs.slice 0, 2
  #         docs.slice 2, 4
  #       ]
  #   }
  # return
  cbf null, {
    viewData :
      navList : web.getNavList 2
      itemTemplate : 
        _id : '{{_id}}'
        desc : '{{desc}}'
        likeTotal : '{{likeTotal}}'
        price : '{{price}}'
        height : '{{height}}'
  }, headerOptions