path = require 'path'
fs = require 'fs'
config = require './config'
logger = require('./helpers/logger') __filename

initAppSetting = (app) ->
  app.set 'view engine', 'jade'
  app.set 'trust proxy', true
  app.set 'views', "#{__dirname}/views"

  app.locals.CONFIG =
    env : config.env
    staticUrlPrefix : config.staticUrlPrefix
  jtBridgeFile = path.join __dirname, './statics/javascripts/jt_bridge.js'
  app.locals.jtBridge = fs.readFileSync jtBridgeFile, 'utf8'
  if config.env == 'development'
    fs.watchFile jtBridgeFile, ->
      app.locals.jtBridge = fs.readFileSync jtBridgeFile, 'utf8'
      return
    jtBridgeDevFile = path.join __dirname, './statics/javascripts/jt_bridge_dev.js'
    app.locals.jtBridgeDev = fs.readFileSync jtBridgeDevFile, 'utf8'
    fs.watchFile jtBridgeDevFile, ->
      app.locals.jtBridgeDev = fs.readFileSync jtBridgeDevFile, 'utf8'
      return
  return

initMongod = ->
  uri = config.mongodbUri
  if uri
    mongodb = require './helpers/mongodb'
    mongodb.init uri
    mongodb.initModels path.join __dirname, './models'

requestStatistics = ->
  requestTotal = 0
  (req, res, next) ->
    startAt = process.hrtime()
    requestTotal++
    stat = ->
      diff = process.hrtime startAt
      ms = diff[0] * 1e3 + diff[1] * 1e-6
      requestTotal--
      data = 
        responeseTime : ms.toFixed(3)
        statusCode : res.statusCode
        url : req.url
        requestTotal : requestTotal
        contentLength : GLOBAL.parseInt res._headers['content-length']
      logger.info data

    res.on 'finish', stat
    res.on 'close', stat
    next()


initServer = ->
  initMongod()
  express = require 'express'
  app = express()
  initAppSetting app
  app.use '/healthchecks', (req, res) ->
    res.send 'success'


  app.use '/root.txt', (req, res) ->
    res.send '94e9e8a9aa0a51e62915ac1434a3ceb7'


  app.use requestStatistics() if config.env == 'production'

  app.use require('connect-timeout') 5000



  app.use require('morgan')() if config.env == 'production'

  expressStatic = 'static'
  serveStatic = express[expressStatic]
  ###*
   * [staticHandler 静态文件处理]
   * @param  {[type]} mount      [description]
   * @param  {[type]} staticPath [description]
   * @return {[type]}            [description]
  ###
  staticHandler = (mount, staticPath) ->
    hanlder = serveStatic staticPath
    
    hour = 3600
    hour = 0 if config.env == 'development'

    staticMaxAge = 30 * 24 * hour

    if config.env == 'development'
      jtDev = require 'jtdev'
      app.use mount, jtDev.ext.converter staticPath
      app.use mount, jtDev.stylus.parser staticPath
      app.use mount, jtDev.coffee.parser staticPath

    app.use mount, (req, res, next) ->
      res.header 'Cache-Control', "public, max-age=#{staticMaxAge}, s-maxage=#{hour}"
      hanlder req, res, (err) ->
        return next err if err
        res.send 404
  


  staticHandler '/static/raise', config.imagePath
  staticHandler '/static', path.join "#{__dirname}/statics"

  app.use require('morgan') 'dev' if config.env == 'development'



  app.use require('method-override')()
  app.use require('body-parser')()
  app.use (req, res, next) ->
    res.locals.DEBUG = true if req.param('__debug')?
    next()

  require('./router_params') app
  require('./router').init app

  app.listen config.port

  console.log "server listen on: #{config.port}"

if config.env == 'development'
  initServer()
else
  JTCluster = require 'jtcluster'
  options = 
    slaveTotal : 1
    slaveHandler : initServer
  jtCluster = new JTCluster options
  jtCluster.on 'log', (msg) ->
    console.dir msg


