(function() {
  var Item, User, async, mongodb, _;

  mongodb = require('../helpers/mongodb');

  User = mongodb.model('User');

  Item = mongodb.model('Item');

  async = require('async');

  _ = require('underscore');

  module.exports = function(req, res, cbf) {
    var id, user, _ref;
    id = req.param('id');
    user = (_ref = req.session) != null ? _ref.user : void 0;
    if (user) {
      req.session = null;
      return cbf(null, user);
    } else {
      return async.waterfall([
        function(cbf) {
          return User.findOne({
            id: id
          }, cbf);
        }, function(doc, cbf) {
          return cbf(null, _.pick(doc, ['likes']));
        }
      ], cbf);
    }
  };

}).call(this);
