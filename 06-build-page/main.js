const fs = require('fs');
const path = require('path');

const pathAssetsSrc = path.join(__dirname, 'assets');
const pathAssetsDest = path.join(__dirname, 'project-dist', 'assets');

/*
fs.cp('./assets', './project-dist/assets', {recursive: true}, ()=> {});*/




function copyDirRecursively(src, dest, callback) {
  fs.readdir(src, handleReadSrcDir);

  function handleReadSrcDir(error, items) {
    if(handleError(error)) return;

    fs.readdir(dest, handleReadDestDir);


    function copyItems() {
      items.forEach((item)=> {
        const itemPathSrc = path.join(src, item);
        const itemPathDest = path.join(dest, item);
        fs.stat(itemPathSrc, (error, stats)=>{
          if(handleError(error)) return;

          if(stats.isFile()){
            fs.copyFile(itemPathSrc, itemPathDest, (error)=>{
              if(handleError(error)) return;

              console.log(`successes file copy ${item}`);
            });
          } else{
            fs.mkdir(itemPathDest, ()=>copyDirRecursively(itemPathSrc, itemPathDest));
          }
        });
      });
    }

    function handleReadDestDir(error) {
      if(handleError(error)) {
        fs.mkdir(pathAssetsDest, {recursive: true}, copyItems);
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

copyDirRecursively(pathAssetsSrc, pathAssetsDest);

