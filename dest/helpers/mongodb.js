(function() {
  var Schema, client, logger, mongoose, requireTree, _;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  _ = require('underscore');

  requireTree = require('require-tree');

  logger = require('./logger')(__filename);

  client = null;


  /**
   * [init description]
   * @param  {[type]} uri     [description]
   * @param  {[type]} options =             {} [description]
   * @return {[type]}         [description]
   */

  module.exports.init = function(uri, options) {
    var defaults;
    if (options == null) {
      options = {};
    }
    if (client) {
      return;
    }
    defaults = {
      db: {
        native_parser: true
      },
      server: {
        poolSize: 5,
        auto_reconnect: true
      }
    };
    _.extend(options, defaults);
    client = mongoose.createConnection(uri, options);
    client.on('connected', function() {
      return logger.info("" + uri + " connected");
    });
    client.on('disconnected', function() {
      return logger.info("" + uri + " disconnected");
    });
    return client.on('error', function(err) {
      return console.dir(err);
    });
  };


  /**
   * [initModels 初始化models]
   * @param  {[type]} modelPath [description]
   * @return {[type]}           [description]
   */

  module.exports.initModels = function(modelPath) {
    var models;
    if (!client) {
      throw new Error('the db is not init!');
    }
    models = requireTree(modelPath);
    return _.each(models, function(model, name) {
      var schema;
      name = name.charAt(0).toUpperCase() + name.substring(1);
      schema = new Schema(model.schema, model.options);
      if (model.indexes) {
        _.each(model.indexes, function(indexOptions) {
          return schema.index(indexOptions);
        });
      }
      return client.model(name, schema);
    });
  };


  /**
   * [model 获取mongoose的model]
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */

  module.exports.model = function(name) {
    if (!client) {
      throw new Error('the db is not init!');
    }
    return client.model(name);
  };

}).call(this);
