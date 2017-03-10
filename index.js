const fs = require('fs')
const MAX_INLINED_SOURCE_SIZE = 600

function inlined (callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Argument *callback* must be a function')
  }

  const module = require('module')

  const origExtensionsJS = module._extensions['.js']

  module._extensions['.js'] = function (_module, filename) {
    const content = fs.readFileSync(filename, 'utf8')

    if (content.length >= MAX_INLINED_SOURCE_SIZE) {
      throw new Error('Exceeded max-inlined-source-size: content length > ' + MAX_INLINED_SOURCE_SIZE + ' for file ' + filename)
    }

    origExtensionsJS(_module, filename)
  }

  callback()
}

module.exports = inlined
