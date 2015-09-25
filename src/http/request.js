export default function(request) {
    return (config) => {
        if (config.data) {
            config.form = /application\/json/.test(config.headers['Content-Type']) ? JSON.stringify(config.data) : config.data;
            delete config.data;
        }

        return new Promise((resolve) => {
            request(config, (err, response, body) => {
                if (err) {
                    throw err;
                }

                if (response.statusCode >= 200 && response.statusCode < 300) {
                    let data;

                    try {
                        data = JSON.parse(body);
                    } catch (e) {
                        data = body;
                    }

                    return resolve({
                        data,
                        headers: response.headers,
                        statusCode: response.statusCode,
                    });
                }

                const error = new Error(response.statusMessage);
                error.response = {
                    data: body,
                    statusCode: response.statusCode,
                };

                throw error;
            });
        });
    };
}
