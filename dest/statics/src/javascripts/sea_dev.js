(function() {
  window.LOAD_FILES = [];

  seajs.on('fetch', function(mod) {
    return LOAD_FILES.push(mod.uri);
  });

  seajs.on('loadComplete', function() {
    return setTimeout(function() {
      var file, i, index, _i, _len, _ref;
      index = -1;
      _ref = window.IMPORT_FILES;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        file = _ref[i];
        if (file === '/javascripts/sea_dev.js') {
          index = i;
        }
      }
      if (~index) {
        window.IMPORT_FILES[index] = LOAD_FILES;
      }
      if (!CONFIG.template || !window.IMPORT_FILES.length) {
        return;
      }
      return $.post('/seajs/files', {
        template: CONFIG.template,
        files: window.IMPORT_FILES
      });
    }, 1);
  });

}).call(this);
