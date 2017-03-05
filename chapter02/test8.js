var path = require('path');

// 디렉토리 경로 
var directories = ['users', 'kj', 'docx'];
var docsDirectory = directories.join(path.sep);
console.log('Seperator : %s', path.sep);
console.log('Directory of Docs: %s', docsDirectory);

// 파일 경로
var curPath = path.join('/User/kj', 'vscode.app');
console.log('File Path : %s', curPath);

var filename = 'c:/Users/kj/vscode.app';
var dirname = path.dirname(filename);
var basename = path.basename(filename);
var extname = path.extname(filename);

console.log('Directory : %s, Filename : %s, Extention : %s', dirname, basename, extname);
