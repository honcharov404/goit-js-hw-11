import './css/styles.css';
import PicturesApiService from './js/pictures-service';
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
    createGalleryMarkup(data.hits);
    showLoadMoreBtn();
  });
}

function onLoadMore() {
  picturesApiService
    .fetchPictures()
    .then(data => createGalleryMarkup(data.hits));
}

function createGalleryMarkup(hits) {
  const hitsMarkup = hits
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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

  gallery.insertAdjacentHTML('beforeend', hitsMarkup);
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
