window.LOAD_FILES = []
seajs.on 'fetch', (mod) ->
  LOAD_FILES.push mod.uri

seajs.on 'loadComplete', ->
  setTimeout ->
    index = -1
    for file, i in window.IMPORT_FILES
      index = i if file == '/javascripts/sea_dev.js'
    window.IMPORT_FILES[index] = LOAD_FILES if ~index
    return if !CONFIG.template || !window.IMPORT_FILES.length
    $.post '/seajs/files', {
      template : CONFIG.template
      files : window.IMPORT_FILES
    }
  , 1


