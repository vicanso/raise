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
      return $.ajax({
        url: '/seajs/files',
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          template: CONFIG.template,
          files: _.flatten(window.IMPORT_FILES)
        })
      }).success(function(res) {
        if (res.msg) {
          return alert(res.msg);
        }
      });
    }, 1);
  });

}).call(this);
