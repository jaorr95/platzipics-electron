import { app, dialog } from 'electron';

function relaunchApp(win) {
    dialog.showMessageBox(win, {
        type: 'error',
        title: 'Platzipics',
        message: 'Ocurrio un error inesperado, se reiniciara el aplicativo.'
    }, () => {
        app.relaunch();
        app.exit(0);
    });
}

function setupErrors(win) {
    win.webContents.on('crashed', () => {
        relaunchApp(win);
    });

    win.on('unresponsive', () => {
        dialog.showMessageBox(win, {
            type: 'warning',
            title: 'Platzipics',
            message: 'Un proceso no responde. Puede esperar o reiniciar la aplicacion de forma manual'
        });
    });

    // eslint-disable-next-line
    process.on('uncaughtException', () => {
        relaunchApp(win);
    });

}

// eslint-disable-next-line
module.exports = setupErrors;