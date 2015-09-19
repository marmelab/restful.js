import assign from 'object-assign';

export default function(httpBackend) {
    return (config) => {
        const requestInterceptors = config.requestInterceptors || [];
        const responseInterceptors = config.responseInterceptors || [];
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
            });
    };
}
