import getFilmId from '../utilites/parseQueryString';
import { BASE_URL, API_KEY } from '../constants';

function fetchFilmData() {
  let filmId = getFilmId();
  return fetch(
    `${BASE_URL}/3/movie/${filmId}?api_key=${API_KEY}&language=en-US`,
  ).then(data => data.json());
}

export default fetchFilmData;
