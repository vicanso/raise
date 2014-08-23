_ = require 'underscore'
async = require 'async'
logger = require('../helpers/logger') __filename
JTStats = require '../helpers/stats'
module.exports = (req, res, cbf) ->
  ua = req.header 'user-agent'
  ip = req.ip
  data = req.body
  if data
    logger.info "ip:#{ip}, html use #{data.html}ms, js use #{data.js}ms, ua:#{ua}"
    JTStats.gauge 'timeline.html', data.html
    JTStats.gauge 'timeline.js', data.js

  cbf null, {
    msg : 'success'
  }
  # console.dir ip
  # console.dir req.body