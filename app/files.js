const path = require('path');
const fs = require('fs');

const exclude = ''.split(',');

function writeFiles(files) {
    let count = 0;
    files.forEach((file) => {
        if (file.changed) {
            fs.writeFileSync(file.path, file.data);
            count++;
        }
    });
}

function readPages(ROOT) {
    const filePaths = [];
    getFilePaths(ROOT, filePaths);
    const files = getFiles(filePaths);
    return files;
}

function getFiles(filePaths) {
    const files = filePaths
        .filter(filePath => filePath.indexOf('.htm') > -1)
        .map((filePath) => {
            return {
                path: filePath,
                name: getFileName(filePath),
                data: fs.readFileSync(filePath).toString(),
                changed: false
            }
        });
    addHelpers(files);
    return files;
}
function getFilePaths(dir, collection) {
    let files;
    if (fs.lstatSync(dir).isDirectory() && notExcluded(dir)) {
        files = fs.readdirSync(dir);
        files.forEach(function (file) {
            if (file.indexOf('.') !== 0) {
                const curFile = path.join(dir, file);
                if (fs.lstatSync(curFile).isDirectory()) {
                    getFilePaths(curFile, collection);
                } else {
                    collection.push(curFile);
                }
            }
        });
    }
}

function notExcluded(dir) {
    const dirName = getFileName(dir);
    return !exclude.includes(dirName);
}

function getFileName(filePath) {
    return filePath.split(path.sep)[filePath.split(path.sep).length - 1].replace('.html', '');
}

function addHelpers(files) {
    files.get = (name) => {
        if (/\.html/.test(name)) {
            name = name.replace('.html', '');
        }
        return files.find(file => file.name === name);
    };
}

function getFiles(dir) {
    if (fs.lstatSync(dir).isDirectory() && notExcluded(dir)) {
        const files = [];
        fs.readdirSync(dir).forEach((fileName) => {
            if (fileName.indexOf('.') !== 0) {
                const filePath = path.join(dir, fileName);
                    files.push({
                        type: fs.lstatSync(filePath).isDirectory() ? 'dir' : 'file',
                        name: fileName,
                        path: filePath
                    });
            }
        });
        return files;
    }
    return 'invalid directory';
}

function getFile(filePath) {
    return fs.readFileSync(filePath).toString();
}

module.exports = {
    getFile,
    getFiles,
    readPages,
    writeFiles
};
