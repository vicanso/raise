(function() {
  var JTCluster, config, fs, initAppSetting, initMongod, initServer, jtCluster, logger, moment, options, path, requestStatistics, _;

  path = require('path');

  config = require('./config');

  moment = require('moment');

  _ = require('underscore');

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

  requestStatistics = function() {
    var requestTotal, tooManyReq;
    requestTotal = 0;
    tooManyReq = new Error('too many request');
    return function(req, res, next) {
      var startAt, stat;
      startAt = process.hrtime();
      requestTotal++;
      stat = _.once(function() {
        var data, diff, ms;
        diff = process.hrtime(startAt);
        ms = diff[0] * 1e3 + diff[1] * 1e-6;
        requestTotal--;
        data = {
          responeseTime: ms.toFixed(3),
          statusCode: res.statusCode,
          url: req.url,
          requestTotal: requestTotal,
          contentLength: GLOBAL.parseInt(res._headers['content-length'])
        };
        return logger.info(data);
      });
      res.on('finish', stat);
      res.on('close', stat);
      return next();
    };
  };

  initServer = function() {
    var app, bodyParser, express, expressStatic, hostName, serveStatic, staticHandler, timeout;
    initMongod();
    express = require('express');
    app = express();
    initAppSetting(app);
    app.use('/healthchecks', function(req, res) {
      return res.send('success');
    });
    if (config.env === 'production') {
      hostName = require('os').hostname();
      app.use(function(req, res, next) {
        res.header('JT-Info', "" + hostName + "," + process.pid + "," + process._jtPid);
        return next();
      });
      app.use(requestStatistics());
      app.use(require('morgan')());
    }
    timeout = require('connect-timeout');
    app.use(timeout(5000));
    expressStatic = 'static';
    serveStatic = express[expressStatic];

    /**
     * [staticHandler 静态文件处理]
     * @param  {[type]} mount      [description]
     * @param  {[type]} staticPath [description]
     * @return {[type]}            [description]
     */
    staticHandler = function(mount, staticPath) {
      var expires, hour, hourTotal, jtDev, staticMaxAge;
      staticHandler = serveStatic(staticPath);
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
        return staticHandler(req, res, function(err) {
          if (err) {
            return next(err);
          }
          logger.error("" + req.url + " is not found!");
          return res.send(404, '');
        });
      });
    };
    staticHandler('/static/raise', config.imagePath);
    staticHandler('/static', path.join("" + __dirname + "/statics"));
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
