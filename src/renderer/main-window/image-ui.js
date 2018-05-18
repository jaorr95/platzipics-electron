import url from 'url';
import path from 'path';
import { applyFilter } from './filter';

function addImagesEvents() {
    const thumbs = document.querySelectorAll('li.list-group-item');

    for (let i = 0; i < thumbs.length; i++) {
        thumbs[i].addEventListener('click', function () {
            changeImage(this);
        });
        
    }
}

function changeImage(node) {
    const selected = document.querySelector('li.selected');
    if (selected) {
        selected.classList.remove('selected');
    }
    node.classList.add('selected');
    const image = document.getElementById('image-displayed');
    image.src = node.querySelector('img').src;
    image.dataset.original = image.src;
    document.getElementById('filters').selectedIndex = 0;
}

function searchImages() {
    const searchBox = document.getElementById('search-box');

    searchBox.addEventListener('keyup', function () {
        if (this.value.length > 0) {
            const regex = new RegExp(this.value, 'gi');
            const thumbs = document.querySelectorAll('li.list-group-item img');
            for (let i = 0; i < thumbs.length; i++) {
                const fileUrl = url.parse(thumbs[i].src);
                const fileName = path.basename(fileUrl.pathname);

                if (fileName.match(regex)) {
                    thumbs[i].parentNode.classList.remove('hidden');
                } else {
                    thumbs[i].parentNode.classList.add('hidden');
                }    
            }
            selectFirstImage();
        } else {
            showAll();
            selectFirstImage();
        }
    });

}

function selectFirstImage() {
    const image = document.querySelector('li.list-group-item:not(.hidden)');
    if(image){
        changeImage(image);
        toggleSelectedImage(true);
    } else {
        toggleSelectedImage(false);
    }
    
}

function showAll() {
    const thumbs = document.querySelectorAll('li.list-group-item.hidden');
    for (let i = 0; i < thumbs.length; i++) {
        thumbs[i].classList.remove('hidden');
    }
    selectFirstImage();
}

function toggleSelectedImage(bool){
    const image = document.getElementById('image-displayed').classList;
    if (bool) {
        image.remove('hidden');
    } else {
        image.add('hidden');
    }
}

function filterEvent() {
    const filter = document.getElementById('filters');
    filter.addEventListener('change', function () {
        applyFilter(this.value, document.getElementById('image-displayed'));
    });
}

function clearImages() {
    const oldImages = document.querySelectorAll('li.list-group-item');

    for (let i = 0; i < oldImages.length; i++) {
        oldImages[i].parentNode.removeChild(oldImages[i]);
        
    }
}

function loadImages(images) {
    const imagesList = document.querySelector('ul.list-group');

    for (let i = 0; i < images.length; i++) {
        const node = `
        <li class="list-group-item">
            <img class=" media-object pull-left" src="${images[i].src}" width="32" height="32">
            <div class="media-body">
                <strong>${images[i].filename}</strong>
                <p>${images[i].size}</p>
            </div>
        </li>`;
        imagesList.insertAdjacentHTML('beforeend', node);
        
    }
}

function print() {
    window.print();
}


module.exports = {
    addImagesEvents: addImagesEvents,
    changeImage: changeImage,
    searchImages: searchImages,
    selectFirstImage: selectFirstImage,
    showAll: showAll,
    toggleSelectedImage: toggleSelectedImage,
    filterEvent: filterEvent,
    clearImages: clearImages,
    loadImages:loadImages,
    print: print
};