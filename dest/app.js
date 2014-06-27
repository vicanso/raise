(function() {
  var JTCluster, config, fs, initAppSetting, initMongod, initServer, jtCluster, logger, options, path, requestStatistics;

  path = require('path');

  fs = require('fs');

  config = require('./config');

  logger = require('./helpers/logger')(__filename);

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
    var requestTotal;
    requestTotal = 0;
    return function(req, res, next) {
      var startAt, stat;
      startAt = process.hrtime();
      requestTotal++;
      stat = function() {
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
      };
      res.on('finish', stat);
      res.on('close', stat);
      return next();
    };
  };

  initServer = function() {
    var app, express, expressStatic, serveStatic, staticHandler;
    initMongod();
    express = require('express');
    app = express();
    initAppSetting(app);
    app.use('/healthchecks', function(req, res) {
      return res.send('success');
    });
    app.use('/root.txt', function(req, res) {
      return res.send('94e9e8a9aa0a51e62915ac1434a3ceb7');
    });
    if (config.env === 'production') {
      app.use(requestStatistics());
    }
    app.use(require('connect-timeout')(5000));
    if (config.env === 'production') {
      app.use(require('morgan')());
    }
    expressStatic = 'static';
    serveStatic = express[expressStatic];

    /**
     * [staticHandler 静态文件处理]
     * @param  {[type]} mount      [description]
     * @param  {[type]} staticPath [description]
     * @return {[type]}            [description]
     */
    staticHandler = function(mount, staticPath) {
      var hanlder, hour, jtDev, staticMaxAge;
      hanlder = serveStatic(staticPath);
      hour = 3600;
      if (config.env === 'development') {
        hour = 0;
      }
      staticMaxAge = 30 * 24 * hour;
      if (config.env === 'development') {
        jtDev = require('jtdev');
        app.use(mount, jtDev.ext.converter(staticPath));
        app.use(mount, jtDev.stylus.parser(staticPath));
        app.use(mount, jtDev.coffee.parser(staticPath));
      }
      return app.use(mount, function(req, res, next) {
        res.header('Cache-Control', "public, max-age=" + staticMaxAge + ", s-maxage=" + hour);
        return hanlder(req, res, function(err) {
          if (err) {
            return next(err);
          }
          return res.send(404);
        });
      });
    };
    staticHandler('/static/raise', config.imagePath);
    staticHandler('/static', path.join("" + __dirname + "/statics"));
    if (config.env === 'development') {
      app.use(require('morgan')('dev'));
    }
    app.use(require('method-override')());
    app.use(require('body-parser')());
    app.use(function(req, res, next) {
      if (req.param('__debug') != null) {
        res.locals.DEBUG = true;
      }
      return next();
    });
    require('./router_params')(app);
    require('./router').init(app);
    app.listen(config.port);
    return console.log("server listen on: " + config.port);
  };

  if (config.env === 'development') {
    initServer();
  } else {
    JTCluster = require('jtcluster');
    options = {
      slaveTotal: 1,
      slaveHandler: initServer
    };
    jtCluster = new JTCluster(options);
    jtCluster.on('log', function(msg) {
      return console.dir(msg);
    });
  }

}).call(this);
