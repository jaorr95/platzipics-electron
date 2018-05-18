import { remote } from 'electron';
import settings from 'electron-settings';
import { showDialog } from './main-window/ipcRendererEvents';
import crypto from 'crypto';

window.addEventListener('load', () => {
    cancelButton();
    saveButton();

    if (settings.has('cloudup.user')) {
        document.getElementById('cloudup-user').value = settings.get('cloudup.user');
    }

    if (settings.has('cloudup.passwd')) {
        document.getElementById('cloudup-passwd').value = decrypt(settings.get('cloudup.passwd'));
    }
});

function cancelButton() {
    const cancelButton = document.getElementById('cancel-button');

    cancelButton.addEventListener('click', () => {
        const prefsWindow = remote.getCurrentWindow();
        prefsWindow.close();
    });
}

function saveButton() {
    const saveButton = document.getElementById('save-button');
    const prefsForm = document.getElementById('preferences-form');

    saveButton.addEventListener('click', (e) => {
        e.preventDefault();
        if(prefsForm.reportValidity()){
            settings.set('cloudup.user', document.getElementById('cloudup-user').value);
            settings.set('cloudup.passwd', encrypt(document.getElementById('cloudup-passwd').value));
            const prefsWindow = remote.getCurrentWindow();
            prefsWindow.close();
        } else {
            showDialog('error', 'PlatziPics', 'Debe llenar los campos de email y contrasena');
        }
        
    });
}

function encrypt(value) {
    const cipher = crypto.createCipher('aes192', 'Platzipics');
    let encrypted = cipher.update(value);
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(value) {
    const decipher = crypto.createDecipher('aes192', 'Platzipics');
    let decrypted = decipher.update(value, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}