const footerLinkRef = document.querySelector('.to-team-page');

function aboutTeamHandler (event){
    event.preventDefault();
    window['router'].navigate('developers');
}

function aboutTeamPage () {
    footerLinkRef.addEventListener('click', aboutTeamHandler);
}


export default aboutTeamPage;