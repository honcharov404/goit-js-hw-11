const BASE_URL = 'https://pixabay.com/api/';
const KEY = '31088798-33c99e8eaf6238e9b90f1afa9';

export default class PicturesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchPictures() {
    const url = `${BASE_URL}?key=${KEY}&image_type=photo&orientation=horizontal&safesearch=true&q=${this.searchQuery}&page=${this.page}`;

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.incrementPage();

        return data;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
