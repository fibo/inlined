var test = require('tape')

test('inlined', (t) => {
  t.plan(2)

  require('inlined')(() => {
    t.doesNotThrow(() => {
      require('./lessThan600Chars.js')
    }, 'require lessThan600Chars.js is ok cause it does not exceed the threeshold')
  })

  require('inlined')(() => {
    t.throws(() => {
      require('./moreThan600Chars.js')
    }, 'require moreThan600Chars.js throws cause exceeds number of chars')
  })
})
