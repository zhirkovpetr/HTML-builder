const fs = require('fs/promises');
const path = require('path');
const filesFolder = path.resolve(__dirname, 'files');
const copyFilesFolder = path.join(__dirname, 'files-copy');

async function copyFolder() {
  try {
    await fs.mkdir(copyFilesFolder);
    console.log('Folder created');
  } catch {
    console.log('Folder not created');
  }
  try {
    const file = await fs.readdir(filesFolder);
    if (file.length === 0) {
      console.log('Files not copied');
    }
    for (let i = 0; i < file.length; i++) {
      await fs.copyFile(__dirname + `/files/${file[i]}`, __dirname + `/files-copy/${file[i]}`);
    }
    console.log('Files copied');
  } catch {
    console.log('Error while copying files');
  }
}

copyFolder();