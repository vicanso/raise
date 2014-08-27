(function() {
  var Logger, appPath, colors, config, moment, path;

  config = require('../config');

  path = require('path');

  moment = require('moment');

  if (config.env === 'development') {
    colors = require('colors');
  }

  Logger = (function() {
    function Logger(tag) {
      this.tag = tag;
    }

    Logger.prototype.log = function(msg) {
      return this._log('log', msg);
    };

    Logger.prototype.info = function(msg) {
      return this._log('info', msg);
    };

    Logger.prototype.debug = function(msg) {
      return this._log('debug', msg);
    };

    Logger.prototype.error = function(msg) {
      return this._log('error', msg);
    };

    Logger.prototype.warn = function(msg) {
      return this._log('warn', msg);
    };

    Logger.prototype.write = function(msg) {};

    Logger.prototype._log = function(type, msg) {
      var data, str;
      if (config.env === 'development') {
        str = ("[" + type + "]").green;
        str += (" " + (moment().format('HH:mm:ss'))).grey;
        str += " " + (JSON.stringify(msg));
        if (this.tag) {
          str += (" [" + this.tag + "]").cyan;
        }
      } else {
        data = {
          type: type,
          msg: msg,
          createdAt: new Date().toString().green
        };
        if (this.tag) {
          data.tag = this.tag;
        }
        str = JSON.stringify(data);
      }
      if (type === 'error') {
        return console.error(str);
      } else {
        return console.info(str);
      }
    };

    return Logger;

  })();

  appPath = path.join(__dirname, '..');

  module.exports = function(file) {
    file = file.replace(appPath, '');
    return new Logger(file);
  };

}).call(this);
