import movieListItem from '../templates/movieListItem.hbs';
import btnQueueWatched from '../templates/btnQueueWatched.hbs';
import { ROOT_DOM, libraryRef, headerItemRef } from '../constants';

const libraryPageQueue = () => {
  headerItemRef.forEach(el => {
    el.classList.remove('header__item--active')
  });
  libraryRef.classList.add('header__item--active');
  
  const markupLibrary = btnQueueWatched();
  ROOT_DOM.innerHTML = markupLibrary;

  document.querySelector('button[data-action="queue"]').classList.add('active');

  const buttonsContainerRefs = document.querySelector('.library__buttons');
  const filmListRef = document.querySelector('.films-list');

  buttonsContainerRefs.addEventListener('click', handleButtonClick);

  const filmsQueue = localStorage.getItem('filmsQueue');

  const filmsArray = JSON.parse(localStorage.getItem('filmsQueue'));
  const emptyFilms = document.querySelector('.empty-films');
  
  if (filmsQueue === null || filmsArray.length === 0){
    emptyFilms.textContent = 'You dont have films in queue. Add them.';
    emptyFilms.classList.remove('non-visible');
    
};

  if (filmsQueue) {
     const markup = movieListItem(filmsArray);

     filmListRef.innerHTML = markup;
  }

  filmListRef.addEventListener('click', e => {
    e.preventDefault();
    window['router'].navigate(
      e.target.closest('li').querySelector('a').getAttribute('href'),
    );
  });
};

function handleButtonClick(e) {
  if (!e.target.dataset.action) {
    return;
  }
  if (e.target.dataset.action === 'watched') {
    window['router'].navigate('library/watched');
  }
  if (e.target.dataset.action === 'queue') {
    window['router'].navigate('library/queue');
  }
}

export default libraryPageQueue;
