import { BASE_URL, API_KEY } from '../constants';

export default function apiRequestTrending() {
    const requestParam = `/3/trending/movie/week?api_key=`

    return fetch(BASE_URL+requestParam+API_KEY).then(resp=>resp.json()).then(data=>{
        return data.results
    })
}
