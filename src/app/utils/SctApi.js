import axios from 'axios';

const API_SERVER_URL = 'http://13.125.53.227:8080';

const THUMBUP_LIST = '/thumbups/list';
const CONFIG = '/thumbups/config';
const DIVIDE = '/thumbups/divide';

export function getThumbUpList(author, permlink) {
    return axios.get(`${API_SERVER_URL}${THUMBUP_LIST}/${author}/${permlink}`);
}

export async function getConfig() {
    const config = await axios.get(`${API_SERVER_URL}${CONFIG}`);
    const divide = await axios.get(`${API_SERVER_URL}${DIVIDE}`);

    let configData = {};

    if (config && config.data && config.data[0]) {
        configData.receive_account = config.data[0].receive_account;
        configData.max_like_amount = config.data[0].max_like_amount;
    }

    divide.data.forEach(el => {
        switch (el.account) {
            case 'author':
                configData.divide_author = el.rate;
                break;
            case 'sct.thumbsup':
                configData.divide_rewards = el.rate;
                break;
            case 'uni.dev':
                configData.divide_dev = el.rate;
                break;
            case 'null':
                configData.divide_burn = el.rate;
                break;
        }
    });
    return configData;
}
