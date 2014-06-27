mongodb = require '../helpers/mongodb'
User = mongodb.model 'User'
Item = mongodb.model 'Item'
async = require 'async'
_ = require 'underscore'
module.exports = (req, res, cbf) ->
  id = req.param 'id'
  user = req.session?.user
  if user
    req.session = null
    cbf null, user
  else
    async.waterfall [
      (cbf) ->
        User.findOne {id : id}, cbf
      (doc, cbf) ->
        cbf null, _.pick doc, ['likes']
    ], cbf
