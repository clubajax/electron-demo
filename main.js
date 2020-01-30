const {
    app,
    ipcMain,
    BrowserWindow
} = require('electron');
const path = require('path');
const {getFiles} = require('./app/files');
require('./app/fileWin');

let window;

function createWindow() {
    // Create the browser window.
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    window.loadFile('index.html');

    window.webContents.openDevTools();
}

ipcMain.on('request-files', (event, {currentDir = __dirname}) => {
    const parentDir = path.resolve(currentDir, '..');
    const files = getFiles(currentDir);
    const result = {
        currentDir,
        parentDir,
        files
    };
    window.webContents.send('response-files', result);
});

app.on('ready', createWindow);
