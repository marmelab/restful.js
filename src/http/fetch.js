import 'whatwg-fetch';

export default function(config) {
    const url = config.url;
    delete config.url;

    if (config.data) {
        config.body = /application\/json/.test(config.headers['Content-Type']) ? JSON.stringify(config.data) : config.data;
        delete config.data;
    }

    return fetch(url, config)
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                return response;
            }

            const error = new Error(response.statusText);
            error.response = response;
            throw error;
        })
        .then((response) => {
            return response.json().then((json) => {
                return {
                    data: json,
                    statusCode: response.status,
                };
            });
        });
}
