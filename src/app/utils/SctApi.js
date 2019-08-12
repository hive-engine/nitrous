import axios from 'axios';

const API_SERVER_URL = 'http://game.steemservice.com:3003';

const THUMBUP_LIST = '/thumbups/list';
const CONFIG = '/thumbups/config';

export function getThumbUpList(author, permlink) {
    return axios.get(`${API_SERVER_URL}${THUMBUP_LIST}/${author}/${permlink}`);
}

export function getConfig() {
    return axios.get(`${API_SERVER_URL}${CONFIG}`);
}
