const fs = require('fs')

function inlined (callback, maxSourceSize) {
  if (typeof maxSourceSize !== 'number') {
    maxSourceSize = process.env.MAX_INLINED_SOURCE_SIZE || 600
  }

  if (typeof callback !== 'function') {
    throw new TypeError('Argument *callback* must be a function')
  }

  const module = require('module')

  const origExtensionsJS = module._extensions['.js']

  module._extensions['.js'] = function (_module, filename) {
    const content = fs.readFileSync(filename, 'utf8')

    if (content.length >= maxSourceSize) {
      throw new Error('Exceeded max-inlined-source-size: content length > ' + maxSourceSize + ' for file ' + filename)
    }

    origExtensionsJS(_module, filename)
  }

  callback()
}

module.exports = inlined
