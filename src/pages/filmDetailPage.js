import FilmPageTemplate from '../templates/Film.hbs';
import WatchVideoTemplate from '../templates/WatchVideoTemplate.hbs';
import filmSliderTemplate from '../templates/filmSliderTemplate.hbs';
import swiper from '../utilites/swiperApiSlider';
import apiRequestFilm from '../services/apiRequestFilm';
import apiRequestVideo from '../services/apiRequestVideo';
import apiSimilarFilm from '../services/apiRequestSimilarFilm';
import notFound from '../images/NotFoundActor.png';
import { ROOT_DOM, homeRef, headerItemRef } from '../constants';

let filmObject;
let btnClose;
let openModal;

const FilmPage = async () => {
  const {
    title,
    poster_path,
    release_date,
    vote_average,
    vote_count,
    popularity,
    genres,
    overview,
    original_title,
    id,
  } = await apiRequestFilm();

  filmObject = {
    img:
      poster_path !== null
        ? `https://image.tmdb.org/t/p/original${poster_path}`
        : notFound,
    title,
    year: release_date === undefined ? 'unknown' : release_date.substr(0, 4),
    vote: vote_average,
    votes: vote_count,
    popularity,
    genres: genres.map(genre => genre.name),
    overview,
    originalTitle: original_title,
    id,
  };
  
  headerItemRef.forEach(el => {
    el.classList.remove('header__item--active')
  });
  homeRef.classList.add('header__item--active');

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });

  const markup = FilmPageTemplate(filmObject);
  ROOT_DOM.innerHTML = markup;

  const swiperWrapperRef = document.querySelector('.swiper-wrapper');
  swiperWrapperRef.addEventListener('click', handleSimilarFilmClick);

  const playBtnRef = document.querySelector('.play-btn');
  playBtnRef.addEventListener('click', watchVideo);

  async function watchVideo() {
    const { results } = await apiRequestVideo(filmObject.id);
    insertItem(...results);
    addEventListenerAndRef();
  }

  async function makeSimilarFilmSlider() {
    const { results, total_results } = await apiSimilarFilm(filmObject.id);
    if(total_results === 0 ){
      const swiperContainerRef = document.querySelector('.swiper-container');
      swiperContainerRef.classList.add('non-visible');
      return;
    }
    const parsedFilms = parseObjectToSimilar(results)
    insertSliderItem(parsedFilms);
    swiper();
  }

  makeSimilarFilmSlider();

  const addWatchBtnRef = document.querySelector('.film__buttons--favorite');
  const addToQueueBtnRef = document.querySelector('.film__buttons--queue');

  checkButtonStatus(filmObject, addWatchBtnRef, 'filmsWatched');
  checkButtonStatus(filmObject, addToQueueBtnRef, 'filmsQueue');
  window.addEventListener('keydown', pressOnKeyboard);
  addWatchBtnRef.addEventListener('click', toggleToWatched);
  addToQueueBtnRef.addEventListener('click', toggleToQueue);
};

function handleSimilarFilmClick(event) {
  event.preventDefault();
  if(!event.target.nodeName === 'IMG'){
    return;
  }

  window['router'].navigate(
    event.target.closest('a').getAttribute('href'),
  );
}

function insertSliderItem(items) {
  const ref = document.querySelector('.swiper-wrapper');
  const markupItems = filmSliderTemplate(items);
  ref.insertAdjacentHTML('beforeend', markupItems);
}

function insertItem(item) {
  const mark = WatchVideoTemplate(item);
  const footerRef = document.querySelector('.footer');
  footerRef.insertAdjacentHTML('afterend', mark);
}

function addEventListenerAndRef() {
  btnClose = document.querySelector('.lightbox__button');
  openModal = document.querySelector('.js-lightbox');
  btnClose.addEventListener('click', removeClassOnClick);
  openModal.addEventListener('click', closeModalOnClick);
}

function removeClassOnClick() {
  openModal.remove();
}
function pressOnKeyboard(event) {
  if (event.key === 'Escape') {
    removeClassOnClick();
  }
}
function closeModalOnClick(event) {
  if (event.target.nodeName !== 'IFRAME') {
    removeClassOnClick();
  }
}

function checkButtonStatus(filmObject, buttonRef, key) {
  const watchedArr = JSON.parse(localStorage.getItem(key));
  if (!watchedArr) {
    return;
  }
  const isInclude = watchedArr.some(el => el.id === filmObject.id);
  let btnContent;

  if (!isInclude) {
    buttonRef.dataset.action = 'add';
    if (key === 'filmsWatched') {
      btnContent = '<i class="fas fa-video icon-blue"></i> Add to watched';
    }
    if (key === 'filmsQueue') {
      btnContent =
        '<i class="far fa-calendar-plus icon-blue"></i> Add to queue';
    }
    buttonRef.innerHTML = btnContent;
  } else {
    buttonRef.dataset.action = 'remove';
    if (key === 'filmsWatched') {
      btnContent =
        '<i class="fas fa-trash-alt icon-blue"></i> Remove from watched';
    }
    if (key === 'filmsQueue') {
      btnContent =
        '<i class="far fa-calendar-times icon-blue"></i> Remove from queue';
    }
    buttonRef.innerHTML = btnContent;
  }
}

function toggleToWatched(event) {
  if (event.target.dataset.action === 'add') {
    toggleLocalStorage('filmsWatched');
    event.target.innerHTML =
      '<i class="fas fa-trash-alt icon-blue"></i> Remove from watched';
    event.target.dataset.action = 'remove';
  } else if (event.target.dataset.action === 'remove') {
    deleteFromLocalStorage('filmsWatched');
    event.target.innerHTML =
      '<i class="fas fa-video icon-blue"></i> Add to watched';
    event.target.dataset.action = 'add';
  }
}

function toggleToQueue(event) {
  if (event.target.dataset.action === 'add') {
    toggleLocalStorage('filmsQueue');
    event.target.innerHTML =
      '<i class="far fa-calendar-times icon-blue"></i> Remove from queue';
    event.target.dataset.action = 'remove';
    return;
  }
  if (event.target.dataset.action === 'remove') {
    deleteFromLocalStorage('filmsQueue');
    event.target.innerHTML =
      '<i class="far fa-calendar-plus icon-blue"></i> Add to queue';
    event.target.dataset.action = 'add';
    return;
  }
}

function deleteFromLocalStorage(key) {
  const filmsWatched = JSON.parse(localStorage.getItem(key));
  const newArray = filmsWatched.filter(el => el.id !== filmObject.id);
  localStorage.setItem(key, JSON.stringify(newArray));
}

function toggleLocalStorage(key) {
  const filmsQueueObj = {
    ...filmObject,
  };
  const localStorageData = localStorage.getItem(key);

  if (!localStorageData) {
    const filmsQueueArr = [filmsQueueObj];
    localStorage.setItem(key, JSON.stringify(filmsQueueArr));
  } else {
    const filmsQueueArr = JSON.parse(localStorageData);
    const isInclude = filmsQueueArr.some(el => filmsQueueObj.id === el.id);
    if (!isInclude) {
      const newFilmQueueArr = [filmsQueueObj, ...filmsQueueArr];
      localStorage.setItem(key, JSON.stringify(newFilmQueueArr));
    }
  }
}

function parseObjectToSimilar (array) {
  const parsedArray =  array.map(({title, id, poster_path}) => ({
    title, 
    id,
    imgPath: poster_path !== null
    ? `https://image.tmdb.org/t/p/original${poster_path}`
    : notFound,
  }))
  return parsedArray;
}

export default FilmPage;
