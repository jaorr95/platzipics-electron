import { ipcMain, dialog } from 'electron';
import fs from 'fs';
import isImage from 'is-image';
import filesize from 'filesize';
import path from 'path';


function setIpcMain(win) {
    ipcMain.on('ping', (event, args) => {
        console.log(`Se recibio ping - ${args}`);
        event.sender.send('pong', new Date());
    });
    
    ipcMain.on('open-directory', (event) =>{
    
        dialog.showOpenDialog(win, {
            title: 'Seleccione la nueva ubicacion',
            buttonLabel: 'Abrir ubicacion',
            properties: ['openDirectory']
        }, 
        (dir) => {
            
            loadImages(event, dir[0]);
            
        });
    
    });
    
    ipcMain.on('save-file-dialog', (event, ext) => {
        console.log(ext);
        dialog.showSaveDialog(win, {
            title: 'Guardar imagen modificada',
            buttonLabel: 'Guardar imagen',
            filters: [{name: 'Imagen', extensions: [ext.substring(1)]}]
        }, 
        (file) => {
            event.sender.send('save-file', file);
        });
    });
    
    ipcMain.on('show-dialog', (event, info) => {
        dialog.showMessageBox(win, {
            type: info.type,
            title: info.title,
            message: info.message
        });
    });

    ipcMain.on('load-directory', (event, dir) => {
        loadImages(event, dir);
    });
}

function loadImages(event, dir) {
    let images = [];
    fs.readdir(dir, (err, files) => {
        if (err) throw err; //TODO que hacer con el error de que no selecciono carpeta
        for (let i = 0; i < files.length; i++) {
            if (isImage(files[i])) {
                let imageFile = path.join(dir, files[i]);
                let stats = fs.statSync(imageFile);
                let size = filesize(stats.size, {round: 0});
                images.push({filename: files[i], src: `plp://${imageFile}`, size: size, protocol: 'plp://'});
            }     
        }
        event.sender.send('load-images', dir, images);
    });

}

module.exports = setIpcMain;
