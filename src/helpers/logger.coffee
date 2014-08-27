config = require '../config'
path = require 'path'
moment = require 'moment'
colors = require 'colors' if config.env == 'development'

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

    if config.env == 'development'
      str = "[#{type}]".green
      str += " #{moment().format('HH:mm:ss')}".grey
      str += " #{JSON.stringify(msg)}"
      str += " [#{@tag}]".cyan if @tag
    else
      data =
        type : type
        msg : msg
        createdAt : new Date().toString().green
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