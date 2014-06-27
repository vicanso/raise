seajs.config {
  base : CONFIG.staticUrlPrefix
  alias :
    'jtLazyLoad' : 'components/jtlazy_load/dest/jtlazy_load.js'
    'jtTouchEvent' : 'modules/jttouch_event.js'
    'utils' : 'modules/utils.js'
}

define 'jquery', ->
  window.jQuery

define 'underscore', ->
  if window._
    window._.templateSettings = 
      interpolate: /\{\{(.+?)\}\}/g
  window._

define 'Backbone', ->
  window.Backbone
