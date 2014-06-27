(function() {
  seajs.use(['jquery', 'underscore', 'jtTouchEvent', 'utils'], function($, _, JTTouchEvent, utils) {
    if (CONFIG.env === 'development') {
      return seajs.emit('loadComplete');
    }
  });

}).call(this);
