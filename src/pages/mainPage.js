import MainPageTemplate from '../templates/Main.hbs';
import listTemplate from '../templates/movieListItem.hbs';

import trendsApi from '../services/apiRequestTrendings';
import tmdbApi from '../services/apiRequestMain';

import notFoundImage from '../images/NotFoundActor.png';

import {
  ROOT_DOM,
  headerItemRef,
  homeRef
} from '../constants';

const refs = {};
let buttonsArrRef = [];

function renderBaseMarkup() {
  ROOT_DOM.innerHTML = MainPageTemplate();
}

function renderMoviesListData(moviesList) {
  const markup = listTemplate(moviesList);
  refs.moviesList.innerHTML = markup;
}

async function nextPageBtnHandler() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });

  tmdbApi.incrementPage();

  if (tmdbApi.query === '') {
    return;
  }

  const data = await tmdbApi.fetchRequest();
  const parsedData = dataParser(data.results);

  renderMoviesListData(parsedData);

  const currentPage = data.page;
  const maxPage = data.total_pages;

  buttonLocker(currentPage, maxPage);
}

async function prevPageBtnHandler() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });

  if (tmdbApi.page === 1) {
    return;
  }

  tmdbApi.decrementPage();

  if (tmdbApi.query === '') {
    return;
  }

  const data = await tmdbApi.fetchRequest();
  const parsedData = dataParser(data.results);

  renderMoviesListData(parsedData);

  const currentPage = data.page;
  const maxPage = data.total_pages;

  buttonLocker(currentPage, maxPage);
}

function updatePageNumber(num) {
  refs.listControls.querySelector('.page-number-value').textContent = num;
}

function buttonLocker(currentPage, maxPage) {
  const prevBtn = buttonsArrRef[0];
  const nextBtn = buttonsArrRef[1];

  updatePageNumber(currentPage, maxPage);

  if (currentPage === 1) {
    prevBtn.disabled = true;
    nextBtn.disabled = false;

    prevBtn.classList.remove('control-btn');
    prevBtn.classList.add('non-visible');

    nextBtn.classList.remove('non-visible');
    nextBtn.classList.add('control-btn');
  } else if (currentPage === maxPage) {
    prevBtn.disabled = false;
    nextBtn.disabled = true;

    nextBtn.classList.remove('control-btn');
    nextBtn.classList.add('non-visible');

    prevBtn.classList.remove('non-visible');
    prevBtn.classList.add('control-btn');
  } else {
    nextBtn.disabled = false;
    prevBtn.disabled = false;

    prevBtn.classList.remove('non-visible');
    nextBtn.classList.remove('non-visible');
    prevBtn.classList.add('control-btn');
    nextBtn.classList.add('control-btn');
  }
}

function listControlsHandler(e) {
  const actionType = e.target.closest('button').dataset.action;

  if (actionType === 'increment') {
    nextPageBtnHandler();
  } else {
    prevPageBtnHandler();
  }
}

function dataParser(array) {
  return array.map(el => {
    return {
      id: el.id,
      originalTitle: el.original_title,
      img: el.poster_path !== null ?
        `https://image.tmdb.org/t/p/original${el.poster_path}` : notFoundImage,
      title: el.title,
      year: el.release_date === undefined ?
        'unknown' : el.release_date.substr(0, 4),
      vote: el.vote_average,
    };
  });
}

function navigateToDetailPage(event) {
  event.preventDefault();
  window['router'].navigate(
    event.target.closest('li').querySelector('a').getAttribute('href'),
  );
}

async function inputFormHandler(e) {
  e.preventDefault();

  refs.listControls.querySelector('.page-number-value').textContent = 1;
  refs.listControls.classList.remove('non-visible');

  buttonsArrRef.forEach(btn => (btn.disabled = true));
  buttonsArrRef.forEach(btn => btn.classList.remove('control-btn'));
  buttonsArrRef.forEach(btn => btn.classList.add('non-visible'));

  const input = e.currentTarget.querySelector('input');
  const inputValue = input.value;
  const parsedValue = inputValue.split(' ').join('+');

  if (parsedValue === '') {
    return;
  }

  tmdbApi.resetPage();
  tmdbApi.searchQuery = parsedValue;

  const data = await tmdbApi.fetchRequest();

  if (data.total_results === 0) {
    refs.emptyFilms = document.querySelector(".empty-films");
    refs.listControls.classList.add("non-visible");
    refs.moviesList.innerHTML = "";
    refs.emptyFilms.textContent = ("Films not founds");
    refs.emptyFilms.classList.remove("non-visible");
    return;
  }

  if(data.total_pages === 1) {
    refs.listControls.classList.add("non-visible");
  }
  const parsedData = dataParser(data.results);

  renderMoviesListData(parsedData);

  const isCurrentPageLast = data.page === data.total_pages;
  const isTotalPagesEmpty = data.total_pages === 0;

  if (isCurrentPageLast || isTotalPagesEmpty) {
    return;
  }

  buttonsArrRef[1].disabled = false;
  buttonsArrRef[1].classList.remove('non-visible');
  buttonsArrRef[1].classList.add('control-btn');
}

async function MainPage() {
  headerItemRef.forEach(el => {
    el.classList.remove('header__item--active')
  });
  homeRef.classList.add('header__item--active');
  renderBaseMarkup();

  refs.inputForm = document.querySelector('#search-form');
  refs.moviesList = document.querySelector('.films-list');
  refs.listControls = document.querySelector('.list-controls');

  const data = await trendsApi();
  const parsedData = dataParser(data);

  renderMoviesListData(parsedData);

  refs.inputForm.addEventListener('submit', inputFormHandler);
  refs.listControls.addEventListener('click', listControlsHandler);
  refs.moviesList.addEventListener('click', navigateToDetailPage);

  buttonsArrRef = refs.listControls.querySelectorAll('button');

  buttonsArrRef.forEach(btn => (btn.disabled = true));
  buttonsArrRef.forEach(btn => btn.classList.remove('control-btn'));
  buttonsArrRef.forEach(btn => btn.classList.add('non-visible'));

  refs.listControls.classList.add('non-visible');
}

export default MainPage;
