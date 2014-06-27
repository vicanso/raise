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
  categoryList =
    'recommend' : '推荐'
    'skirt' : '裙子'
    'top' : '上衣'
    'shoes' : '鞋子'
    'bag' : '包包'
  funcs = _.map categoryList, (name, category) ->
    (cbf) ->
      conditions = {}
      conditions.type = name if category != 'recommend'
      async.parallel {
        total : (cbf) ->
          Item.count conditions, cbf
        items : (cbf) ->
          options =
            limit : 10
            sort :
              _id : -1
          Item.find conditions, null, options, cbf
        category : (cbf) ->
          cbf null, name
      }, cbf
      
  async.parallel funcs, (err, docs) ->
    if err
      cbf err
      return
    cbf null, {
      viewData : 
        navList : web.getNavList 1
        categoryList : categoryList
        top : docs[0]
        globalVariable :
          itemsList : docs
    }, headerOptions
