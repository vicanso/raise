(function() {
  seajs.use(['jquery', 'underscore', 'jtTouchEvent', 'utils'], function($, _, JTTouchEvent, utils) {
    var noop, timeline;
    noop = function() {};
    document.addEventListener('touchstart', noop, false);
    timeline = window.TIME_LINE;
    if (timeline) {
      console.dir(timeline.getLogs());
    }
    JT_BRIDGE.on('memoryUsage', function(usage) {
      return $('#DEBUG_CONTAINER .memory').text("" + usage + "MB");
    });
    return JT_BRIDGE.on('changeView', function(status) {
      if (status === 'loading') {
        return utils.loading(true);
      } else {
        return utils.loading(false);
      }
    });
  });

}).call(this);
