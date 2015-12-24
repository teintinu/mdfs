var mdfs = require('..')
var babel = require('babel')
var deepEqual = require('deep-equal')

mdfs.describe(__dirname + '/sample', 'es5.js',

  function (test) {
    var es5 = babel.transform(test['es6.js'], {
      filename: test.mdfs.file,
      compact: false
    })
    return es5.code
  }
)

mdfs.describe(__dirname + '/sample', 'es5.js',
  function (test) {
    var es5 = babel.transform(test['es6.js'], {
      filename: test.mdfs.file,
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
      filename: test.mdfs.file,
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

mdfs.describe(__dirname + '/sample', ['es5.js', 'es5.map'],
  function (test) {
    var es5 = babel.transform(test['es6.js'], {
      filename: test.mdfs.file,
      compact: false,
      sourceMaps: true,
      ast: false
    })
    return {
      'es5.js': es5.code,
      'es5.map': es5.map
    }
  },
  function (test, folder) {
    return (test ? test.mdfs.title : folder) + ' (applying assertion function in two results)'
  },
  function (actual, expected, test) {
    var err
    if (actual['es5.js'] !== expected['es5.js']) {
      err = new Error('bad js stuff')
      err.expected = expected['es5.js']
      err.actual = actual['es5.js']
      err.showDiff = true
      throw err
    }
    var e = JSON.parse(expected['es5.map'])
    var a = actual['es5.map']
    if (!deepEqual(e, a)) {
      err = new Error('bad map stuff')
      err.expected = e
      err.actual = a
      err.showDiff = true
      console.dir(err)
      throw err
    }
  }
)
