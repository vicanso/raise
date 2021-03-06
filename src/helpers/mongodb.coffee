mongoose = require 'mongoose'
Schema = mongoose.Schema
_ = require 'underscore'
requireTree = require 'require-tree'
logger = require('./logger') __filename

client = null

###*
 * [init description]
 * @param  {[type]} uri     [description]
 * @param  {[type]} options =             {} [description]
 * @return {[type]}         [description]
###
module.exports.init = (uri, options = {}) ->
  return if client
  defaults = 
    db :
      native_parser : true
    server :
      poolSize : 5
      auto_reconnect : true

  _.extend options, defaults

  client = mongoose.createConnection uri, options
  client.on 'connected', ->
    logger.info "#{uri} connected"
  client.on 'disconnected', ->
    logger.info "#{uri} disconnected"
  client.on 'error', (err) ->
    logger.error err


###*
 * [initModels 初始化models]
 * @param  {[type]} modelPath [description]
 * @return {[type]}           [description]
###
module.exports.initModels = (modelPath) ->
  throw new Error 'the db is not init!' if !client
  models = requireTree modelPath
  _.each models, (model, name) ->
    name = name.charAt(0).toUpperCase() + name.substring 1
    schema = new Schema model.schema, model.options
    if model.indexes
      _.each model.indexes, (indexOptions) ->
        schema.index indexOptions
    client.model name, schema

###*
 * [model 获取mongoose的model]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
###
module.exports.model = (name) ->
  throw new Error 'the db is not init!' if !client
  client.model name