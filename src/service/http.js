function interceptorCallback(interceptors) {
    return function(data) {
        var parsedData;

        try {
            parsedData = JSON.parse(data);
        } catch (e) {
            parsedData = data;
        }

        for (var i in interceptors) {
            parsedData = interceptors[i](parsedData);
        }

        return parsedData;
    }
};

function http(httpBackend) {

    function model() {
        return httpBackend;
    }

    model.request = function(method, url, data, config) {
        if (config.requestInterceptors) {
            config.transformRequest = [interceptorCallback(config.requestInterceptors)];
            delete config.responseInterceptors;
        }

        if (config.responseInterceptors) {
            config.responseInterceptors = [interceptorCallback(config.responseInterceptors)];
            delete config.responseInterceptors;
        }

        return httpBackend({
            method: method,
            url: url,
            data: data,
            config: config
        });
    };

    model.get = function(url, config) {
        return model.request('get', url, null, config);
    };

    model.post = function(url, data, config) {
        return model.request('post', url, data, config);
    };

    model.put = function(url, data, config) {
        return model.request('put', url, data, config);
    };

    model.patch = function(url, data, config) {
        return model.request('patch', url, data, config);
    };

    model.delete = function(url, config) {
        return model.request('delete', url, null, config);
    };

    model.head = function(url, config) {
        return model.request('head', url, null, config);
    };

    return model;
}

module.exports = http(require('axios'));
