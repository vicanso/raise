seajs.use ['jquery', 'underscore', 'jtTouchEvent', 'utils'], ($, _, JTTouchEvent, utils) ->

  if CONFIG.env == 'development'
    seajs.emit 'loadComplete'