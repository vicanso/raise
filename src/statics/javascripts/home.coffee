seajs.use ['jquery', 'underscore', 'jtTouchEvent', 'utils'], ($, _, JTTouchEvent, utils) ->
  ###*
   * [initContentMoveEvent 初始化单品内容事件（滑动切换）]
   * @param  {[type]} jqObj [description]
   * @param  {[type]} width [description]
   * @return {[type]}       [description]
  ###
  initContentMoveEvent = (jqObj, width) ->
    startOffset = 0
    moveOffset = 0
    halfWidth = width / 2
    stepOffset = 5
    startTime = 0
    pageIndex = 0
    itemContainerList = jqObj.find '.itemContainer'
    maxPage = JT_GLOBAL.itemTotal
    new JTTouchEvent jqObj, {
      start : (e)->
        startOffset = -pageIndex * width
        startTime = e.timeStamp
        return
      move : (e, offset) ->
        moveOffset = offset.x
        return if stepOffset > Math.abs moveOffset
        css = "translateX(#{moveOffset + startOffset}px)"
        jqObj.css 'transform', css
      end : (e)->
        absOffset = Math.abs moveOffset
        return if stepOffset > absOffset

        # 计算拖动的时间和位移确定往前还是往后翻
        currentOffset = startOffset + moveOffset
        if absOffset > halfWidth || (e.timeStamp - startTime < 200 && absOffset > 50)
          if moveOffset < 0 && pageIndex < maxPage - 1
            pageIndex++ 
          if moveOffset > 0 && pageIndex > 0
            pageIndex-- 
        
        # 加载产品图片
        itemContainer = itemContainerList.eq pageIndex + 2
        if itemContainer.hasClass 'notLoad'
          itemContainer.css 'background-image', "url(#{itemContainer.data('src')})"
          itemContainer.removeClass 'notLoad'

        moveOffset = -pageIndex * width - currentOffset
        jqObj.css '_moveOffset', currentOffset
        animateOptions =
          _moveOffset : moveOffset
        jqObj.animate animateOptions, {
          duration : 300
          step : (now, fx) ->
            $(@).css 'transform', "translateX(#{currentOffset + now}px)"
          complete : ->
        }
          
        moveOffset = 0
        return
    }


  ###*
   * [initLikeEvent 初始化收藏宝贝的事件]
   * @param  {[type]} jqObj [description]
   * @return {[type]}       [description]
  ###
  initLikeEvent = (jqObj) ->
    likeItems = {}
    jqObj.on 'click', '.header .like', ->
      itemId = $(@).data 'id'
      if likeItems[itemId]
        utils.prompt '你已收藏了该宝贝！'
        return
      likeItems[itemId] = true
      JT_BRIDGE.call 'appInfo', (err, infos) ->
        return if !infos?.id
        $.ajax({
          url : "/user/#{infos.id}/like"
          dataType : 'json'
          type : 'post'
          data : 
            itemId : itemId
        }).success((res)->
          utils.prompt '已成功收藏该宝贝！'
        ).error (res) ->
          utils.alert '收藏失败，请稍候再试！'


  contentContainer = $ '#contentContainer'
  contentContainerWidth = contentContainer.width()
  itemsListView = contentContainer.find '.itemsListView'
  initContentMoveEvent itemsListView, contentContainerWidth
  initLikeEvent itemsListView

  $(document).on 'touchmove', (e) ->
    e.preventDefault()



  if CONFIG.env == 'development'
    seajs.emit 'loadComplete'


