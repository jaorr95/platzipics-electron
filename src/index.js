'use strict';

// el objeto es el que controla todo en electron
// browser module el objeto a traves del cual podemos crear ventana
import { app, BrowserWindow, Tray, protocol } from 'electron';
import { liveReload, debug } from './devtools';
import handleErrors from './handle-errors';
import setIpcMain from './ipcMainEvents';
import os from 'os';
import path from 'path';

global.win = null;
global.tray = null;

if (process.env.NODE_ENV === 'development') {
    liveReload();
    debug();
}

app.on('before-quit', () => {
    console.log('Saliendo...');
});

// para poder abrir una ventana se debe esperar a el objeto este listo
app.on('ready', () => {

    protocol.registerFileProtocol('plp', (request, callback) => {
        let url = request.url.substr(6);
        url = decodeURIComponent(url.replace(/\+/g, ' '));
        callback({path: path.normalize(url)});
    }, (error) => {
        if (error) throw error;
    });

    global.win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Platzipics',
        center: true,
        maximizable: false, // no funciona en linux
        show: false,
        icon: path.join(__dirname, 'assets', 'icons', 'main-icon.png') //solo en linux?
    });

    setIpcMain(global.win);
    handleErrors(global.win);

    global.win.once('ready-to-show', () => {
        global.win.show();
    });

    /*
    global.win.on('move', () => {
        const position = global.win.getPosition();
        console.log(position);
    })
    */

    global.win.on('closed', () => {
        global.win = null;
        app.quit();
    });

    let icon = null;
    if (os.platform() === 'win32') {
        icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.ico');
    } else {
        icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.png');
    }


    global.tray = new Tray(icon);

    global.tray.setToolTip('Platzipics');

    global.tray.on('click', () => {
        global.win.isVisible() ? global.win.hide() : global.win.show();
    });

    //global.win.loadURL('http://devdocs.io');
    //global.win.loadURL('https://xel-toolkit.org/fallback.html');
    //global.win.openDevTools();
    global.win.loadURL(`file://${__dirname}/renderer/index.html`);
});