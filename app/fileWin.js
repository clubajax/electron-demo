const {
    ipcMain,
    BrowserWindow
} = require('electron');
const {getFile} = require('./files');
const storage = require('./storage');

let window;
let loaded = false;
function createWindow() {
    return new Promise((success) => {
        if (loaded) {
            success();
            return;
        }
        const x = storage.get('win-x', 10);
        const y = storage.get('win-y', 10);
        window = new BrowserWindow({
            width: 600,
            height: 800,
            x,
            y,
            webPreferences: {
                nodeIntegration: true
            }
        });

        window.loadFile('./app/fileViewer.html');
        window.on('close', () => {
            window = null;
            loaded = false;
        });

        window.webContents.on("did-finish-load", () => {
            loaded = true;
            success();
        });
    });
}

ipcMain.on('open-file', (event, data) => {
    createWindow().then(() => {
        const txt = getFile(data.path);
        window.webContents.send('file-data', {data: txt});
    });
});
