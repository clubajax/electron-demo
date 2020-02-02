const {
    app,
    ipcMain,
    BrowserWindow
} = require('electron');
const path = require('path');
const {getFiles} = require('./app/files');
const storage = require('./app/storage');
require('./app/fileWin');

let window;

function createWindow() {
    // Create the browser window.
    const x = storage.get('main-x', 10);
    const y = storage.get('main-y', 10);
    window = new BrowserWindow({
        width: 800,
        height: 600,
        x,
        y,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    window.loadFile('index.html');

    window.on("moved", () => {
        const pos = window.getPosition();
        storage.set('main-x', pos[0]);
        storage.set('main-y', pos[1]);
    });

    // window.webContents.openDevTools();
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
