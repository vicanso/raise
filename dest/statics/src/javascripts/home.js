(function() {
  seajs.use(['jquery', 'underscore', 'jtTouchEvent', 'utils'], function($, _, JTTouchEvent, utils) {

    /**
     * [initContentMoveEvent 初始化单品内容事件（滑动切换）]
     * @param  {[type]} jqObj [description]
     * @param  {[type]} width [description]
     * @return {[type]}       [description]
     */
    var contentContainer, contentContainerWidth, initContentMoveEvent, initLikeEvent, itemsListView;
    initContentMoveEvent = function(jqObj, width) {
      var halfWidth, itemContainerList, maxPage, moveOffset, pageIndex, startOffset, startTime, stepOffset;
      startOffset = 0;
      moveOffset = 0;
      halfWidth = width / 2;
      stepOffset = 5;
      startTime = 0;
      pageIndex = 0;
      itemContainerList = jqObj.find('.itemContainer');
      maxPage = JT_GLOBAL.itemTotal;
      return new JTTouchEvent(jqObj, {
        start: function(e) {
          startOffset = -pageIndex * width;
          startTime = e.timeStamp;
        },
        move: function(e, offset) {
          var css;
          moveOffset = offset.x;
          if (stepOffset > Math.abs(moveOffset)) {
            return;
          }
          css = "translateX(" + (moveOffset + startOffset) + "px)";
          return jqObj.css('transform', css);
        },
        end: function(e) {
          var absOffset, animateOptions, currentOffset, itemContainer;
          absOffset = Math.abs(moveOffset);
          if (stepOffset > absOffset) {
            return;
          }
          currentOffset = startOffset + moveOffset;
          if (absOffset > halfWidth || (e.timeStamp - startTime < 200 && absOffset > 50)) {
            if (moveOffset < 0 && pageIndex < maxPage - 1) {
              pageIndex++;
            }
            if (moveOffset > 0 && pageIndex > 0) {
              pageIndex--;
            }
          }
          itemContainer = itemContainerList.eq(pageIndex + 2);
          if (itemContainer.hasClass('notLoad')) {
            itemContainer.css('background-image', "url(" + (itemContainer.data('src')) + ")");
            itemContainer.removeClass('notLoad');
          }
          moveOffset = -pageIndex * width - currentOffset;
          jqObj.css('_moveOffset', currentOffset);
          animateOptions = {
            _moveOffset: moveOffset
          };
          jqObj.animate(animateOptions, {
            duration: 300,
            step: function(now, fx) {
              return $(this).css('transform', "translateX(" + (currentOffset + now) + "px)");
            },
            complete: function() {}
          });
          moveOffset = 0;
        }
      });
    };

    /**
     * [initLikeEvent 初始化收藏宝贝的事件]
     * @param  {[type]} jqObj [description]
     * @return {[type]}       [description]
     */
    initLikeEvent = function(jqObj) {
      var likeItems;
      likeItems = {};
      return jqObj.on('click', '.header .like', function() {
        var itemId;
        itemId = $(this).data('id');
        if (likeItems[itemId]) {
          utils.prompt('你已收藏了该宝贝！');
          return;
        }
        likeItems[itemId] = true;
        return JT_BRIDGE.call('appInfo', function(err, infos) {
          if (!(infos != null ? infos.id : void 0)) {
            return;
          }
          return $.ajax({
            url: "/user/" + infos.id + "/like",
            dataType: 'json',
            type: 'post',
            data: {
              itemId: itemId
            }
          }).success(function(res) {
            return utils.prompt('已成功收藏该宝贝！');
          }).error(function(res) {
            return utils.alert('收藏失败，请稍候再试！');
          });
        });
      });
    };
    contentContainer = $('#contentContainer');
    contentContainerWidth = contentContainer.width();
    itemsListView = contentContainer.find('.itemsListView');
    initContentMoveEvent(itemsListView, contentContainerWidth);
    initLikeEvent(itemsListView);
    $(document).on('touchmove', function(e) {
      return e.preventDefault();
    });
    if (CONFIG.env === 'development') {
      return seajs.emit('loadComplete');
    }
  });

}).call(this);
