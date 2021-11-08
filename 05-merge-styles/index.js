const fsPromis = require('fs/promises');
const fs = require('fs');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const distDirectory = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(distDirectory, '', (err) => {
  if (err) throw err;
});

async function copyStyles() {
  const files = await fsPromis.readdir(stylesFolder, {withFileTypes: true});
  files.forEach(item => {
    if (item.isFile() && path.extname(item.name) === '.css') {
      const pathFile = path.join(stylesFolder, `${item.name}`);
      fs.readFile(pathFile, 'utf-8', (error, data) => {
        if (handleError(error)) return;
        fs.appendFile(distDirectory, data, (error) => {
          if (handleError(error)) return;
        });
      }
      );
    }
  });
}

function handleError(error) {
  error ? console.log(error) : null;
  return !!error;
}

copyStyles();