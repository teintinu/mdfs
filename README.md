# mdfs
Markdown with FileSystem it's a simple way to write many files with a single file, usefull for testcases, specially for transpilers. The main advantage of markdown it's sintax formatting for multiple languages, for example.

```

՝՝՝html
<div>text</div>
՝՝՝

՝՝՝jade
div text
՝՝՝

՝՝՝javascript
var e=document.createElement('div');
e.textContent = 'text';
՝՝՝

```


install:
npm install mdfs

#usage
## direct parsing

```javascript
var mdfs=require('mdfs');
var test=mdfs.parse(mdcontent);
```
This code will return
```javascript
test = {
  html: '<div>text</div>'
  jade: 'div\n  text'
  javascript: "var e=document.createElement('div');\ne.textContent = 'text';"
```

## automatic tests

```javascript
var mdfs=require('mdfs');
declare('My transpiler test', function(){
  mdfs.declare_bdd_tests('tests/cases', function callback_function(test){
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
* Invoke callback_function for each parsed file 

### Special attributes
* filename: name of parsed file
* title: the first header on file
* only: true if exists an `**only**` line 
* pending: true if exists an `**pending**` line 
