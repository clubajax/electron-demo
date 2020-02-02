const {
    ipcMain,
    BrowserWindow
} = require('electron');
const {getFile} = require('./files');
const storage = require('./storage');

function createWindow() {
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

    // and load the index.html of the app.
    window.loadFile('./app/fileViewer.html');

    window.on("moved", () => {
        const pos = window.getPosition();
        storage.set('win-x', pos[0]);
        storage.set('win-y', pos[1]);
    });
}

ipcMain.on('open-file', (event, data) => {
    createWindow();
    window.webContents.on("did-finish-load", () => {
        const txt = getFile(data.path);
        window.webContents.send('file-data', {data: txt});
    });
});
