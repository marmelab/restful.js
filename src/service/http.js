import assign from 'object-assign';

export default function(httpBackend) {
    return (config) => {
        const errorInterceptors = config.errorInterceptors || [];
        const requestInterceptors = config.requestInterceptors || [];
        const responseInterceptors = config.responseInterceptors || [];
        delete config.errorInterceptors;
        delete config.requestInterceptors;
        delete config.responseInterceptors;

        return requestInterceptors
            .reduce((promise, interceptor) => {
                return promise.then(currentConfig => {
                    return Promise.resolve()
                        .then(() => interceptor(currentConfig))
                        .then((nextConfig) => {
                            return assign({}, currentConfig, nextConfig);
                        });
                });
            }, Promise.resolve(config))
            .then((transformedConfig) => {
                return httpBackend(transformedConfig).then((response) => {
                    return responseInterceptors.reduce((promise, interceptor) => {
                        return promise.then(currentResponse => {
                            return Promise.resolve()
                                .then(() => interceptor(currentResponse, transformedConfig))
                                .then((nextResponse) => {
                                    return assign({}, currentResponse, nextResponse);
                                });
                        });
                    }, Promise.resolve(response));
                });
            })
            .then(null, (error) => {
                return errorInterceptors
                    .reduce((promise, interceptor) => {
                        return promise.then(currentError => {
                            return Promise.resolve()
                                .then(() => interceptor(currentError, config))
                                .then((nextError) => {
                                    return assign({}, currentError, nextError);
                                });
                        });
                    }, Promise.resolve(error))
                    .then((transformedError) => Promise.reject(transformedError));
            });
    };
}
