import teamPageTemplate from '../templates/teamPage.hbs';
import {ROOT_DOM} from '../constants/index';

function teamPage (){
    ROOT_DOM.innerHTML = teamPageTemplate();
}

export default teamPage;