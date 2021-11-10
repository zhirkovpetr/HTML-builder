const fs = require('fs');
const path = require('path');
const filesFolder = path.resolve(__dirname, 'files');
const copyFilesFolder = path.join(__dirname, 'files-copy');

function copyDirRecursively(src, dest, callback) {
  fs.readdir(src, handleReadSrcDir);

  function handleReadSrcDir(error, items) {
    if (handleError(error)) return;

    fs.readdir(dest, handleReadDestDir);


    function copyItems() {
      items.forEach((item) => {
        const itemPathSrc = path.join(src, item);
        const itemPathDest = path.join(dest, item);

        fs.stat(itemPathSrc, (error, stats) => {

          if (handleError(error)) return;

          if (stats.isFile()) {
            fs.copyFile(itemPathSrc, itemPathDest, (error) => {
              if (handleError(error)) return;
              console.log('Files copied');
            });
          } else {
            fs.mkdir(itemPathDest, () => copyDirRecursively(itemPathSrc, itemPathDest));
          }
        });

      });
    }

    function handleReadDestDir(error) {
      if (handleError(error)) {
        fs.mkdir(copyFilesFolder, {recursive: true}, copyItems);

      } else {
        copyItems();
      }
    }
  }

  callback && callback();
}

function handleError(error) {
  error ? console.log(error) : null;
  return !!error;
}

fs.mkdir(copyFilesFolder, {recursive: true}, (error) => {
  if (handleError(error)) {
    console.error(error);
    copyDirRecursively(filesFolder, copyFilesFolder);
    console.log('Folder created');
  } else {
    removeDir(createDir);
  }
});

function createDir() {
  fs.mkdir(copyFilesFolder, { recursive: true }, () => {});
  copyDirRecursively(filesFolder, copyFilesFolder);
}

function removeDir(callback) {
  fs.rm(copyFilesFolder, { recursive: true }, (err) => {
    if (err) throw err;
    callback();
  });
}
