'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = function (fetch) {
    return function (config) {
        var url = config.url;
        delete config.url;

        if (config.data) {
            config.body = /application\/json/.test(config.headers['Content-Type']) ? JSON.stringify(config.data) : config.data;
            delete config.data;
        }

        return fetch(url, config).then(function (response) {
            return (response.status === 204 ? Promise.resolve(null) : response.json()).then(function (json) {
                var headers = {};

                response.headers.forEach(function (value, name) {
                    headers[name] = value;
                });

                var responsePayload = {
                    data: json,
                    headers: headers,
                    statusCode: response.status
                };

                if (response.status >= 200 && response.status < 300) {
                    return responsePayload;
                }

                var error = new Error(response.statusText);
                error.response = responsePayload;
                throw error;
            });
        });
    };
};

module.exports = exports['default'];