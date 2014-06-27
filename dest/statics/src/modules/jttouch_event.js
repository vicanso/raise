(function() {
  define('jtTouchEvent', ['jquery', 'underscore'], function(require, exports, module) {
    var $, JTTouchEvent, _;
    $ = require('jquery');
    _ = require('underscore');
    JTTouchEvent = (function() {

      /**
       * [constructor description]
       * @param  {jQuery} jqObj    [绑定事件的jQuery对象]
       * @param  {String} selector [使用on事件的selector]
       * @param  {Object} cbfList  [回调函数列表]
       * @return {[type]}          [description]
       */
      function JTTouchEvent(jqObj, selector, cbfList) {
        var moveOffset;
        if (_.isObject(selector)) {
          cbfList = selector;
          selector = null;
        }
        this._eventList = [];
        this._jqObj = jqObj;
        this._cbfList = cbfList || {};
        moveOffset = {
          x: 0,
          y: 0
        };
        this._touchMove = (function(_this) {
          return function(e) {
            var move;
            move = _this._cbfList.move;
            moveOffset = _this._getOffset(e);
            if (move) {
              move.call(jqObj, e, moveOffset);
            }
          };
        })(this);
        this._touchEnd = (function(_this) {
          return function(e) {
            var end;
            jqObj.off('touchmove', _this._touchMove);
            $(document).off('touchend', _this._touchEnd);
            end = _this._cbfList.end;
            if (end) {
              end.call(jqObj, e, moveOffset);
            }
            if (Math.abs(moveOffset.x) < 20 && Math.abs(moveOffset.y) < 20) {
              e.type = 'vclick';
              jqObj.trigger(e);
            }
          };
        })(this);
        this._touchStart = (function(_this) {
          return function(e) {
            var start, touch;
            if (selector) {
              jqObj.on('touchmove', selector, _this._touchMove);
            } else {
              jqObj.on('touchmove', _this._touchMove);
            }
            $(document).on('touchend', _this._touchEnd);
            start = _this._cbfList.start;
            touch = e.originalEvent.touches[0];
            _this._startPos = {
              x: touch.pageX,
              y: touch.pageY
            };
            if (start) {
              return start.call(jqObj, e);
            }
          };
        })(this);
        if (selector) {
          jqObj.on('touchstart', selector, this._touchStart);
        } else {
          jqObj.on('touchstart', this._touchStart);
        }
      }


      /**
       * [on on事件处理]
       * @param  {[type]}   event [description]
       * @param  {Function} cb    [description]
       * @return {[type]}         [description]
       */

      JTTouchEvent.prototype.on = function(event, cb) {
        this._jqObj.on(event, cb);
        this._eventList.push([event, cb]);
        return this;
      };


      /**
       * [setEventCallback 设置事件回调函数]
       * @param {String} type 可选值为start, move, end
       * @param {Function} func 回调函数
       */

      JTTouchEvent.prototype.setEventCallback = function(type, func) {
        this._jqObj.on(type, func);
        return this;
      };


      /**
       * [destroy 销毁对象]
       * @return {[type]} [description]
       */

      JTTouchEvent.prototype.destroy = function() {
        var jqObj;
        jqObj = this._jqObj;
        _.each(this._eventList, function(infos) {
          return jqObj.off(infos[0], infos[1]);
        });
        jqObj.off('touchstart', this._touchStart);
        return this;
      };


      /**
       * [_getOffset 获取偏移的offset(用于touchmove中)]
       * @param  {[type]} e [description]
       * @return {[type]}   [description]
       */

      JTTouchEvent.prototype._getOffset = function(e) {
        var offset, startPos, touch;
        startPos = this._startPos;
        touch = e.originalEvent.touches[0];
        offset = {
          x: touch.pageX - startPos.x,
          y: touch.pageY - startPos.y
        };
        return offset;
      };

      return JTTouchEvent;

    })();
    module.exports = JTTouchEvent;
  });

}).call(this);
