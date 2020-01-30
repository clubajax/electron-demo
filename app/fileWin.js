const {
    ipcMain,
    BrowserWindow
} = require('electron');
const {getFile} = require('./files');

function createWindow() {
    // Create the browser window.
    window = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    window.loadFile('./app/fileViewer.html');

    // window.webContents.openDevTools();
}

ipcMain.on('open-file', (event, data) => {
    createWindow();
    window.webContents.on("did-finish-load", () => {
        const txt = getFile(data.path);
        window.webContents.send('file-data', {data: txt});
    });
});
