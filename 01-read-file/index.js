const fs = require('fs');
const path = require('path');
const fileName = '/text.txt';
const fullPath = path.join(__dirname + fileName);

const stream = fs.createReadStream(fullPath,  'utf8');
stream.on('data', function(chunk){
  console.log(chunk);
});