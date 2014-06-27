(function() {
  seajs.config({
    base: CONFIG.staticUrlPrefix,
    alias: {
      'jtLazyLoad': 'components/jtlazy_load/dest/jtlazy_load.js',
      'jtTouchEvent': 'modules/jttouch_event.js',
      'utils': 'modules/utils.js'
    }
  });

  define('jquery', function() {
    return window.jQuery;
  });

  define('underscore', function() {
    if (window._) {
      window._.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
      };
    }
    return window._;
  });

  define('Backbone', function() {
    return window.Backbone;
  });

}).call(this);
