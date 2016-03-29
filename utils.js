'use strict';

var fs = require('fs');
var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();
var test = md.render('#This is a test.')
// TODO: Make these ENV Variables
var posts = __dirname + '/posts/';
var footer = __dirname + '/templates/footer.html';
var header = __dirname + '/templates/header.html';
var index = __dirname + '/public/index.html';
var fileDescriptor;

module.exports.writeIndex = function() {
  var indexFileDescriptor;
  fs.writeFile(index, '', (err) => {
    if(err) {
      console.log(err);
    }
    writeHead(writePosts);
  });
}

function writeHead(callback) {
  console.log('made it into writehead');
  fs.open(index, 'a', (err, fd) => {
    if (err) {
      console.error("Error opening index: ", err);
    }
    fileDescriptor = fd;
    fs.readFile(header, (err, data) => {
      if(err) {
        console.error('error reading header: ', err);
      }
      console.log('headerfile data');
      fs.write(fileDescriptor, data + "", (err, written, string) => {
        fs.close(fileDescriptor, (err) => {
          if(err) {
            console.error("Error closing index.html", err);
          }
          console.log('Index Closed');
          callback();
        });
      });
    });
  });
}

function writePosts() {
  fs.readdir(posts, (err, data) => {
    if(err) {
      console.error("Error reading posts directory: ", err);
    }
    let counter = 0;
    let max = data.length -1;
    function readAFile(){
      fs.readFile(posts + data[counter], (err, data) => {
        if(err) {
          console.error('Error reading markdown file: ', err);
        }
        var convertedData = md.render(data + "");
        convertedData = wrapInPostDiv(convertedData);
        console.log("Post data converted");
        fs.open(index, 'a', (err, fd) => {
          fs.write(fd, convertedData, (err, written, string) => {
            if (err) {
              console.error("Error writing a markdown file: ", err);
            }
            console.log(written, " bytes written to index.html");
            if(counter < max){
              ++counter;
              readAFile();
            }
            // else {
            //   console.log('finished');
            // }
            else {
              writeFooter();
            }
          });
        });
      });
    };
    readAFile();
  });
  // writeHead();
};

function writeFooter() {
  fs.readFile(footer, (err, data) => {
    if(err) {
      console.error("Error reading footer", err);
    }
    //console.log('Footer: ', data + "");
    fs.write(fileDescriptor, data + "", (err) => {
      if(err) {
        console.error("Error writing footer", err);
      }
      fs.close(fileDescriptor, (err) => {
        if(err) {
          console.error("error closing index.", err);
        }
      });
    });
  });
}

function wrapInPostDiv(htmlString) {
  // wraps converted markdown in a div with the class of post
  return '<div class="post">\n' + htmlString + '\n</div>\n';
}
