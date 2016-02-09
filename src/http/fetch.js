import qs from 'qs';
import warning from 'warning';

function parseBody(response) {
    return response.text().then(text => {
        if (!text || !text.length) {
            warning(response.status === 204, 'You should return a 204 status code with an empty body.');
            return null;
        }

        warning(response.status !== 204, 'You should return an empty body with a 204 status code.');

        try {
            return JSON.parse(text);
        } catch (error) {
            return text;
        }
    });
}

export default function (fetch) {
    return (config) => {
        const url = config.url;
        delete config.url;

        if (config.data) {
            config.body = /application\/json/.test(config.headers['Content-Type']) ? JSON.stringify(config.data) : config.data;
            delete config.data;
        }

        const queryString = qs.stringify(config.params || {}, { arrayFormat: 'brackets' });
        delete config.params;

        return fetch(!queryString.length ? url : `${url}?${queryString}`, config)
            .then((response) => {
                return parseBody(response).then((json) => {
                    let headers = {};

                    if (typeof Headers.prototype.forEach === 'function') {
                        response.headers.forEach((value, name) => {
                            headers[name] = value
                        })
                    } else if (typeof Headers.prototype.keys === 'function') {
                        const keys = response.headers.keys();
                        for (const key of keys) {
                            headers[key] = response.headers.get(key);
                        }
                    } else {
                        headers = response.headers
                    }

                    const responsePayload = {
                        data: json,
                        headers: headers,
                        method: config.method ? config.method.toLowerCase() : 'get',
                        statusCode: response.status,
                    };

                    if (response.status >= 200 && response.status < 300) {
                        return responsePayload;
                    }

                    const error = new Error(response.statusText);
                    error.response = responsePayload;
                    throw error;
                });
            });
    };
}
