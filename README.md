# mdfs
[![Build](https://travis-ci.org/thr0w/mdfs.png)](https://travis-ci.org/thr0w/mdfs) [![Dependencies](https://david-dm.org/thr0w/mdfs.svg)](https://david-dm.org/thr0w/mdfs) [![Coverage](https://img.shields.io/coveralls/thr0w/mdfs.svg)](https://coveralls.io/r/thr0w/mdfs?branch=master)
[![Docs](https://inch-ci.org/github/thr0w/mdfs.svg?branch=master)](https://inch-ci.org/github/thr0w/mdfs/branch/master)

[![NPM](https://nodei.co/npm/mdfs.png?downloads=true)](https://nodei.co/npm/mdfs/)

> still working, carefull in production enviroments

Markdown with FileSystem it's a simple way to write many files with a single file, usefull for testcases, specially for transpilers. The main advantage of markdown it's sintax formatting for multiple languages, for example.

```

# file.html
՝՝՝html
<div>text</div>
՝՝՝

# file.jade
՝՝՝jade
div text
՝՝՝

# file.js
՝՝՝javascript
var e=document.createElement('div');
e.textContent = 'text';
՝՝՝

```


install:
npm install mdfs

#usage
## mdfs.parse

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

### mdfs attribute
* fullname: name of parsed file
* title: the first header on file
* only: true if exists an `**only**` line 
* skip: true if exists an `**skip**` line 
* pending: true if exists an `**pending**` line 

## mdfs.describe

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
