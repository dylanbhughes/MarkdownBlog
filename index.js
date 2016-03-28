var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();
var test = md.render('#This is a test.')

app.set('port', (process.env.PORT || 8000));

//app.use(express.static('public'));

app.get('/', function(request, response) {
  fs.readFile('posts/helloWorld.md', function(err, data){
    if(err) {
      console.log(err);
      response.writeHead(500);
      response.send('Internal Server Error');
    }
    response.writeHead(200, {'Content-Type': 'text/html'});
    var convertedMarkdown = md.render(data + '');
    response.write(convertedMarkdown);
    response.end();
  })
});

app.listen(app.get('port'), function() {
  console.log('MarkdownBlog is running on port ', app.get('port'));
});
