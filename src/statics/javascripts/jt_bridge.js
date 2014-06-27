;(function(global){
  var isDeviceReady = false;
  var events = {};
  var idCounter = 0;
  var bridgeCbfDict = {};
  var callingAppFunction = false;
  var callAppFunctionArgsList = [];
  var _start = new Date();
  var jtBridge = {
    on : function(type, handler){
      if(type === 'deviceReady' && isDeviceReady){
        if(handler){
          setTimeout(handler, 0);
        }
        return;
      }
      if(!events[type]){
        events[type] = [];
      }
      if(handler){
        events[type].push(handler);
      }
    },
    off : function(type, handler){
      var arr = events[type];
      if(!handler){
        delete events[type];
      }else if(arr){
        var index = arr.indexOf(handler);
        if(~index){
          arr.splice(index, 1);
        }
      }
    },
    once : function(type, handler){
      if(handler){
        var originalHanlder = handler;
        handler = function(){
          originalHanlder.apply(null, arguments);
          jtBridge.off(type, originalHanlder);
        };
        jtBridge.on(type, handler);
      }
    },
    emit : function(){
      var args = Array.prototype.slice.call(arguments);
      var type = args.shift();
      var list = events[type];
      if(type === 'deviceReady'){
        isDeviceReady = true;
        this._getCallAlready();
      }
      if(list){
        list.forEach(function(handler){
          handler.apply(null, args);
        });
      }
    },
    call : function(){
      var args = Array.prototype.slice.call(arguments);
      if(!isDeviceReady || callingAppFunction){
        callAppFunctionArgsList.push(args);
        return;
      }
      callingAppFunction = true;
      var cbf = args.pop();
      bridgeCbfDict[++idCounter] = cbf;
      args.push(idCounter);
      window.location.href = 'app:' + args.join('::');
    },
    reply : function(){
      var args = Array.prototype.slice.call(arguments);
      var id = args.shift();
      var cbf = bridgeCbfDict[id];
      if(cbf){
        window.setTimeout(function(){
          cbf.apply(null, args);
        }, 0);
      }
      delete bridgeCbfDict[id];
    },
    _getCallAlready : function(){
      callingAppFunction = false;
      if(callAppFunctionArgsList.length){
        var args = callAppFunctionArgsList.shift();
        this.call.apply(this, args);
      }
    }
  };
  global.JT_BRIDGE = jtBridge;


})(window);