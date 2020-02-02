const {app} = require('electron');
const ElectronStore = require('electron-store');

const electronStore = new ElectronStore({cwd: app.getPath("userData")});

const storage = {
    get(prop, defaultValue) {
        const value = electronStore.get(prop);
        return value === undefined ? defaultValue : value;
    },
    set(prop, value) {
        electronStore.set(prop, value);
    },
    ensure(prop, value) {
        if (this.has(prop) === undefined) {
            this.set(prop, value);
        }
    },
    has(prop) {
        return electronStore.has(prop);
    },
    clear() {
        electronStore.clear();
    }
};

module.exports = storage;
