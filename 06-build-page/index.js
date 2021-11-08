const fs = require('fs');
const path = require('path');
const pathTemplate = path.join(__dirname, 'template.html');
const pathDirectory = path.join(__dirname, 'project-dist');
const pathComponents = path.join(__dirname, 'components');
const pathStyles = path.join(__dirname, 'styles');
const pathCss = path.join(__dirname, 'project-dist', 'style.css');
const pathAssetsSrc = path.join(__dirname, 'assets');
const pathAssetsDest = path.join(__dirname, 'project-dist', 'assets');


function copyAllHtml() {
  fs.readFile(pathTemplate, 'utf8', (error, html) => {
    if (handleError(error)) return;
    fs.readdir(pathComponents, (error, items) => {
      if (handleError(error)) return;
      items.forEach((item) => {
        if (path.extname(item) === '.html') {
          let name = item.split('.')[0];
          const templateNameRe = new RegExp(`{{${name}}}`);

          fs.readFile(path.join(pathComponents, item), 'utf8', (error, data) => {
            if (handleError(error)) return;

            html = html.replace(templateNameRe, data);

            fs.writeFile(path.join(pathDirectory, 'index.html'), html, (error) => {
              if (handleError(error)) return;
            });
          });
        }
      });
    });
  });
}

function copyAllStyles() {
  fs.readdir(pathStyles, (error, items) => {
    if (handleError(error)) return;
    items.forEach((item) => {
      if (path.extname(item) === '.css') {
        fs.readFile(path.join(pathStyles, item), (error, data) => {
          if (handleError(error)) return;
          fs.appendFile(pathCss, data, (error) => {
            if (handleError(error)) return;
          });
        });
      }
    });
  });
}

function updateAllStyles() {
  fs.unlink(pathCss, () => {
    copyAllStyles();
  });
}

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
            });
          } else {
            fs.mkdir(itemPathDest, () => copyDirRecursively(itemPathSrc, itemPathDest));
          }
        });
      });
    }

    function handleReadDestDir(error) {
      if (handleError(error)) {
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

/* Можно заменить одной строкой
fs.cp('./assets', './project-dist/assets', {recursive: true}, ()=> {});*/


fs.mkdir(pathDirectory, {recursive: true}, (error) => {
  if (handleError(error)) console.error(error);

  copyAllHtml();
  updateAllStyles();
  copyDirRecursively(pathAssetsSrc, pathAssetsDest);
});