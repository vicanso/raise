(function() {
  seajs.use(['jquery', 'underscore', 'Backbone', 'jtLazyLoad', 'utils'], function($, _, Backbone, JTLazyLoad, utils) {
    var WaterfallListView;
    WaterfallListView = Backbone.View.extend({
      initialize: function(options) {
        this.id = options.id;
        this.template = _.template(options.html);
        return this.getMyLikes((function(_this) {
          return function(err, itemsList) {
            if (err) {
              return utils.alert(err.message);
            } else {
              return _this.render(itemsList);
            }
          };
        })(this));
      },
      getMyLikes: function(cbf) {
        return $.ajax({
          url: "/user/" + this.id + "/like?cache=false",
          dataType: 'json'
        }).success(function(res) {
          var arr, total;
          if (!res.length) {
            cbf(new Error('还没有收藏任何宝贝哦！'));
            return;
          }
          arr = [[], []];
          total = 2;
          _.each(res, function(item, i) {
            return arr[i % total].push(item);
          });
          return cbf(null, arr);
        }).error(function(res) {
          return cbf(new Error('获取收藏宝贝失败！'));
        });
      },
      render: function(itemsList) {
        var $el, htmlArr, itemWidth, template;
        $el = this.$el;
        itemWidth = Math.round($el.width() / 2 - 5);
        template = this.template;
        htmlArr = [];
        _.each(itemsList, function(items) {
          var arr;
          arr = ['<div class="waterfall">'];
          _.each(items, function(item) {
            var size;
            size = item.size;
            item.height = Math.round(size[1] * itemWidth / size[0]);
            return arr.push(template(item));
          });
          arr.push('</div>');
          return htmlArr.push(arr.join(''));
        });
        $el.html(htmlArr.join(''));
        return JTLazyLoad.load($el.find('.item'), $('#contentContainer .myLikeItemsContainer'));
      }
    });
    JT_BRIDGE.on('deviceReady', function() {
      return JT_BRIDGE.call('appInfo', function(err, infos) {
        if (!(infos != null ? infos.id : void 0)) {
          return utils.alert('获取收藏宝贝失败！');
        } else {
          return new WaterfallListView({
            id: infos.id,
            html: $('#contentContainer .myLikeItemsContainer .itemTemplate').html(),
            el: '#contentContainer .myLikeItemsContainer .waterfallList'
          });
        }
      });
    });
    if (CONFIG.env === 'development') {
      return seajs.emit('loadComplete');
    }
  });

}).call(this);
