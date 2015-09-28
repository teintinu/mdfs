
var mdfs = require('..')
var babel = require('babel')

mdfs.describe(__dirname + '/sample', 'es5.js',

  function (test) {
    var es5 = babel.transform(test['es6.js'], {
      filename: test.mdfs.filename,
      compact: false
    })
    return es5.code
  }
)

mdfs.describe(__dirname + '/sample', 'es5.js',
  function (test) {
    var es5 = babel.transform(test['es6.js'], {
      filename: test.mdfs.filename,
      compact: false
    })
    return es5.code
  },
  function (test, folder) {
    return (test ? test.mdfs.title : folder) + ' (applying assertion function)'
  }
)

mdfs.describe(__dirname + '/sample', 'es5.js',
  function (test) {
    var es5 = babel.transform(test['es6.js'], {
      filename: test.mdfs.filename,
      compact: false
    })
    return es5.code
  },
  function (test, folder) {
    return (test ? test.mdfs.title : folder) + ' (applying assertion function)'
  },
  function (actual, expected, test) {
    if (actual !== expected) {
      var err = new Error('bad stuff')
      err.expected = expected
      err.actual = actual
      err.showDiff = true
      throw err
    }
  }
)
