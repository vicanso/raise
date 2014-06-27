seajs.use ['jquery', 'underscore', 'Backbone', 'jtTouchEvent', 'jtLazyLoad', 'utils'], ($, _, Backbone, JTTouchEvent, JTLazyLoad, utils) ->
  
  CategoryListView = Backbone.View.extend {
    events : 
      'click .categoryList .category' : 'showCategory'
      'click .itemListView .loadMore': 'loadMore'
    initialize : (options) ->
      @currentIndex = 0
      @itemsList = options.itemsList
      @template = _.template $('.itemTemplate', @$el).html()
      @lazyLoadImage 0
    loadMore : (e) ->
      obj = $ e.currentTarget
      obj.children().toggleClass 'hidden' if !obj.hasClass 'loading'
      currentIndex = @currentIndex
      infos = @itemsList[currentIndex]
      item = _.last infos.items
      $.ajax({
        url : "/item/more/#{infos.category}/#{item._id}/10"
        dataType : 'json'
      }).success((res) =>
        if res?.length
          arr = _.map res, (item) =>
            @template item
          itemListView = @getListView currentIndex
          itemListView.find('.itemList').append arr.join ''
          JTLazyLoad.load itemListView.find('.item'), itemListView
          infos.items = infos.items.concat res
          if infos.total > infos.items.length
            obj.children().toggleClass 'hidden'
          else
            obj.remove()
        else
          utils.prompt '已经没有该分类的宝贝了哦！'
      ).error (res) ->
        utils.alert '加载数据失败，请稍候再试!'
      
    getItemListHtml : (index) ->
      arr = _.map @itemsList[index].items, (item) =>
        @template item
      arr.push '<li>该分类暂无相关宝贝哦！' if !arr.length
      '<div class="itemListView" data-index="' + index + '"><ul class="itemList">' + arr.join('') + '</ul></div>'
    getListView : (index) ->
      $('.itemListView', @$el).filter ->
        index == window.parseInt $(@).data 'index'
    showCategory : (e) ->
      obj = $ e.currentTarget
      if !obj.hasClass 'active'
        index = obj.index()
        obj.siblings('.active').addBack().toggleClass 'active'
        currentListView = @getListView @currentIndex
        nextListView = @getListView index
        if !nextListView.length
          nextListView = $ @getItemListHtml index
          nextListView.appendTo @$el
          @lazyLoadImage index
        currentListView.addClass 'hidden'
        nextListView.removeClass 'hidden'
        @currentIndex = index
      return
    lazyLoadImage : (index) ->
      itemListView = @getListView index
      JTLazyLoad.load itemListView.find('.item'), itemListView

  }


  new CategoryListView {
    el : '#contentContainer .categorySelectContainer'
    itemsList : JT_GLOBAL.itemsList
  }


  SearchView = Backbone.View.extend {
    events : 
      'focus .search' : 'focus'
      'blur .search' : 'blur'
      'keyup .search' : 'keyup'
    initialize : ->
    focus : ->
      obj = @$el.find '.search'
      searchField = obj.closest '.searchField'
      searchField.css 'margin-right', 40
      searchField.siblings('.clear').removeClass 'hidden'
    blur : ->
      obj = @$el.find '.search'
      obj.val ''
      searchField = obj.closest '.searchField'
      searchField.siblings('.clear').addClass 'hidden'
      searchField.css 'margin-right', 0
      return
    keyup : (e) ->
      if e.keyCode == 0x0d
        obj = @$el.find '.search'
        keyword = $.trim obj.val()
        @search keyword if keyword
        obj.blur()
    search : (keyword) ->
      @searchXhr.abort() if @searchXhr
      @searchXhr = $.ajax({
        url : "/search/#{keyword}"
        dataType : 'json'  
      }).success((res)->
        if res?.total
          console.dir res
          # addResult keyword, res
        else
          utils.alert '未找到满足条件的宝贝哦！'
        @searchXhr = null
        return
      ).error ->
        @searchXhr = null
        return
      return
  }

  new SearchView {
    el : '#contentContainer .searchContainer'
  }

  initSearchEvent = ->
    searchObj = $ '#contentContainer .searchContainer .search'
    focus = ->
      obj = $ @
      searchField = obj.closest '.searchField'
      searchField.css 'margin-right', 40
      searchField.siblings('.clear').removeClass 'hidden'
      return
    addResult = (keyword, data) ->
      obj = $ '<li class="category"><a href="javascript:;">' + keyword + '</a></li>'
      $('#contentContainer .categorySelectContainer .categoryList').append obj
      JT_GLOBAL.itemsList.push data
      obj.trigger 'click'

    searchXhr = null
    search = (keyword) ->
      searchXhr.abort() if searchXhr
      searchXhr = $.ajax({
        url : "/search/#{keyword}"
        dataType : 'json'  
      }).success((res)->
        if res?.total
          addResult keyword, res
        else
          utils.alert '未找到满足条件的宝贝哦！'
        searchXhr = null
        return
      ).error ->
        searchXhr = null
        return
      return
    searchObj.focus(focus).blur ->
      obj = $ @
      obj.val ''
      searchField = obj.closest '.searchField'
      searchField.siblings('.clear').addClass 'hidden'
      searchField.css 'margin-right', 0
      return

    searchObj.on 'keyup', (e) ->
      if e.keyCode == 0x0d
        keyword = $.trim $(@).val()
        search keyword if keyword
        searchObj.blur()


  # initCategoryEvent()

  # initSearchEvent()

  

  if CONFIG.env == 'development'
    seajs.emit 'loadComplete'