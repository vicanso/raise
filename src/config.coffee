program = require 'commander'
do ->
  program.version('0.0.1')
  .option('-p, --port <n>', 'listen port', parseInt)
  .option('--log <n>', 'the log file')
  .option('--mongodb <n>', 'mongodb uri')
  .option('--redis <n>', 'redis uri')
  .option('--stats <n>', 'stats uri')
  .parse process.argv


exports.port = program.port || 10000

exports.env = process.env.NODE_ENV || 'development'

exports.app = 'raise'

###*
 * [staticUrlPrefix 静态文件url前缀]
 * @type {String}
###
exports.staticUrlPrefix = '/static'


exports.redis = do ->
  url = require 'url'
  redisUri = program.redis || 'redis://localhost:10010'
  urlInfo = url.parse redisUri
  {
    port : urlInfo.port
    host : urlInfo.hostname
    password : urlInfo.auth
  }

exports.stats = do ->
  url = require 'url'
  statsUri = program.stats || 'stats://localhost:6000'
  urlInfo = url.parse statsUri
  {
    port : urlInfo.port
    host : urlInfo.hostname
  }

exports.session = 
  secret : 'jenny&tree'
  key : 'jt_raise'
  ttl : 3600

module.exports.mongodbUri = program.mongodb || 'mongodb://localhost:10020/raise'

module.exports.imagePath = '/vicanso/data/raise'