import { api } from '@hiveio/hive-js';

const request_base = {
    method: 'post',
    mode: 'no-cors',
    credentials: 'same-origin',
    headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
    },
};

export function serverApiLogin(account, signatures) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    const request = Object.assign({}, request_base, {
        body: JSON.stringify({ account, signatures, csrf: $STM_csrf }),
    });
    return fetch('/api/v1/login_account', request);
}

export function serverApiLogout() {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    const request = Object.assign({}, request_base, {
        body: JSON.stringify({ csrf: $STM_csrf }),
    });
    return fetch('/api/v1/logout_account', request);
}

let last_call;
export function serverApiRecordEvent(type, val, rate_limit_ms = 5000) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    if (last_call && new Date() - last_call < rate_limit_ms) return;
    last_call = new Date();
    const value = val && val.stack ? `${val.toString()} | ${val.stack}` : val;
    return;
    api.call(
        'overseer.collect',
        { collection: 'event', metadata: { type, value } },
        error => {
            if (error) console.warn('overseer error', error, error.data);
        }
    );
}

export function saveCords(x, y) {
    const request = Object.assign({}, request_base, {
        body: JSON.stringify({ csrf: $STM_csrf, x: x, y: y }),
    });
    fetch('/api/v1/save_cords', request);
}

export function setUserPreferences(payload) {
    if (!process.env.BROWSER || window.$STM_ServerBusy)
        return Promise.resolve();
    const request = Object.assign({}, request_base, {
        body: JSON.stringify({ csrf: window.$STM_csrf, payload }),
    });
    return fetch('/api/v1/setUserPreferences', request);
}

export function isTosAccepted() {
    if (process.env.NODE_ENV !== 'production') {
        // TODO: remove this. endpoint in dev currently down.
        return true;
    }
    const request = Object.assign({}, request_base, {
        body: JSON.stringify({ csrf: window.$STM_csrf }),
    });
    return fetch('/api/v1/isTosAccepted', request).then(res => res.json());
}

export function acceptTos() {
    const request = Object.assign({}, request_base, {
        body: JSON.stringify({ csrf: window.$STM_csrf }),
    });
    return fetch('/api/v1/acceptTos', request);
}
export function conductSearch(req) {
    const bodyWithCSRF = {
        ...req.body,
        csrf: window.$STM_csrf,
    };
    const request = Object.assign({}, request_base, {
        body: JSON.stringify(bodyWithCSRF),
    });
    return fetch('/api/v1/search', request);
}
