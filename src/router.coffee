router = require './helpers/router'
config = require './config'
requireTree = require 'require-tree'
controllers = requireTree './controllers'
FileImporter = require 'jtfileimporter'
JTMerger = require 'jtmerger'
if config.env != 'development'
  crc32Config = require './crc32.json'
  merger = new JTMerger require './merge.json'
  components = require './components.json'

session = require './helpers/session'

addImporter = (req, res, next) ->
  fileImporter = new FileImporter merger
  fileImporter.debug true if res.locals.DEBUG
  template = res.locals.TEMPLATE
  if template && components
    currentTemplateComponents = components[template]
    fileImporter.importJs currentTemplateComponents?.js
    fileImporter.importCss currentTemplateComponents?.css

  fileImporter.version crc32Config if crc32Config
  fileImporter.prefix config.staticUrlPrefix
  res.locals.fileImporter = fileImporter
  next()

routeInfos = [
  {
    route : '/seajs/files'
    type : 'post'
    handler : controllers.seajs
  }
  {
    route : '/'
    handler : controllers.home
    middleware : [addImporter]
    template : 'home'
  }
  {
    route : '/category'
    handler : controllers.category
    middleware : [addImporter]
    template : 'category'
  }
  {
    route : '/item/:id'
    handler : controllers.item.detail
    middleware : [addImporter]
    template : 'item'
  }
  {
    route : '/item/more/:category/:id/:limit'
    handler : controllers.item.more
  }
  {
    route : '/item/list/:category/:start/:end'
    handler : controllers.item.list
  }
  {
    route : '/search/:keyword'
    handler : controllers.search
  }
  {
    route : '/my'
    middleware : [addImporter]
    template : 'my'
    handler : controllers.my
  }
  {
    route : '/user/session/:id'
    middleware : [session]
    handler : controllers.user
  }
  {
    route : '/user/:id/like'
    type : ['post', 'get']
    handler : controllers.like
  }
]






module.exports.init = (app) ->
  router.init app, routeInfos