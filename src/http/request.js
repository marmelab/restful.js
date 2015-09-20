export default function(request) {
    return (config) => {
        if (config.data) {
            config.form = /application\/json/.test(config.headers['Content-Type']) ? JSON.stringify(config.data) : config.data;
            delete config.data;
        }

        return new Promise((resolve, reject) => {
            request(config, (error, response) => {
                if (error) {
                    return reject(error);
                }

                resolve(response);
            });
        });
    };
}
