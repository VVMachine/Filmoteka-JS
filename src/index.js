import './styles.css';
import './styles/library.css';
import './styles/mainPage.css';
import './styles/FilmPage.css';
import './styles/slider.css';
import './styles/desktopHeaderFooter.css';
import './styles/mobileHeaderFooter.css';
import './styles/tabletHeaderFooter.css';
import './styles/teamPage.css';
import Router from './utilites/router';
import MainPage from './pages/mainPage';
import FilmPage from './pages/filmDetailPage';
import libraryPageWatched from './pages/libraryPageWatched.js';
import libraryPageQueue from './pages/libraryPageQueue.js';
import teamPage from './pages/teamPage';


import initScrollToTop from './utilites/scrollToTop';
import initNavigation from './utilites/navigation';
import navigateToTeamPage from './utilites/navigateToTeamPage';

navigateToTeamPage();
initNavigation();
initScrollToTop();

window['router'] = new Router({
  root: '/',
  routes: [
    {
      path: /film\/(.*)/,
      callback: () => {
        FilmPage();
      },
    },
    {
      path: 'library/watched',
      callback: () => {
        libraryPageWatched();
      },
    },
    {
      path: 'library/queue',
      callback: () => {
        libraryPageQueue();
      },
    },
    {
      path: 'developers',
      callback: () => {
        teamPage();
      },
    },
    {
      path: '',
      callback: () => {
        MainPage();
      },
    },
  ],
});
