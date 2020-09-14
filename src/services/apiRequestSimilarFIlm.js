import { BASE_URL, API_KEY } from '../constants';

async function fetchSimilarFilm(id) {
  const requestParam = `${BASE_URL}/3/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`;
  const movie = await fetch(requestParam);
  const dataFilm = movie.json();
  return dataFilm;
}

export default fetchSimilarFilm;
