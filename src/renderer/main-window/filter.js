import fs from 'fs-extra';

function applyFilter(filter, image) {
    var imgObj = new Image();
    imgObj.src = image.dataset.original;
    // eslint-disable-next-line
    filterous.importImage(imgObj, {})
        .applyInstaFilter(filter)
        .renderHtml(image);
}

function saveImage(filename, callback) {
    let fileSrc = document.getElementById('image-displayed').src;
    if (filename.indexOf(';base64,') !== -1) {
        fileSrc = fileSrc.replace(/^data:([A-Za-z-+/]+);base64,/,'');
        fs.writeFile(filename, fileSrc, 'base64', callback);
    } else {
        fileSrc = fileSrc.replace('plp://', '');
        fs.copy(fileSrc, filename);
    }
    
    
}

module.exports = {
    applyFilter: applyFilter,
    saveImage: saveImage
};