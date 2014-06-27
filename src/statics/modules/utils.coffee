define 'utils', ['jquery', 'underscore'], (require, exports, module) ->
  $ = require 'jquery'
  _ = require 'underscore'

  exports.loading = _.debounce (show) ->
    loadingContainer = $ '.loadingContainer'
    if show
      loadingContainer.removeClass 'hidden'
    else
      loadingContainer.addClass 'hidden'
  , 5


  exports.showDialog = (msg, delay, type) ->
    if type == 'warning'
      iconClass = 'iWarning'
    else
      iconClass = 'iOK'
    obj = $ '<div class="popUpDialog ' + iconClass + '">' + msg + '</div>'
    obj.appendTo 'body'
    _.delay ->
      obj.remove()
    , delay


  exports.alert = (msg, delay = 2000) ->
    @showDialog msg, delay, 'warning'

  exports.prompt = (msg, delay = 2000) ->
    @showDialog msg, delay



  return