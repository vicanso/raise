(function() {
  define('utils', ['jquery', 'underscore'], function(require, exports, module) {
    var $, _;
    $ = require('jquery');
    _ = require('underscore');
    exports.loading = _.debounce(function(show) {
      var loadingContainer;
      loadingContainer = $('.loadingContainer');
      if (show) {
        return loadingContainer.removeClass('hidden');
      } else {
        return loadingContainer.addClass('hidden');
      }
    }, 5);
    exports.showDialog = function(msg, delay, type) {
      var iconClass, obj;
      if (type === 'warning') {
        iconClass = 'iWarning';
      } else {
        iconClass = 'iOK';
      }
      obj = $('<div class="popUpDialog ' + iconClass + '">' + msg + '</div>');
      obj.appendTo('body');
      return _.delay(function() {
        return obj.remove();
      }, delay);
    };
    exports.alert = function(msg, delay) {
      if (delay == null) {
        delay = 2000;
      }
      return this.showDialog(msg, delay, 'warning');
    };
    exports.prompt = function(msg, delay) {
      if (delay == null) {
        delay = 2000;
      }
      return this.showDialog(msg, delay);
    };
  });

}).call(this);
