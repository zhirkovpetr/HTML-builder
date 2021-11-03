const fs = require('fs');
const {readdir} = require('fs/promises');
const path = require('path');
const fullPath = path.join(__dirname, 'secret-folder');


async function getFiles() {
  const files = await readdir(fullPath, {
    withFileTypes: true,
  });
  for (let i = 0; i < files.length; i++) {
    const pathToFile = path.join(__dirname, `secret-folder/${files[i].name}`);
    const f = path.parse(pathToFile);
    await fs.stat(pathToFile, (err, stats) => {
      if (f.ext.length > 0 && files[i].isFile()) {
        console.log(`${f.name} - ${f.ext.substring(1)} - ${Math.ceil(stats.size / 1024)}kb`);
      }
    });
  }
}

getFiles();



