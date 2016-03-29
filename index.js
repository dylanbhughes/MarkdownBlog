'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var utils = require('./utils.js');

app.set('port', (process.env.PORT || 8000));

utils.writeIndex();

app.use(express.static('public'));

app.listen(app.get('port'), () => {
  console.log('MarkdownBlog is running on port ', app.get('port'));
});
