(function() {
  var JTStats, async, logger, _;

  _ = require('underscore');

  async = require('async');

  logger = require('../helpers/logger')(__filename);

  JTStats = require('../helpers/stats');

  module.exports = function(req, res, cbf) {
    var data, ip, ua;
    ua = req.header('user-agent');
    ip = req.ip;
    data = req.body;
    if (data) {
      logger.info("ip:" + ip + ", html use " + data.html + "ms, js use " + data.js + "ms, ua:" + ua);
      JTStats.gauge('timeline.html', data.html);
      JTStats.gauge('timeline.js', data.js);
    }
    return cbf(null, {
      msg: 'success'
    });
  };

}).call(this);
