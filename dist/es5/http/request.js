'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = function (request) {
    return function (config) {
        if (config.data) {
            config.form = /application\/json/.test(config.headers['Content-Type']) ? JSON.stringify(config.data) : config.data;
            delete config.data;
        }

        if (config.params) {
            config.qs = config.params;
            delete config.params;
        }

        return new Promise(function (resolve, reject) {
            request(config, function (err, response, body) {
                if (err) {
                    throw err;
                }

                var data = undefined;

                try {
                    data = JSON.parse(body);
                } catch (e) {
                    data = body;
                }

                var responsePayload = {
                    data: data,
                    headers: response.headers,
                    statusCode: response.statusCode
                };

                if (response.statusCode >= 200 && response.statusCode < 300) {
                    return resolve(responsePayload);
                }

                var error = new Error(response.statusMessage);
                error.response = responsePayload;

                reject(error);
            });
        });
    };
};

module.exports = exports['default'];