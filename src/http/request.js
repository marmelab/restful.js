export default function (request) {
    return (config) => {
        if (config.data) {
            config.form = /application\/json/.test(config.headers['Content-Type']) ? JSON.stringify(config.data) : config.data;
            delete config.data;
        }

        if (config.params) {
            config.qs = config.params;
            delete config.params;
        }

        return new Promise((resolve, reject) => {
            request(config, (err, response, body) => {
                if (err) {
                    throw err;
                }

                let data;

                try {
                    data = JSON.parse(body);
                } catch (e) {
                    data = body;
                }

                const responsePayload = {
                    data,
                    headers: response.headers,
                    statusCode: response.statusCode,
                };

                if (response.statusCode >= 200 && response.statusCode < 300) {
                    return resolve(responsePayload);
                }

                const error = new Error(response.statusMessage);
                error.response = responsePayload;

                reject(error);
            });
        });
    };
}
