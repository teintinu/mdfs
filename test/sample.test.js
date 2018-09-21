var mdfs = require('..')
var ts = require('typescript')
var deepEqual = require('deep-equal')

mdfs.describe(__dirname + '/sample', 'es5.js',

  function (test) {
    var t = transpile(test)
    return t.es5
  }
)

mdfs.describe(__dirname + '/sample', 'es5.js',
  function (test) {
    var t = transpile(test)
    return t.es5
  },
  function (test, folder) {
    return [(test ? test.mdfs.title : folder), ' (applying assertion function)'].join('')
  }
)

mdfs.describe(__dirname + '/sample', 'es5.js',
  function (test) {
    var t = transpile(test)
    return t.es5
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
    var t = transpile(test)
    return {
      'es5.js': t.es5,
      'es5.map': t.map
    }
  },
  function (test, folder) {
    return (test ? test.mdfs.title : folder) + ' (applying assertion function in two results)'
  },
  function (actual, expected, test) {
    var err
    expect(actual['es5.js']).toEqual(expected['es5.js'])
    var e = JSON.parse(expected['es5.map'])
    var a = actual['es5.map']
    expect(a).toEqual(e)
  }
)


function transpile(test) {
  var source = test.files['es6.js']
  try {
    var out = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, sourceMap: true },
      reportDiagnostics: true,
    });
    if (out.diagnostics.length) throw new Error("transpile error")
    var map = JSON.parse(out.sourceMapText)
    return {
      es5: out.outputText.replace("//# sourceMappingURL=module.js.map", "").trim(),
      map: {
        version: map.version,
        mappings: map.mappings,
        file: test.mdfs.file,
      }
    }
  }
  catch (e) {
    throw new Error("transpile error: " + e.message)
  }
}