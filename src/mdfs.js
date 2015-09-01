/* eslint-env node, mocha */

/** parses an md text
* @param {string} text md source file
* @returns object with files on md text
*/
function parse_md (text) {
  var lines = text.split('\n')
  var ret = {mdfs: {}}
  var name, actual
  var CODE_REGEX = /^\s*```/
  var TITLE_REGEX = /^\s*#+\s*(.*)$/
  var ONLY_REGEX = /^\s*\*\*\s*only\s*\*\*\s*$/i
  var SKIP_REGEX = /^\s*\*\*\s*skip\s*\*\*\s*$/i
  var PENDING_REGEX = /^\s*\*\*\s*pending\s*\*\*\s*$/i
  lines.some(function (line, idx) {
    var match = CODE_REGEX.test(line)
    if (actual) {
      if (line === '```') {
        ret[name] = actual.join('\n')
        actual = null
        name = null
        return
      }
      if (match) return error('has another code openned')
      actual.push(line)
    } else {
      if (match) {
        if (!name) return error('invalid name')
        actual = []
        return
      }
      if ((match = TITLE_REGEX.exec(line))) {
        if (ret.mdfs.title || CODE_REGEX.test(lines[idx + 1])) {
          if (name) return error('no content for ' + name)
          name = match[1]
          if (ret[name]) return error('duplicated name ' + name)
        }
        else ret.mdfs.title = match[1]
        return
      }
      if (ONLY_REGEX.test(line)) {
        ret.mdfs.only = true
        return
      }
      if (SKIP_REGEX.test(line)) {
        ret.mdfs.skip = true
        return
      }
      if (PENDING_REGEX.test(line)) {
        ret.mdfs.pending = true
        return
      }
    }
    function error (msg) {
      var line = idx + 1
      ret.mdfs.errorline = line
      ret.mdfs.error = 'Line ' + line + ': ' + msg
      return true
    }
  })
  if ((name || actual) && !ret.mdfs.error) ret.mdfs.error = 'Line ' + (lines.length - 1) + ': file declaration not has closed'
  return ret
}

/** search md files
* @param {string} folder root folder to search
* @param {function} callback function invoked for each file. The argument of callback contains parsed text and mdfs object like {fullname: string, file: string, subfolder: string, error: string, only: boolean, pending: boolean, skip: boolean}
*/
function search_tests (folder, callback) {
  var path = require('path')
  var fs = require('fs')

  search_in_dir('/')

  function search_in_dir (subfolder) {
    var files = fs.readdirSync(path.join(folder, subfolder))
    files.forEach(function (file) {
      var fullname = path.join(folder, subfolder, file)
      var stat = fs.statSync(folder + subfolder + file)
      if (stat.isDirectory()) {
        search_in_dir(subfolder + file + '/')
        return
      }
      if (stat.isFile() && path.extname(file) === '.md') {
        var md = fs.readFileSync(fullname, 'utf8')
        var test = parse_md(md)
        test.mdfs.fullname = fullname
        test.mdfs.subfolder = subfolder
        test.mdfs.file = file
        callback(test)
        return
      }
    })
  }

}

/** describe test for md files
* @param {string} folder root folder to search
* @param {function} callback function invoked for each file. The argument of callback contains parsed text and mdfs object like {fullname: string, file: string, subfolder: string, error: string, only: boolean, pending: boolean, skip: boolean} and special throw property
*/
function describe_tests (folder, expected, callback) {
  var expect = require('chai').expect
  describe(folder, function () {
    search_tests(folder, function (test) {
      it(test.mdfs.title || (test.mdfs.subfolder + test.mdfs.file), function () {
        if (test['throw']) {
          expect(function () {
            callback(test)
          }).to.throw(new RegExp(test['throw']))
        } else {
          var actual_value = callback(test)
          var expected_value = test[expected]
          expect(actual_value).to.be.equal(expected_value)
        }
      })
    })
  })
}

module.exports.parse = parse_md
module.exports.search = search_tests
module.exports.describe = describe_tests
