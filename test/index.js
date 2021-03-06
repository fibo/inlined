var test = require('tape')

test('inlined', (t) => {
  t.plan(4)

  t.throws(() => {
    require('inlined')()(() => {
      require('./moreThan600Chars.js')
    })
  }, 'require inlined moreThan600Chars.js throws cause exceeds number of chars')

  t.doesNotThrow(() => {
    require('inlined')()(() => {
      var result = require('./lessThan600Chars.js')

      t.equal(result, 'ok!', 'require works')
    })
  }, 'require lessThan600Chars.js is ok cause it does not exceed the threeshold')

  t.doesNotThrow(() => {
    require('./moreThan600Chars.js')
  }, 'require moreThan600Chars.js again will not throw cause not inside inlined')
})
