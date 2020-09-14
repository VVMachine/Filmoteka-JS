function initScrollToTop() {
  const buttonUp = document.querySelector('.btnup');
  buttonUp.addEventListener('click', scrolling);

  window.onscroll = function buttonUp() {
    document.querySelector('.btnup').style.display =
      window.pageYOffset > '200' ? 'block' : 'none';
  };
}

function scrolling() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}


export default initScrollToTop;