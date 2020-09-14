import btnQueueWatched from '../templates/btnQueueWatched.hbs';
import { ROOT_DOM } from '../constants';

const libraryPage = () => {
  const markupLibrary = btnQueueWatched();
  ROOT_DOM.innerHTML = markupLibrary;

  const buttonsContainerRefs = document.querySelector('.library__buttons');
  const buttonsArrayRefs = document.querySelectorAll('.library__btn');

  buttonsContainerRefs.addEventListener('click', handleButtonClick);

  function handleButtonClick(e) {
    if (!e.target.dataset.action) {
      return;
    }
    if(e.target.dataset.action === 'watched'){
        window['router'].navigate('library/watched');
        buttonsArrayRefs.forEach(el=>{
            el.classList.remove('active');
        })
        e.target.classList.add('active');
    }
    if(e.target.dataset.action === 'queue'){
        window['router'].navigate('library/queue');
        buttonsArrayRefs.forEach(el=>{
            el.classList.remove('active');
        })
        e.target.classList.add('active');
    }
  }
};

export default libraryPage;
