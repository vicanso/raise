(function() {
  define('jtLazyLoad', ['jquery', 'underscore'], function(require, exports) {
    var load;
    load = function(lazyLoadItems, scrollObj) {
      var $, bindingEventObj, getLazyLoadItemInfos, lazyLoadItemInfos, loadImage, windowHeight, _;
      $ = require('jquery');
      _ = require('underscore');
      windowHeight = $(window).height();
      bindingEventObj = scrollObj || $(window);
      getLazyLoadItemInfos = function() {
        var tmpScrollTop;
        if (scrollObj) {
          tmpScrollTop = scrollObj.scrollTop();
        }
        return _.compact(_.map(lazyLoadItems, function(obj) {
          var top;
          obj = $(obj);
          if (obj.find('img.hidden').length) {
            if (tmpScrollTop) {
              top = obj.position().top + tmpScrollTop;
            } else {
              top = obj.offset().top;
            }
            return {
              top: top,
              obj: obj
            };
          } else {
            return null;
          }
        }));
      };
      lazyLoadItemInfos = getLazyLoadItemInfos();
      loadImage = _.debounce(function() {
        var containerObj, maxTop, top;
        containerObj = scrollObj || $(document);
        top = containerObj.scrollTop() - 300;
        maxTop = top + windowHeight + 600;
        lazyLoadItemInfos = _.filter(lazyLoadItemInfos, function(lazyLoadItemInfo) {
          var lazyLoadItemInfoTop;
          lazyLoadItemInfoTop = lazyLoadItemInfo.top;
          if (lazyLoadItemInfoTop > top && lazyLoadItemInfoTop < maxTop) {
            lazyLoadItemInfo.obj.find('img').each(function() {
              var img, imgSrc, obj;
              obj = $(this);
              img = new Image();
              imgSrc = obj.attr('data-src');
              img.onload = function() {
                return obj.removeClass('hidden');
              };
              img.src = imgSrc;
              return obj.attr('src', imgSrc);
            });
            return false;
          } else {
            return true;
          }
        });
        if (!lazyLoadItemInfos.length) {
          return bindingEventObj.off('scroll', loadImage);
        }
      }, 300);
      return bindingEventObj.scroll(loadImage);
    };
    load($('.directive-lazyload'));
    exports.load = load;
  });

}).call(this);
