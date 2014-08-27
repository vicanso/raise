(function() {
  module.exports = function(req, res, cbf) {
    var doing, now;
    now = Date.now();
    doing = true;
    while (doing) {
      if (Date.now() - now > 500) {
        doing = false;
      }
    }
    return cbf(null, {});
  };

}).call(this);
