const fs = require('fs')
const MAX_INLINED_SOURCE_SIZE = 600

function inlined (callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Argument *callback* must be a function')
  }

  const module = require('module')
  const origExtenstionsJS = module._extensions['.js']
  module._extensions['.js'] = function (module, filename) {
    var content = fs.readFileSync(filename, 'utf8')
  console.log(content.length)

    if (content.length >= MAX_INLINED_SOURCE_SIZE) {
      throw new Error('Exceeded max-inlined-source-size: content length > ' + MAX_INLINED_SOURCE_SIZE + ' for file ' + filename)
    }

    origExtenstionsJS(module, filename)
  }

  callback()

  // Restore orig module JS extensions handler, play well with others.
  module._extensions['.js'] = origExtenstionsJS
}

module.exports = inlined
