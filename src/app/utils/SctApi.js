import axios from 'axios';

const API_SERVER_URL = 'https://apisct.cloud';

const THUMBUP_LIST = '/thumbups/list';
const CONFIG = '/thumbups/config';
const DIVIDE = '/thumbups/divide';
const RECEIVE_TOPLIST = '/thumbups/receiveThumbupList';
const SEND_TOPLIST = '/thumbups/sendThumbupList';

export function getThumbUpList(author, permlink) {
    return axios.get(`${API_SERVER_URL}${THUMBUP_LIST}/${author}/${permlink}`);
}

export function getThumbupReceiveTopList() {
    return axios.get(`${API_SERVER_URL}${RECEIVE_TOPLIST}/201909`);
}

export function getThumbupSendTopList() {
    return axios.get(`${API_SERVER_URL}${SEND_TOPLIST}/201909}`);
}

export async function getConfig() {
    try {
        const config = await axios.get(`${API_SERVER_URL}${CONFIG}`);
        const divide = await axios.get(`${API_SERVER_URL}${DIVIDE}`);

        let configData = {};

        if (config && config.data && config.data[0]) {
            configData.receive_account = config.data[0].receive_account;
            configData.max_like_amount = config.data[0].max_like_amount;
        }

        divide.data.forEach(el => {
            switch (el.remark) {
                case 'Author':
                    configData.divide_author = el.rate;
                    break;
                case 'Thumbs up pool':
                    configData.divide_rewards = el.rate;
                    break;
                case 'Developer':
                    configData.divide_dev = el.rate;
                    break;
                case 'Burn':
                    configData.divide_burn = el.rate;
                    break;
            }
        });

        console.log(`sctapi getconfig load success`);
        return configData;
    } catch (e) {
        console.log(`sctapi getconfig fail to load`);
        console.log(e);
        // set default config
        return undefined;
    }
}
