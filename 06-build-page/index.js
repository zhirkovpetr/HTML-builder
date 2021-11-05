const fs = require('fs');
const path = require('path');
const pathTemplate = path.join(__dirname, 'template.html');
const pathDirectory = path.join(__dirname, 'project-dist');
const pathComponents = path.join(__dirname, 'components');
const pathStyles = path.join(__dirname, 'styles');
const pathCss = path.join(__dirname, 'project-dist', 'style.css');
const pathAssetsSrc = path.join(__dirname, 'assets');
const pathAssetsDest = path.join(__dirname, 'project-dist', 'assets');


function allSaveHtml() {
  fs.readFile(pathTemplate, 'utf8', (err, html) => {
    if (err) throw err;
    fs.readdir(pathComponents, (err, items) => {
      if (err) throw err;
      for (let i = 0; i < items.length; i++) {
        if (path.extname(items[i]) === '.html') {
          let name = items[i].split('.')[0];
          const templateNameRe = new RegExp(`{{${name}}}`);

          fs.readFile(path.join(pathComponents, items[i]), 'utf8', (err, data) => {
            if (err) throw err;

            html = html.replace(templateNameRe, data);

            fs.writeFile(path.join(pathDirectory, 'index.html'), html, (err) => {
              if (err) throw err;
            });
          });
        }
      }
    });
  });
}


function allSaveStyles() {
  fs.readdir(pathStyles, (err, items) => {
    if (err) throw err;

    for (let i = 0; i < items.length; i++) {
      if (path.extname(items[i]) === '.css') {
        fs.readFile(path.join(pathStyles, items[i]), (err, data) => {
          if (err) throw err;

          fs.appendFile(pathCss, data, (err) => {
            if (err) throw err;
          });
        });
      }
    }
  });
}

function updateAllSaveStyles() {
  fs.unlink(pathCss, () => {
    allSaveStyles();
  });
}




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






// build page
fs.mkdir(pathDirectory, {recursive: true}, (err) => {
  if (err) {
    return console.error(err);
  }

  allSaveHtml();
  updateAllSaveStyles();
  copyDirRecursively(pathAssetsSrc, pathAssetsDest);
});