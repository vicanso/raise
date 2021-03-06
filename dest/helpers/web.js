(function() {
  var _;

  _ = require('underscore');

  exports.getNavList = function(activeIndex) {
    var navList;
    navList = [
      {
        name: '爱逛',
        url: '/?__webview=0&__back=1'
      }, {
        name: '分类',
        url: '/category?__webview=1&__back=1'
      }, {
        name: '我的',
        url: '/my?__webview=2&__back=1&cache=false'
      }
    ];
    _.each(navList, function(nav, i) {
      if (i === activeIndex) {
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    return navList;
  };

}).call(this);
