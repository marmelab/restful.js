function interceptorCallback(interceptors, isResponseInterceptor) {
    isResponseInterceptor = isResponseInterceptor !== undefined ? !!isResponseInterceptor : false;

    return function(data) {
        if (isResponseInterceptor) {
            try {
                data = JSON.parse(data);
            } catch (e) {}
        }

        for (var i in interceptors) {
            data = interceptors[i](data);
        }

        if (!isResponseInterceptor) {
            try {
                data = JSON.stringify(data);
            } catch (e) {}
        }

        return data;
    }
};

export default function http(httpBackend) {
    var model = {
        request(method, config) {
            if (['post', 'put', 'patch'].indexOf(method) !== -1) {
                config.transformRequest = [interceptorCallback(config.requestInterceptors || [])];
                delete config.requestInterceptors;
            }

            config.transformResponse = [interceptorCallback(config.responseInterceptors || [], true)];
            delete config.responseInterceptors;

            return httpBackend(config);
        }
    };

    return Object.assign(function() {
        return httpBackend;
    }, model);
}
