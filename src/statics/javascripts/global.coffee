seajs.use ['jquery', 'underscore', 'jtTouchEvent', 'utils'], ($, _, JTTouchEvent, utils) ->
  noop = ->
  document.addEventListener 'touchstart', noop, false

  
  timeline = window.TIME_LINE
  if timeline
    console.dir timeline.getLogs()
  JT_BRIDGE.on 'memoryUsage', (usage) ->
    $('#DEBUG_CONTAINER .memory').text "#{usage}MB"
  JT_BRIDGE.on 'changeView', (status) ->
    if status == 'loading'
      utils.loading true
    else
      utils.loading false