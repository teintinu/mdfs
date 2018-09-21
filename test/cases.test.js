/* eslint-env node, mocha */

var mdfs = require('..')
var root = __dirname + '/cases'
var cases = md_cases()

describe('mdfs parsing and searching', function () {
  mdfs.search(root, function (test) {
    var fn = cases[test.mdfs.file]
    it(test.mdfs.file, function () {
      expect(typeof fn).toEqual('function')
      fn(test)
      cases[test.mdfs.file] = test.mdfs.file + ': ok'
    })
  })
  it('Validate all cases', function () {
    Object.keys(cases).forEach(function (casename) {
      expect(cases[casename]).toEqual(casename + ': ok')
    })
  })
  it('describe has no tests', function () {
    expect(function () {
      mdfs.describe(__dirname + '/not_exists', 'es5.js', function () { })
    }).toThrow('no tests found in ' + __dirname + '/not_exists')
  })
})

function md_cases() {
  return {
    'basic.md': function (test) {
      expect(test.mdfs.file).toEqual('basic.md')
      expect(test.mdfs.subfolder).toEqual('/')
      expect(test.mdfs.fullname).toEqual(root + '/' + test.mdfs.file)

      expect(test.mdfs.title).toEqual('this is a basic test')
      expect(typeof test.mdfs.only).toEqual('undefined')
      expect(typeof test.mdfs.pending).toEqual('undefined')

      expect(test.files['1.html']).toEqual('<div>text</div>')
      expect(test.files['1.jade']).toEqual('div\n  text')
      expect(test.files['1.js']).toEqual("var e=document.createElement('div');\ne.textContent = 'text';")
    },
    'subfolder.md': function (test) {
      expect(test.mdfs.file).toEqual('subfolder.md')
      expect(test.mdfs.subfolder).toEqual('/folder/')
      expect(test.mdfs.fullname).toEqual(root + '/folder/' + test.mdfs.file)

      expect(test.mdfs.title).toEqual('this test is on subfolder')
      expect(typeof test.mdfs.only).toEqual('undefined')
      expect(typeof test.mdfs.pending).toEqual('undefined')

      expect(test.files['1.html']).toEqual('<div>text</div>')
      expect(test.files['1.jade']).toEqual('div\n  text')
      expect(test.files['1.js']).toEqual("var e=document.createElement('div');\ne.textContent = 'text';")
    },
    'title.md': function (test) {
      expect(test.mdfs.file).toEqual('title.md')
      expect(test.mdfs.title).toEqual("that it's the title")
    },
    'duplicated_name_returns_an_array.md': error('Line 7: duplicated name a.txt'),
    'no_name.md': error('Line 4: invalid name'),
    'no_content.md': error('Line 5: no content for 1.txt'),
    'not_closed1.md': error('Line 8: has another code openned'),
    'not_closed2.md': error('Line 11: file declaration not has closed'),
    'erro_h1.md': error('Line 1: expecting header 1 on line ## this teste has error, title must use just one hash'),
    'erro_h2.md': error('Line 3: expecting header 2 on line # 1.html'),
    'only.md': flag('only'),
    'skip.md': flag('skip'),
    'pending.md': flag('pending')
  }
  function error(msg) {
    return function (test) {
      expect(test.mdfs.error).toEqual(msg)
    }
  }
  function flag(flag) {
    return function (test) {
      expect(test.mdfs[flag]).toEqual(true)
    }
  }
}
