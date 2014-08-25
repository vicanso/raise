(function() {
  seajs.use(['jquery', 'underscore', 'Backbone', 'jtTouchEvent', 'jtLazyLoad', 'utils'], function($, _, Backbone, JTTouchEvent, JTLazyLoad, utils) {
    var CategoryListView, SearchView, initSearchEvent;
    CategoryListView = Backbone.View.extend({
      events: {
        'click .categoryList .category': 'showCategory',
        'click .itemListView .loadMore': 'loadMore'
      },
      initialize: function(options) {
        this.currentIndex = 0;
        this.itemsList = options.itemsList;
        this.template = _.template($('.itemTemplate', this.$el).html());
        return this.lazyLoadImage(0);
      },
      loadMore: function(e) {
        var currentIndex, infos, item, obj;
        obj = $(e.currentTarget);
        if (!obj.hasClass('loading')) {
          obj.children().toggleClass('hidden');
        }
        currentIndex = this.currentIndex;
        infos = this.itemsList[currentIndex];
        item = _.last(infos.items);
        return $.ajax({
          url: "/item/more/" + infos.category + "/" + item._id + "/10",
          dataType: 'json'
        }).success((function(_this) {
          return function(res) {
            var arr, itemListView;
            if (res != null ? res.length : void 0) {
              arr = _.map(res, function(item) {
                return _this.template(item);
              });
              itemListView = _this.getListView(currentIndex);
              itemListView.find('.itemList').append(arr.join(''));
              JTLazyLoad.load(itemListView.find('.item'), itemListView);
              infos.items = infos.items.concat(res);
              if (infos.total > infos.items.length) {
                return obj.children().toggleClass('hidden');
              } else {
                return obj.remove();
              }
            } else {
              return utils.prompt('已经没有该分类的宝贝了哦！');
            }
          };
        })(this)).error(function(res) {
          return utils.alert('加载数据失败，请稍候再试!');
        });
      },
      getItemListHtml: function(index) {
        var arr;
        arr = _.map(this.itemsList[index].items, (function(_this) {
          return function(item) {
            return _this.template(item);
          };
        })(this));
        if (!arr.length) {
          arr.push('<li>该分类暂无相关宝贝哦！');
        }
        return '<div class="itemListView" data-index="' + index + '"><ul class="itemList">' + arr.join('') + '</ul></div>';
      },
      getListView: function(index) {
        return $('.itemListView', this.$el).filter(function() {
          return index === window.parseInt($(this).data('index'));
        });
      },
      showCategory: function(e) {
        var currentListView, index, nextListView, obj;
        obj = $(e.currentTarget);
        if (!obj.hasClass('active')) {
          index = obj.index();
          obj.siblings('.active').addBack().toggleClass('active');
          currentListView = this.getListView(this.currentIndex);
          nextListView = this.getListView(index);
          if (!nextListView.length) {
            nextListView = $(this.getItemListHtml(index));
            nextListView.appendTo(this.$el);
            this.lazyLoadImage(index);
          }
          currentListView.addClass('hidden');
          nextListView.removeClass('hidden');
          this.currentIndex = index;
        }
      },
      lazyLoadImage: function(index) {
        var itemListView;
        itemListView = this.getListView(index);
        JTLazyLoad.load(itemListView.find('.item'), itemListView);
        return itemListView.trigger('scroll');
      }
    });
    new CategoryListView({
      el: '#contentContainer .categorySelectContainer',
      itemsList: JT_GLOBAL.itemsList
    });
    SearchView = Backbone.View.extend({
      events: {
        'focus .search': 'focus',
        'blur .search': 'blur',
        'keyup .search': 'keyup'
      },
      initialize: function() {},
      focus: function() {
        var obj, searchField;
        obj = this.$el.find('.search');
        searchField = obj.closest('.searchField');
        searchField.css('margin-right', 40);
        return searchField.siblings('.clear').removeClass('hidden');
      },
      blur: function() {
        var obj, searchField;
        obj = this.$el.find('.search');
        obj.val('');
        searchField = obj.closest('.searchField');
        searchField.siblings('.clear').addClass('hidden');
        searchField.css('margin-right', 0);
      },
      keyup: function(e) {
        var keyword, obj;
        if (e.keyCode === 0x0d) {
          obj = this.$el.find('.search');
          keyword = $.trim(obj.val());
          if (keyword) {
            this.search(keyword);
          }
          return obj.blur();
        }
      },
      search: function(keyword) {
        if (this.searchXhr) {
          this.searchXhr.abort();
        }
        this.searchXhr = $.ajax({
          url: "/search/" + keyword,
          dataType: 'json'
        }).success(function(res) {
          if (res != null ? res.total : void 0) {
            console.dir(res);
          } else {
            utils.alert('未找到满足条件的宝贝哦！');
          }
          this.searchXhr = null;
        }).error(function() {
          this.searchXhr = null;
        });
      }
    });
    new SearchView({
      el: '#contentContainer .searchContainer'
    });
    initSearchEvent = function() {
      var addResult, focus, search, searchObj, searchXhr;
      searchObj = $('#contentContainer .searchContainer .search');
      focus = function() {
        var obj, searchField;
        obj = $(this);
        searchField = obj.closest('.searchField');
        searchField.css('margin-right', 40);
        searchField.siblings('.clear').removeClass('hidden');
      };
      addResult = function(keyword, data) {
        var obj;
        obj = $('<li class="category"><a href="javascript:;">' + keyword + '</a></li>');
        $('#contentContainer .categorySelectContainer .categoryList').append(obj);
        JT_GLOBAL.itemsList.push(data);
        return obj.trigger('click');
      };
      searchXhr = null;
      search = function(keyword) {
        if (searchXhr) {
          searchXhr.abort();
        }
        searchXhr = $.ajax({
          url: "/search/" + keyword,
          dataType: 'json'
        }).success(function(res) {
          if (res != null ? res.total : void 0) {
            addResult(keyword, res);
          } else {
            utils.alert('未找到满足条件的宝贝哦！');
          }
          searchXhr = null;
        }).error(function() {
          searchXhr = null;
        });
      };
      searchObj.focus(focus).blur(function() {
        var obj, searchField;
        obj = $(this);
        obj.val('');
        searchField = obj.closest('.searchField');
        searchField.siblings('.clear').addClass('hidden');
        searchField.css('margin-right', 0);
      });
      return searchObj.on('keyup', function(e) {
        var keyword;
        if (e.keyCode === 0x0d) {
          keyword = $.trim($(this).val());
          if (keyword) {
            search(keyword);
          }
          return searchObj.blur();
        }
      });
    };
    if (CONFIG.env === 'development') {
      return seajs.emit('loadComplete');
    }
  });

}).call(this);
