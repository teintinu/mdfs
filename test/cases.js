/* eslint-env node, mocha */

var chai = require('chai')
var mdfs = require('..')

var root = __dirname + '/cases'
var cases = md_cases()
var expect = chai.expect

describe('mdfs parsing and searching', function () {
  mdfs.search(root, function (test) {
    var fn = cases[test.mdfs.file]
    it(test.mdfs.file, function () {
      expect(typeof fn, 'test function').to.be.equal('function')
      fn(test)
      cases[test.mdfs.file] = 'ok'
    })
  })
  it('Validate all cases', function () {
    Object.keys(cases).forEach(function (casename) {
      expect(cases[casename], casename).to.be.equal('ok')
    })
  })
  it('describe has no tests', function () {
    expect(function () {
      mdfs.describe(__dirname + '/not_exists', 'es5.js', function () {})
    }).to.throw('no tests found in ' + __dirname + '/not_exists')
  })
})

function md_cases () {
  return {
    'basic.md': function (test) {
      expect(test.mdfs.file).to.be.equal('basic.md')
      expect(test.mdfs.subfolder).to.be.equal('/')
      expect(test.mdfs.fullname).to.be.equal(root + '/' + test.mdfs.file)

      expect(test.mdfs.title).to.be.equal('this is a basic test')
      expect(typeof test.mdfs.only).to.be.equal('undefined')
      expect(typeof test.mdfs.pending).to.be.equal('undefined')

      expect(test['1.html']).to.be.equal('<div>text</div>')
      expect(test['1.jade']).to.be.equal('div\n  text')
      expect(test['1.js']).to.be.equal("var e=document.createElement('div');\ne.textContent = 'text';")
    },
    'subfolder.md': function (test) {
      expect(test.mdfs.file).to.be.equal('subfolder.md')
      expect(test.mdfs.subfolder).to.be.equal('/folder/')
      expect(test.mdfs.fullname).to.be.equal(root + '/folder/' + test.mdfs.file)

      expect(test.mdfs.title).to.be.equal('this test is on subfolder')
      expect(typeof test.mdfs.only).to.be.equal('undefined')
      expect(typeof test.mdfs.pending).to.be.equal('undefined')

      expect(test['1.html']).to.be.equal('<div>text</div>')
      expect(test['1.jade']).to.be.equal('div\n  text')
      expect(test['1.js']).to.be.equal("var e=document.createElement('div');\ne.textContent = 'text';")
    },
    'title.md': function (test) {
      expect(test.mdfs.file).to.be.equal('title.md')

      expect(test.mdfs.title).to.be.equal("that it's the title")
    },
    'duplicated_name_returns_an_array.md': error('Line 7: duplicated name a.txt'),
    'no_name.md': error('Line 4: invalid name'),
    'no_content.md': error('Line 5: no content for 1.txt'),
    'not_closed1.md': error('Line 8: has another code openned'),
    'not_closed2.md': error('Line 11: file declaration not has closed'),
    'only.md': flag('only'),
    'skip.md': flag('skip'),
    'pending.md': flag('pending')
  }
  function error (msg) {
    return function (test) {
      expect(test.mdfs.error).to.be.equal(msg)
    }
  }
  function flag (flag) {
    return function (test) {
      expect(test.mdfs[flag]).to.be.true
    }
  }
}
