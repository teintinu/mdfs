# mdfs
[![Build](https://travis-ci.org/hoda5/mdfs.png)](https://travis-ci.org/hoda5/mdfs) [![Dependencies](https://david-dm.org/hoda5/mdfs.svg)](https://david-dm.org/hoda5/mdfs) [![Coverage](https://img.shields.io/coveralls/hoda5/mdfs.svg)](https://coveralls.io/r/hoda5/mdfs?branch=master)
[![Docs](https://inch-ci.org/github/hoda5/mdfs.svg?branch=master)](https://inch-ci.org/github/hoda5/mdfs/branch/master)

[![NPM](https://nodei.co/npm-dl/mdfs.png?months=1&height=1)](https://nodei.co/npm/mdfs/)

Markdown with (Virtual)FileSystem it's a simple way to write many files with a single file, usefull for testcases, specially for transpilers. The main advantage of markdown it's sintax formatting for multiple languages, for example.

```

## file.html
՝՝՝html
<div>text</div>
՝՝՝

## file.jade
՝՝՝jade
div text
՝՝՝

## file.js
՝՝՝javascript
var e=document.createElement('div');
e.textContent = 'text';
՝՝՝

```


# install:
```bash
$ npm install mdfs
```
# usage:
```javascript
var mdfs = require('mdfs')
```

# api:
## mdfs.parse
> parses an md file in a pure javascript object with each virtual file is mapped to a file
```javascript
var mdfs=require('mdfs');
var test=mdfs.parse(mdcontent);
```
This code will return
```javascript
test = {
  'file.html': '<div>text</div>'
  'file.jade': 'div\n  text'
  'file.js': "var e=document.createElement('div');\ne.textContent = 'text';"
```

## mdfs.search 
> searchs *.md files in a directory, parses each one and invoke a callback with parsed object for each one.
```javascript
var mdfs=require('mdfs');
declare('My transpiler test', function(){
  mdfs.search('tests/cases', function callback_function(test){
    if (test.pending)
      xit(test.title);
    else {
      var it_fn = test.only ? it.only : it;
      it_fn(test.title, function(done){
         var actual = my_transpile_function(test.jade);
         var expected = test.html;
         expect(actual).to.be.equal(expected);
      });
    }
  });
});
```
This code will:
* Search all md files (*.md) in tests/cases folder
* Parse each one 
* Invoke callback_function for each parsed file. The callback parameter contains parsed file return plus mdfs attribute.
> test parameter of search callback has refresh method
 
##### mdfs attributes:
* fullname: name of parsed file
* title: the first header on file
* only: true if exists an `**only**` line 
* skip: true if exists an `**skip**` line 
* pending: true if exists an `**pending**` line 

## mdfs.describe
> create tests (describe/it/xit) for each *.md file on `dirname` and subfolders invoking the callback for make some transformation and return actual value witch will be compared with expected value on .md file. A second callback can be used to define to test title and the third callback can be used to compare actual and expected values.
```javascript
var mdfs = require('mdfs')
mdfs.describe(dirname, 'EXPECTED_FILE_NAME',
  function transform_callback(test) {
    var ACTUAL = TRANSFORM_FUNCTION(test['SOURCE_FILE_NAME']);
    return ACTUAL
  }
)
```
This code will create (bdd style) tests that invoke transform_callback function for each file. The special file name `throw` can be used for transformation failures.
See `test/sample.js` for a ES6 to ES5 transpile with using Babel.
