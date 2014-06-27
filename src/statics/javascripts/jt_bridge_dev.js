;(function(global){
  var jtBridge = global.JT_BRIDGE;
  setTimeout(function(){
    jtBridge.emit('deviceReady');
  }, 100);

  jtBridge.call = function(type, cbf){
    if(type === 'appInfo'){
      cbf(null, {
        id : 'F1D51095-AE4C-4708-BDF6-8EC5638D401A'
      });
    }
  };

})(window);
