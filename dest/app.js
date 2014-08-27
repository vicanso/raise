(function() {
  var JTCluster, JTStats, adminHandler, config, express, fs, initAppSetting, initMongod, initMonitor, initServer, jtCluster, logger, moment, options, path, requestStatistics, staticHandler, _;

  path = require('path');

  config = require('./config');

  moment = require('moment');

  _ = require('underscore');

  express = require('express');

  JTStats = require('./helpers/stats');

  logger = require('./helpers/logger')(__filename);

  fs = require('fs');

  initAppSetting = function(app) {
    var jtBridgeDevFile, jtBridgeFile;
    app.set('view engine', 'jade');
    app.set('trust proxy', true);
    app.set('views', "" + __dirname + "/views");
    app.locals.CONFIG = {
      env: config.env,
      staticUrlPrefix: config.staticUrlPrefix
    };
    jtBridgeFile = path.join(__dirname, './statics/javascripts/jt_bridge.js');
    app.locals.jtBridge = fs.readFileSync(jtBridgeFile, 'utf8');
    if (config.env === 'development') {
      fs.watchFile(jtBridgeFile, function() {
        app.locals.jtBridge = fs.readFileSync(jtBridgeFile, 'utf8');
      });
      jtBridgeDevFile = path.join(__dirname, './statics/javascripts/jt_bridge_dev.js');
      app.locals.jtBridgeDev = fs.readFileSync(jtBridgeDevFile, 'utf8');
      fs.watchFile(jtBridgeDevFile, function() {
        app.locals.jtBridgeDev = fs.readFileSync(jtBridgeDevFile, 'utf8');
      });
    }
  };

  initMongod = function() {
    var mongodb, uri;
    uri = config.mongodbUri;
    if (uri) {
      mongodb = require('./helpers/mongodb');
      mongodb.init(uri);
      return mongodb.initModels(path.join(__dirname, './models'));
    }
  };


  /**
   * [requestStatistics 请求统计]
   * @return {[type]} [description]
   */

  requestStatistics = function() {
    var handlingReqTotal;
    handlingReqTotal = 0;
    return function(req, res, next) {
      var startAt, stat;
      startAt = process.hrtime();
      handlingReqTotal++;
      stat = _.once(function() {
        var data, diff, ms;
        diff = process.hrtime(startAt);
        ms = diff[0] * 1e3 + diff[1] * 1e-6;
        handlingReqTotal--;
        data = {
          responeseTime: ms.toFixed(3),
          statusCode: res.statusCode,
          url: req.url,
          handlingReqTotal: handlingReqTotal,
          contentLength: GLOBAL.parseInt(res.get('Content-Length'))
        };
        logger.info(data);
        return JTStats.gauge("handlingReqTotal." + (process._jtPid || 0), handlingReqTotal);
      });
      res.on('finish', stat);
      res.on('close', stat);
      return next();
    };
  };

  initMonitor = function() {
    var MB, lagCount, lagLog, lagTotal, memoryLog, toobusy;
    MB = 1024 * 1024;
    memoryLog = function() {
      var heapTotal, heapUsed, memoryUsage, rss;
      memoryUsage = process.memoryUsage();
      rss = Math.floor(memoryUsage.rss / MB);
      heapTotal = Math.floor(memoryUsage.heapTotal / MB);
      heapUsed = Math.floor(memoryUsage.heapUsed / MB);
      JTStats.gauge("memory.rss." + (process._jtPid || 0), rss);
      JTStats.gauge("memory.heapTotal." + (process._jtPid || 0), heapTotal);
      JTStats.gauge("memory.heapUsed." + (process._jtPid || 0), heapUsed);
      return setTimeout(memoryLog, 10 * 1000);
    };
    lagTotal = 0;
    lagCount = 0;
    toobusy = require('toobusy');
    lagLog = function() {
      var lag;
      lagTotal += toobusy.lag();
      lagCount++;
      if (lagCount === 10) {
        lag = Math.ceil(lagTotal / lagCount);
        lagCount = 0;
        lagTotal = 0;
        JTStats.average("lag." + (process._jtPid || 0), lag);
      }
      return setTimeout(lagLog, 1000);
    };
    memoryLog();
    return lagLog();
  };

  adminHandler = function(app) {
    var crypto;
    crypto = require('crypto');
    return app.get('/jt/restart', function(req, res) {
      var key, shasum, _ref;
      key = (_ref = req.query) != null ? _ref.key : void 0;
      if (key) {
        shasum = crypto.createHash('sha1');
        if ('6a3f4389a53c889b623e67f385f28ab8e84e5029' === shasum.update(key).digest('hex')) {
          res.status(200).json({
            msg: 'success'
          });
          return typeof jtCluster !== "undefined" && jtCluster !== null ? jtCluster.restartAll() : void 0;
        } else {
          return res.status(500).json({
            msg: 'fail, the key is wrong'
          });
        }
      } else {
        return res.status(500).json({
          msg: 'fail, the key is null'
        });
      }
    });
  };

  staticHandler = (function() {
    var expressStatic, serveStatic;
    expressStatic = 'static';
    serveStatic = express[expressStatic];

    /**
     * [staticHandler 静态文件处理]
     * @param  {[type]} app      [description]
     * @param  {[type]} mount      [description]
     * @param  {[type]} staticPath [description]
     * @return {[type]}            [description]
     */
    return function(app, mount, staticPath) {
      var expires, handler, hour, hourTotal, jtDev, staticMaxAge;
      handler = serveStatic(staticPath);
      hour = 3600;
      hourTotal = 30 * 24;
      expires = moment().add(moment.duration(hourTotal, 'hour')).toString();
      if (!process.env.NODE_ENV) {
        hour = 0;
        expires = '';
      }
      staticMaxAge = hourTotal * hour;
      if (config.env === 'development') {
        jtDev = require('jtdev');
        app.use(mount, jtDev.ext.converter(staticPath));
        app.use(mount, jtDev.stylus.parser(staticPath));
        app.use(mount, jtDev.coffee.parser(staticPath));
      }
      return app.use(mount, function(req, res, next) {
        if (expires) {
          res.header('Expires', expires);
        }
        res.header('Cache-Control', "public, max-age=" + staticMaxAge + ", s-maxage=" + hour);
        return handler(req, res, function(err) {
          if (err) {
            return next(err);
          }
          logger.error("" + req.url + " is not found!");
          return res.status(404).send('');
        });
      });
    };
  })();

  initServer = function() {
    var app, bodyParser, hostName, httpLogger, timeout;
    initMongod();
    initMonitor();
    app = express();
    initAppSetting(app);
    app.use('/healthchecks', function(req, res) {
      return res.send('success');
    });
    if (config.env !== 'development') {
      hostName = require('os').hostname();
      app.use(function(req, res, next) {
        res.header('JT-Info', "" + hostName + "," + process.pid + "," + process._jtPid);
        return next();
      });
      app.use(requestStatistics());
      httpLogger = require('./helpers/logger')('HTTP');
      app.use(require('morgan')({
        format: 'tiny',
        stream: {
          write: function(msg) {
            return httpLogger.info(msg.trim());
          }
        }
      }));
    }
    timeout = require('connect-timeout');
    app.use(timeout(5000));
    staticHandler(app, '/static/raise', config.imagePath);
    staticHandler(app, '/static', path.join("" + __dirname + "/statics"));
    app.use(require('method-override')());
    bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
    app.use(function(req, res, next) {
      var pattern;
      if (req.param('__debug') != null) {
        res.locals.DEBUG = true;
      }
      res.locals.JS_DEBUG = req.param('__jsdebug') || 0;
      pattern = req.param('__pattern');
      if (config.env === 'development' && !pattern) {
        pattern = '*';
      }
      res.locals.PATTERN = pattern;
      return next();
    });
    adminHandler(app);
    require('./router').init(app);
    app.use(require('./controllers/error'));
    app.listen(config.port);
    return console.log("server listen on: " + config.port);
  };

  if (config.env === 'development') {
    initServer();
  } else {
    JTCluster = require('jtcluster');
    options = {
      slaveTotal: 2,
      slaveHandler: initServer
    };
    jtCluster = new JTCluster(options);
    jtCluster.on('log', function(msg) {
      return console.dir(msg);
    });
  }

}).call(this);
