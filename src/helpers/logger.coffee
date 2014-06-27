# winston = require 'winston'
# _ = require 'underscore'
# path = require 'path'
# program = require 'commander'
# transports = []
# if program.log
#   transports.push new winston.transports.File {
#     filename : program.log
#   }
# else
#   transports.push new winston.transports.Console()
# logger =  new winston.Logger {
#   transports : transports
# }

# appPath = path.join __dirname, '..'

# ###*
#  * exports 用于返回一个looger对象，有info debug error warn方法，主要用于方便输出log时带上文件名
#  * @param  {[type]} file [description]
#  * @return {[type]}      [description]
# ###
# module.exports = (file) ->
#   file = file.replace appPath, ''
#   log = (type, args) ->
#     lastItem = _.last args
#     if _.isObject lastItem
#       lastItem.file = lastItem.file || file
#     else
#       args.push {
#         file : file
#       }
#     logger[type].apply logger, args
#   newLogger = {}
#   _.each 'info debug error warn'.split(' '), (func) ->
#     newLogger[func] = (args...) ->
#       log func, args
#     null
#   newLogger

path = require 'path'

class Logger
  constructor : (@tag) ->
  log : (msg) ->
    @_log 'log', msg
  info : (msg) ->
    @_log 'info', msg

  debug : (msg) ->
    @_log 'debug', msg

  error : (msg) ->
    @_log 'error', msg

  warn : (msg) ->
    @_log 'warn', msg

  write : (msg) ->

  _log : (type, msg) ->
    data =
      type : type
      msg : msg
      createdAt : new Date().toString()
    data.tag = @tag if @tag
    str = JSON.stringify data
    if type == 'error'
      console.error str
    else
      console.info str


appPath = path.join __dirname, '..'
module.exports = (file) ->
  file = file.replace appPath, ''
  return new Logger file