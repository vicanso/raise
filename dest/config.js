(function() {
  var program;

  program = require('commander');

  (function() {
    return program.version('0.0.1').option('-p, --port <n>', 'listen port', parseInt).option('--log <n>', 'the log file').option('--mongodb <n>', 'mongodb uri').option('--redis <n>', 'redis uri').option('--stats <n>', 'stats uri').parse(process.argv);
  })();

  exports.port = program.port || 10000;

  exports.env = process.env.NODE_ENV || 'development';

  exports.app = 'raise';


  /**
   * [staticUrlPrefix 静态文件url前缀]
   * @type {String}
   */

  exports.staticUrlPrefix = '/static';

  exports.redis = (function() {
    var redisUri, url, urlInfo;
    url = require('url');
    redisUri = program.redis || 'redis://localhost:10010';
    urlInfo = url.parse(redisUri);
    return {
      port: urlInfo.port,
      host: urlInfo.hostname,
      password: urlInfo.auth
    };
  })();

  exports.stats = (function() {
    var statsUri, url, urlInfo;
    url = require('url');
    statsUri = program.stats || 'stats://localhost:6000';
    urlInfo = url.parse(statsUri);
    return {
      port: urlInfo.port,
      host: urlInfo.hostname
    };
  })();

  exports.session = {
    secret: 'jenny&tree',
    key: 'jt_raise',
    ttl: 3600
  };

  module.exports.mongodbUri = program.mongodb || 'mongodb://localhost:10020/raise';

  module.exports.imagePath = '/vicanso/data/raise';

}).call(this);
