
var mdfs = require('..')
var babel = require('babel')

mdfs.describe(__dirname + '/sample', 'es5.js',

  function (test) {
    return babel.transform(test['es6.js'], {
      filename: test.mdfs.filename,
      compact: false
    }).code
  }

)
