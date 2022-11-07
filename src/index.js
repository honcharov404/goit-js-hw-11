import './css/styles.css';
import PicturesApiService from './js/pictures-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const formEl = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const picturesApiService = new PicturesApiService();

formEl.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  picturesApiService.query = e.currentTarget.elements.searchQuery.value;
  picturesApiService.resetPage();
  picturesApiService.fetchPictures().then(data => {
    clearGallery();
    createGallery(data.hits);
    showLoadMoreBtn();
  });
}

function onLoadMore() {
  picturesApiService.fetchPictures().then(data => {
    createGallery(data.hits);
  });
}

function createGalleryMarkup(hits) {
  return hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="gallery__item">
            <a class="gallery__link" href="${largeImageURL}"><img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
            <div class="info">
                <p class="info-item">
                    <b>Likes: ${likes}</b>
                </p>
                <p class="info-item">
                    <b>Views: ${views}</b>
                </p>
                <p class="info-item">
                    <b>Comments: ${comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads: ${downloads}</b>
                </p>
            </div>
        </div>`
    )
    .join('');
}

function createGallery(hits) {
  gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));
  let galleryBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  galleryBox.refresh();
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('hide');
}

function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('hide');
}
