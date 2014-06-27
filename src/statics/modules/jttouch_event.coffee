define 'jtTouchEvent', ['jquery', 'underscore'], (require, exports, module) ->
  $ = require 'jquery'
  _ = require 'underscore'
  class JTTouchEvent
    ###*
     * [constructor description]
     * @param  {jQuery} jqObj    [绑定事件的jQuery对象]
     * @param  {String} selector [使用on事件的selector]
     * @param  {Object} cbfList  [回调函数列表]
     * @return {[type]}          [description]
    ###
    constructor : (jqObj, selector, cbfList) ->
      # 回调函数列表start, move, end
      if _.isObject selector
        cbfList = selector
        selector = null
      @_eventList = []
      @_jqObj = jqObj
      @_cbfList = cbfList || {}
      # touchmove的处理
      moveOffset = {
        x : 0
        y : 0
      }
      @_touchMove = (e) =>
        move = @_cbfList.move
        moveOffset = @_getOffset e
        move.call jqObj, e, moveOffset if move
        return
      # touchend的处理
      @_touchEnd = (e) =>
        # 每次touchend之后，将touchmove和touchend清除
        jqObj.off 'touchmove', @_touchMove
        $(document).off 'touchend', @_touchEnd
        end = @_cbfList.end
        end.call jqObj, e, moveOffset if end

        if Math.abs(moveOffset.x) < 20 && Math.abs(moveOffset.y) < 20
          e.type = 'vclick'
          jqObj.trigger e 
        return
      # 绑定touchstart事件
      @_touchStart = (e) =>
        if selector
          jqObj.on 'touchmove', selector, @_touchMove
        else
          jqObj.on 'touchmove', @_touchMove
        $(document).on 'touchend', @_touchEnd
        start = @_cbfList.start
        touch = e.originalEvent.touches[0]
        @_startPos =
          x : touch.pageX
          y : touch.pageY
        start.call jqObj, e if start
      if selector
        jqObj.on 'touchstart', selector, @_touchStart
      else
        jqObj.on 'touchstart', @_touchStart
    ###*
     * [on on事件处理]
     * @param  {[type]}   event [description]
     * @param  {Function} cb    [description]
     * @return {[type]}         [description]
    ###
    on : (event, cb) ->
      @_jqObj.on event, cb
      @_eventList.push [event, cb]
      @
    ###*
     * [setEventCallback 设置事件回调函数]
     * @param {String} type 可选值为start, move, end
     * @param {Function} func 回调函数
    ###
    setEventCallback : (type, func) ->
      @_jqObj.on type, func
      @
    ###*
     * [destroy 销毁对象]
     * @return {[type]} [description]
    ###
    destroy : ->
      jqObj = @_jqObj
      _.each @_eventList, (infos) ->
        jqObj.off infos[0], infos[1]
      jqObj.off 'touchstart', @_touchStart
      @
    ###*
     * [_getOffset 获取偏移的offset(用于touchmove中)]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
    ###
    _getOffset : (e) ->
      startPos = @_startPos
      touch = e.originalEvent.touches[0]
      offset =
        x : touch.pageX - startPos.x
        y : touch.pageY - startPos.y
      offset


  module.exports = JTTouchEvent

  return