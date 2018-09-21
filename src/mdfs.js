/* eslint-env node, mocha */

/** parses an md text
* @param {string} text md source file
* @returns object with files on md text
*/
function parse_md (text) {
  var lines = text.split('\n')
  var ret = { mdfs: {}, files: {} }
  var name, actual
  var CODE_REGEX = /^\s*```/
  var TITLE_REGEX = /^\s*(#+)\s*(.*)$/
  var ONLY_REGEX = /^\s*\*\*\s*only\s*\*\*\s*$/i
  var SKIP_REGEX = /^\s*\*\*\s*skip\s*\*\*\s*$/i
  var PENDING_REGEX = /^\s*\*\*\s*pending\s*\*\*\s*$/i
  lines.some(function (line, idx) {
    var match = CODE_REGEX.test(line)
    if (actual) {
      if (line === '```') {
        ret.files[name] = actual.join('\n')
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
          name = match[2]
          if (ret.files[name]) return error('duplicated name ' + name)
          if (match[1].length !== 2) return error('expecting header 2 on line ' + line)
        } else {
          ret.mdfs.title = match[2]
          if (match[1].length !== 1) return error('expecting header 1 on line ' + line)
        }
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
  if (!ret.mdfs.title) ret.mdfs.title = ret.mdfs.subfolder + ret.mdfs.file
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
    var fullname
    var test
    var files = fs.readdirSync(path.join(folder, subfolder))
    files.forEach(function (file) {
      fullname = path.join(folder, subfolder, file)
      var stat = fs.statSync(folder + subfolder + file)
      if (stat.isDirectory()) {
        search_in_dir(subfolder + file + '/')
        return
      }
      if (stat.isFile() && path.extname(file) === '.md') {
        refresh_md()
        test.mdfs.fullname = fullname
        test.mdfs.subfolder = subfolder
        test.mdfs.file = file
        callback(test)
      }
    })
    function refresh_md () {
      var md = fs.readFileSync(fullname, 'utf8')
      test = parse_md(md)
      test.refresh = refresh_md
    }
  }
}

/** describe test for md files
* @param {string} folder root folder to search
* @param {string} expected field (or fields) for expected file name
* @param {function} callback function invoked for each file. The argument of callback contains parsed text and mdfs object like {fullname: string, file: string, subfolder: string, error: string, only: boolean, pending: boolean, skip: boolean} and special throw property
* @param {title_fn} callback function invoked to get title of each test
* @param {assertion_fn} callback function invoked to assert actual against expected
*/
function describe_tests (folder, expected, callback, title_fn, assertion_fn) {
  var count = 0
  var desc_title = title_fn ? title_fn(null, folder) : folder
  describe(desc_title.toString(), function () {
    search_tests(folder, function (test) {
      count++
      var it_title=title_fn ? title_fn(test, folder) : test.mdfs.title
      it(it_title.toString(), function () {
        if (test.files['throw']) {
          expect(function () {
            callback(test)
          }).toThrowError(new RegExp(test.files['throw']))
        } else {
          debugger
          var actual_value = callback(test)
          var expected_value
          if (Array.isArray(expected)) {
            expected_value = {}
            expected.forEach(function (i) {
              expected_value[i] = test.files[i]
            })
          } else {
            expected_value = test.files[expected]
          }
          if (assertion_fn) assertion_fn(actual_value, expected_value, test)
          else expect(actual_value).toEqual(expected_value)
        }
      })
    })
  })
  if (count === 0) throw new Error('no tests found in ' + folder)
}

module.exports.parse = parse_md
module.exports.search = search_tests
module.exports.describe = describe_tests
