import { remote } from 'electron';
import { print } from './image-ui';
import { openDirectory, saveFile, openPreferences, pasteImage } from './ipcRendererEvents';

function createMenu() {

    const template = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Abrir ubicacion',
                    click() { openDirectory(); },
                    accelerator: 'CmdOrCtrl+O'
                },
                {
                    label: 'Guardar',
                    click() { saveFile(); },
                    accelerator: 'CmdOrCtrl+G'
                },
                {
                    label: 'Preferencias',
                    click() { openPreferences(); },
                    accelerator: 'CmdOrCtrl+,'
                },
                {
                    label: 'Cerrar',
                    role: 'quit'
                },
            ]
        },
        {
            label: 'Edicion',
            submenu: [
                {
                    label: 'Imprimir',
                    click() { print(); },
                    accelerator: 'CmdOrCtrl+P'
                },
                {
                    label: 'Pegar imagen',
                    click() { pasteImage(); },
                    accelerator: 'CmdOrCtrl+T'
                },
            ]
        }
    ];

    const menu = remote.Menu.buildFromTemplate(template);
    remote.Menu.setApplicationMenu(menu);
}

module.exports = createMenu;