import { BASE_URL, API_KEY } from '../constants';

export default {
  query: '',
  page: 1,

  fetchRequest() {
    const requestParams = `/3/search/movie?api_key=${API_KEY}&query=${this.query}&page=${this.page}`;

    return fetch(BASE_URL + requestParams)
      .then(resp => resp.json())
      .then(data => {
        return data;
      });
  },

  get searchQuery() {
    return this.query;
  },

  set searchQuery(string) {
    this.query = string;
  },

  incrementPage() {
    this.page += 1;
  },

  decrementPage() {
    this.page -= 1;
  },

  resetPage() {
    this.page = 1;
  },
};
