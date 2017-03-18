var fs = require('fs')

// It is
var die

function inlined (arg) {
  if (typeof arg !== 'object') arg = {}

  var maxInlinedSourceSize = arg.maxInlinedSourceSize

  if (typeof maxInlinedSourceSize !== 'number') {
    maxInlinedSourceSize = process.env.MAX_INLINED_SOURCE_SIZE || 600
  }

  return function (callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('Argument *callback* must be a function')
    }

    var module = require('module')
    die = true

    var origExtensionsJS = module._extensions['.js']

    module._extensions['.js'] = function (_module, filename) {
      var content = fs.readFileSync(filename, 'utf8')

      if (die && content.length >= maxInlinedSourceSize) {
        var errorMessage = 'Exceeded max-inlined-source-size: content length > ' + maxInlinedSourceSize + ' for file ' + filename

        var exceededInlinedSourceSizeError = new Error(errorMessage)

        exceededInlinedSourceSizeError.filename = filename
        exceededInlinedSourceSizeError.maxInlinedSourceSize = maxInlinedSourceSize

        throw exceededInlinedSourceSizeError
      }

      origExtensionsJS(_module, filename)
    }

    callback()

    // Restore orig module behaviour, play well with others.
    // Unluckly, the code
    //
    //     module._extensions['.js'] = origExtensionsJS
    //
    // will not work, so I need to set a flag.
    die = false
  }
}

module.exports = inlined
