
import { setIpc, openDirectory, saveFile, openPreferences, pasteImage } from './main-window/ipcRendererEvents';
import { addImagesEvents, searchImages, filterEvent, print }  from './main-window/image-ui';
import createMenu  from './main-window/menu';


window.addEventListener('load', () => {
    // document.getElementById('mensaje').innerHTML = 'HOLA SOY EL JS xd'
    createMenu();
    setIpc();
    addImagesEvents();
    searchImages();
    filterEvent();
    buttonEvent('open-directory', openDirectory);
    buttonEvent('save-button', saveFile);
    buttonEvent('open-preferences', openPreferences);
    buttonEvent('print-button', print);
    buttonEvent('paste-button', pasteImage);
    
});

function buttonEvent(id, func) {
    const element = document.getElementById(id);
    element.addEventListener('click', func);
}
