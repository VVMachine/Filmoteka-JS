import { BASE_URL, API_KEY } from '../constants';

async function fetchFilm(id) {
  const requestParam = `${BASE_URL}/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`;
  const movie = await fetch(requestParam);
  const dataFilm = movie.json();
  return dataFilm;
}

export default fetchFilm;
