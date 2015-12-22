var mdfs = require('..')
var babel = require('babel')

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
    console.dir(test)
    var es5 = babel.transform(test['es6.js'], {
      filename: test.mdfs.file,
      compact: false
    })
    return {
      'es5.js': es5.code,
      'es5.map': test.mdfs.file
    }
  },
  function (test, folder) {
    return (test ? test.mdfs.title : folder) + ' (applying assertion function in two results)'
  },
  function (actual, expected, test) {
    var err
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      err = new Error('bad stuff')
      err.expected = JSON.stringify(expected, null, 2)
      err.actual = JSON.stringify(actual, null, 2)
      err.showDiff = true
      throw err
    }
    if (actual['es5.js'] !== expected['es5.js']) {
      err = new Error('bad js stuff')
      err.expected = expected['es5.js']
      err.actual = actual['es5.js']
      err.showDiff = true
      throw err
    }
    if (actual['es5.map'] !== expected['es5.map']) {
      err = new Error('bad map stuff')
      err.expected = expected['es5.map']
      err.actual = actual['es5.map']
      err.showDiff = true
      throw err
    }
  }
)
