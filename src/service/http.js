import assign from 'object-assign';

function interceptorCallback(interceptors, method, url, isResponseInterceptor) {
    isResponseInterceptor = isResponseInterceptor !== undefined ? !!isResponseInterceptor : false;

    return function(data, headers) {
        if (isResponseInterceptor) {
            try {
                data = JSON.parse(data);
            } catch (e) {}
        }

        for (var i in interceptors) {
            data = interceptors[i](data, headers, method, url);
        }

        if (!isResponseInterceptor) {
            try {
                data = JSON.stringify(data);
            } catch (e) {}
        }

        return data;
    };
}

export default function http(httpBackend) {
    var model = {
        backend: httpBackend,

        setBackend(httpBackend) {
            this.backend = httpBackend;

            return assign(function() {
                return httpBackend;
            }, this);
        },

        request(method, config) {
            config.method = method;

            if (['post', 'put', 'patch'].indexOf(method) !== -1) {
                config.transformRequest = [interceptorCallback(config.requestInterceptors || [], config.method, config.url)];
                delete config.requestInterceptors;
            }

            config.transformResponse = [interceptorCallback(config.responseInterceptors || [], config.method, config.url, true)];
            delete config.responseInterceptors;

            return this.backend(config).then(function (response) {
                console.log('restful response', response);

                const interceptors = config.fullResponseInterceptors;
                    for (let i in interceptors) {
                        let intercepted = interceptors[i](response.data, response.headers);

                        if (intercepted.data) {
                            response.data = intercepted.data;
                        }

                        if (intercepted.headers) {
                            response.headers = intercepted.headers;
                        }
                    }

                return response;
            });
        }
    };

    return assign(function() {
        return httpBackend;
    }, model);
}
