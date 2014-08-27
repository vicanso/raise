module.exports = (req, res, cbf) ->
  now = Date.now()
  doing = true
  while doing
    doing = false if Date.now() - now > 500
  cbf null, {}