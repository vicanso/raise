(function() {
  var componentsFile, config, fs, moment, path, refreshComponents, _;

  config = require('../config');

  fs = require('fs');

  path = require('path');

  _ = require('underscore');

  moment = require('moment');

  componentsFile = path.join(__dirname, '../components.json');

  module.exports = function(req, res, cbf) {
    var data;
    data = req.body;
    refreshComponents(data.template, _.uniq(_.flatten(data.files)));
    return res.send('');
  };


  /**
   * [refreshComponents 更新components]
   * @param  {[type]} template [description]
   * @param  {[type]} files    [description]
   * @return {[type]}          [description]
   */

  refreshComponents = function(template, files) {
    var allComponents, components, result, staticUrlPrefix, url;
    allComponents = JSON.parse(fs.readFileSync(componentsFile));
    result = {
      js: [],
      css: []
    };
    url = require('url');
    staticUrlPrefix = config.staticUrlPrefix;
    _.each(files, function(fileUrl) {
      var ext, file, urlInfo;
      urlInfo = url.parse(fileUrl);
      file = urlInfo.path;
      if (staticUrlPrefix === file.substring(0, staticUrlPrefix.length)) {
        file = file.substring(staticUrlPrefix.length);
      }
      ext = path.extname(file);
      switch (ext) {
        case '.js':
          return result.js.push(file);
        case '.css':
          return result.css.push(file);
        default:
          throw new Error("unexpect file:" + file);
      }
    });
    components = allComponents[template];
    if (!components || components.js.join('') !== result.js.join('') || components.css.join('') !== result.css.join('')) {
      result.modifiedAt = moment().format('YYYY-MM-DD HH:mm:ss');
      allComponents[template] = result;
      return fs.writeFileSync(componentsFile, JSON.stringify(allComponents, null, 2));
    }
  };

}).call(this);
