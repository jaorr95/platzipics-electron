import { enableLiveReload } from 'electron-compile';
/*
export class Devtools {

    static liveReload () {
        enableLiveReload();
    }

    static debug () {
        // eslint-disable-next-line
        require('electron-debug')({showDevTools: true});
    }

}*/

function liveReload () {
    enableLiveReload();
}

function debug () {
    // eslint-disable-next-line
    require('electron-debug')({showDevTools: true});
}

module.exports = {
    liveReload: liveReload,
    debug: debug
};