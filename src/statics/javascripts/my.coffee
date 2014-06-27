seajs.use ['jquery', 'underscore', 'Backbone', 'jtLazyLoad', 'utils'], ($, _, Backbone, JTLazyLoad, utils) ->

  WaterfallListView = Backbone.View.extend {
    initialize : (options) ->
      @id = options.id
      @template = _.template options.html
      @getMyLikes (err, itemsList) =>
        if err
          utils.alert err.message
        else
          @render itemsList
    getMyLikes : (cbf) ->
      $.ajax({
        url : "/user/#{@id}/like?cache=false"
        dataType : 'json'
      }).success((res)->
        if !res.length
          cbf new Error '还没有收藏任何宝贝哦！'
          return
        arr = [[], []]
        total = 2
        _.each res, (item, i) ->
          arr[i % total].push item
        cbf null, arr
      ).error (res) ->
        cbf new Error '获取收藏宝贝失败！'
    render : (itemsList) ->
      $el = @$el
      itemWidth = Math.round $el.width() / 2 - 5
      template = @template
      htmlArr = []
      _.each itemsList, (items) ->
        arr = ['<div class="waterfall">']
        _.each items, (item) ->
          size = item.size
          item.height = Math.round size[1] * itemWidth / size[0]
          arr.push template item
        arr.push '</div>'
        htmlArr.push arr.join ''
      $el.html htmlArr.join ''
      JTLazyLoad.load $el.find('.item'), $ '#contentContainer .myLikeItemsContainer'
  }



  JT_BRIDGE.on 'deviceReady', ->
    JT_BRIDGE.call 'appInfo', (err, infos) ->
      if !infos?.id
        utils.alert '获取收藏宝贝失败！'
      else
        new WaterfallListView {
          id : infos.id
          html : $('#contentContainer .myLikeItemsContainer .itemTemplate').html()
          el : '#contentContainer .myLikeItemsContainer .waterfallList'
        }
        # showMyLikes infos.id
  if CONFIG.env == 'development'
    seajs.emit 'loadComplete'