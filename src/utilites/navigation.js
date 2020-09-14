export default function initNavigation() {
  const headerImageLink = document.querySelector('.header__img-link');
  const headerItemsLinks = document.querySelector('.header__items');

  headerImageLink.addEventListener('click', handleLogoClick);
  headerItemsLinks.addEventListener('click', handleMenuClick);
}

function handleLogoClick(event) {
  event.preventDefault();
  window['router'].navigate('');
}

function handleMenuClick(event) {
  event.preventDefault();

  if (!event.target.dataset.action) {
    return;
  }
  if (event.target.dataset.action === 'home') {
    window['router'].navigate('');
    return;
  }
  if (event.target.dataset.action === 'library') {
    window['router'].navigate(event.target.getAttribute('href'));
    return;
  }
}
