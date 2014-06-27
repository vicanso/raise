(function() {
  var client, config, redis, redisConfig;

  config = require('../config');

  redisConfig = config.redis;

  redis = require('redis');

  client = redis.createClient(redisConfig.port, redisConfig.host, {
    auth_pass: redisConfig.password
  });

  client.on('ready', function() {
    return console.dir('ready');
  });

  client.on('connect', function() {
    return console.dir('connect');
  });

  client.on('error', function(err) {
    return console.dir("error: " + err.message);
  });

  module.exports = client;

}).call(this);
