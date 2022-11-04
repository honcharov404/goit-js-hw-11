import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '31088798-33c99e8eaf6238e9b90f1afa9';
const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.input');
const gallery = document.querySelector('.gallery');
const btnLoadmore = document.querySelector('.load-more');
let page = 1;
const perPage = 40;
formEl.addEventListener('submit', itemsGallery);
btnLoadmore.addEventListener('click', itemsGallery);

function itemsGallery(e) {
  e.preventDefault();

  const inputValue = inputEl.value;

  if (inputValue === '') {
    updateGallery();
    return;
  }

  if (e.type === 'click') {
    page += 1;
  }

  if (e.type === 'submit') {
    updateGallery();
    page = 1;
  }

  dataLibrary(inputValue);
}
const dataLibrary = async inputValue => {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
    );

    if (response.data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      updateGallery();
      return;
    }

    insertContent(response.data.hits, response.data.totalHits);
    btnLoadmore.classList.remove('hide');

    if (response.data.totalHits < page * perPage) {
      btnLoadmore.classList.add('hide');
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
};

function notifications(totalHits) {
  Notify.info(`Hooray! We found ${totalHits} images.`);
}

function updateGallery() {
  btnLoadmore.classList.add('hide');
  gallery.innerHTML = '';
}

function createGallery(item) {
  return `<div class="photo-card">
  <img class='image'src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
    <ul class="info">
        <li class="info-item">
            <h2> Likes</h2>
            <p class="item-span">${item.likes}</p>
        </li>
        <li class="info-item">
            <h2> Views</h2>
            <p class="item-span">${item.views}</p>
        </li>
        <li class="info-item">
            <h2> Comments</h2>
            <p class="item-span">${item.comments}</p>
        </li>
        <li class="info-item">
            <h2> Downloads</h2>
            <p class="item-span">${item.downloads}</p>
        </li>
    </ul>
</div>`;
}

const generateContent = array =>
  array.reduce((acc, item) => acc + createGallery(item), '');

const insertContent = (array, totalHits) => {
  const result = generateContent(array);

  gallery.insertAdjacentHTML('beforeend', result);
  if (page === 1) {
    notifications(totalHits);
  }
};
