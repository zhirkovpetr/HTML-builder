const fs = require('fs');
const { stdin: input, stdout: output } = require('process');
const path = require('path');
const fullPath = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(fullPath, 'utf-8');
const readline = require('readline');

const rl = readline.createInterface({ input, output });

async function writeToFile(enterText){
  try {
    stream.write(`${enterText.trim()}\n`);
  }
  catch (err){
    console.log(err);
  }
}

rl.setPrompt('Please enter your text:\n');
rl.prompt();

rl.on('line', (textInput) => {
  if(textInput.trim() === 'exit'){
    console.log('Goodbye!\n');
    process.exit();
  }
  writeToFile(textInput).then(function () {
    console.log(`Entered text '${textInput}' written\n`);
    rl.prompt();
  });
});



rl.on('SIGINT', () => {
  console.log('Goodbye!\n');
  process.exit();
});







