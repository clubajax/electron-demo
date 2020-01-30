const {ipcRenderer} = require('electron');
const dom = require('@clubajax/dom');
const on = require('@clubajax/on');
const form = require('form');

ipcRenderer.on('response-files', (event, data) => {
    renderFiles(data);
});
ipcRenderer.send('request-files', {});

const icons = {
    zip: 'archive',
    pdf: 'file-pdf',
    css: 'file-code',
    js: 'file-code',
    html: 'file-code',
    scss: 'file-code',
    json: 'file-code',
    mov: 'file-video'
};
function getIcon(file) {
    if (file.type === 'dir') {
        return 'folder';
    }
    if (file.name.indexOf('.') === 0) {
        return 'file'; // better: blank
    }
    const ext = file.name.split('.')[1];
    return icons[ext] || 'file'
}
let list;
function renderFiles(data) {
    const parent = dom.byId('files-container');
    dom.clean(parent);
    list = dom('ui-list', {
        html: [dom('li', {
            value: data.parentDir,
            html: [
                dom('ui-icon', {type: 'folder'}),
                dom('span', {html: '..'})
            ]
        }),
            ...data.files.map((file) => dom('li', {
            value: file.path, 
                html: [
                    dom('ui-icon', {type: getIcon(file)}),
                    dom('span', {html: file.name})
            ]
        }))]
    }, parent);
    list.on('change', (e) => {
        ipcRenderer.send('request-files', {currentDir: e.value});
    });
}
