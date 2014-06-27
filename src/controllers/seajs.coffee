config = require '../config'
fs = require 'fs'
path = require 'path'
_ = require 'underscore'
moment = require 'moment'
componentsFile = path.join __dirname, '../components.json'

module.exports = (req, res, cbf) ->
  data = req.body
  refreshComponents data.template, _.uniq _.flatten data.files
  res.send ''

###*
 * [refreshComponents 更新components]
 * @param  {[type]} template [description]
 * @param  {[type]} files    [description]
 * @return {[type]}          [description]
###
refreshComponents = (template, files) ->
  allComponents = JSON.parse fs.readFileSync componentsFile
  result = 
    js : []
    css : []
  url = require 'url'
  staticUrlPrefix = config.staticUrlPrefix
  _.each files, (fileUrl) ->
    urlInfo = url.parse fileUrl
    file = urlInfo.path
    file = file.substring staticUrlPrefix.length if staticUrlPrefix == file.substring 0, staticUrlPrefix.length
    ext = path.extname file
    switch ext
      when '.js' then result.js.push file
      when '.css' then result.css.push file
      else throw new Error "unexpect file:#{file}"
  components = allComponents[template]
  if !components || components.js.join('') != result.js.join('') || components.css.join('') != result.css.join('')
    result.modifiedAt = moment().format 'YYYY-MM-DD HH:mm:ss'
    allComponents[template] = result
    fs.writeFileSync componentsFile, JSON.stringify allComponents, null, 2
