_ = require 'underscore'
module.exports = (app) ->
  _.each ['start', 'end', 'limit'], (key) ->
    parseNumber app, key


parseNumber = (app, key) ->
  app.param key, (req, res, next, value) ->
    value = GLOBAL.parseInt value
    value = 0 if _.isNaN value
    req.params[key] = value
    next()