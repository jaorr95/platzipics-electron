import { ipcRenderer, remote, clipboard } from 'electron';
import settings from 'electron-settings';
import { clearImages, loadImages, selectFirstImage, addImagesEvents }  from './image-ui';
import path from 'path';
import { saveImage } from './filter';
import os from 'os';

function setIpc() {

    if (settings.has('directory')){
        ipcRenderer.send('load-directory', settings.get('directory'));
    }
    ipcRenderer.on('load-images', (event, dir, images) => {
        console.log(images);
        clearImages();
        loadImages(images);
        selectFirstImage();
        addImagesEvents();
        settings.set('directory', dir);
        console.log(settings.file());
        setValueFooter(dir);

    });

    ipcRenderer.on('save-file', (event, filename) => {
        console.log(filename);
        saveImage(filename, (err) => {
            if (err) return showDialog('error', 'Platzipics', err.message);
            showDialog('info', 'Platzipics', 'La image se ha guardado');
        });
    });
}

function openDirectory() {
    ipcRenderer.send('open-directory');
}  

function saveFile() {
    const ext = document.getElementById('image-displayed').dataset.original;
    ipcRenderer.send('save-file-dialog', path.extname(ext));
}

function showDialog(type, title, msg) {
    ipcRenderer.send('show-dialog', {type: type, title: title, message: msg});
}

function openPreferences() {
    const BrowserWindow = remote.BrowserWindow;
    const mainWindow = remote.getGlobal('win');
    const prefereceswindow = new BrowserWindow({
        width: 400,
        height: 300,
        title: 'Preferencias',
        center: true,
        frame: false,
        show: false
    });


    if (os.platform() !== 'win32') {
        prefereceswindow.setParentWindow(mainWindow);
    }
    
    prefereceswindow.once('ready-to-show', () => {
        prefereceswindow.show();
        prefereceswindow.focus();
    });
    prefereceswindow.loadURL(`file://${path.join(__dirname, '..')}/preferences.html`);


}

function setValueFooter(value) {
    document.getElementById('directory-footer').innerHTML = value;
}

function pasteImage() {
    const image = clipboard.readImage();
    const data = image.toDataURL();
    if (data.indexOf('data:image/png;base64') !== -1 && !image.isEmpty()) {
        let mainImage = document.getElementById('image-displayed');
        mainImage.src = data;
        mainImage.dataset.original = data;
    } else {
        //showDialog('info', 'Platzipics', 'No hay una imagen valida en el portapapeles');
        const notify = new Notification('Platzipics', {
            body: 'No hay una imagen valida en el portapapeles',
            silent: false
        });
    }
}

module.exports = {
    setIpc: setIpc,
    openDirectory: openDirectory,
    saveFile: saveFile,
    showDialog: showDialog,
    openPreferences: openPreferences,
    pasteImage: pasteImage
};