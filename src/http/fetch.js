import qs from 'qs';

export default function(fetch) {
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
                return (response.status === 204 ? Promise.resolve(null) : response.json()).then((json) => {
                    const headers = {};

                    response.headers.forEach((value, name) => {
                        headers[name] = value;
                    });

                    const responsePayload = {
                        data: json,
                        headers: headers,
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
