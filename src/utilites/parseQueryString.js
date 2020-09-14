function parseQueryString(){
    const arrayFromString = location.pathname.split('/').reverse();
    const filmId = arrayFromString[0];
    return filmId;
}

export default parseQueryString;