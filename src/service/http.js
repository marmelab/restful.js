'use strict';

var merge = require('../util/merge');

function interceptorCallback(interceptors, response) {
    response = response !== undefined ? !!response : false;

    return function(data) {
        if (response) {
            try {
                data = JSON.parse(data);
            } catch (e) {}
        }

        for (var i in interceptors) {
            data = interceptors[i](data);
        }

        if (!response) {
            try {
                data = JSON.stringify(data);
            } catch (e) {}
        }

        return data;
    }
};

function http(httpBackend) {

    function model() {
        return httpBackend;
    }

    function request(method, url, data, config) {
        if (['post', 'put', 'patch'].indexOf(method) !== -1) {
            config.transformRequest = [interceptorCallback(config.requestInterceptors || [])];
            delete config.requestInterceptors;
        }

        config.transformResponse = [interceptorCallback(config.responseInterceptors || [], true)];
        delete config.responseInterceptors;

        config = merge({
            method: method,
            url: url,
            data: data
        }, config)

        return httpBackend(config);
    };

    model.get = function(url, config) {
        return request('get', url, null, config);
    };

    model.post = function(url, data, config) {
        return request('post', url, data, config);
    };

    model.put = function(url, data, config) {
        return request('put', url, data, config);
    };

    model.patch = function(url, data, config) {
        return request('patch', url, data, config);
    };

    model.delete = function(url, config) {
        return request('delete', url, null, config);
    };

    model.head = function(url, config) {
        return request('head', url, null, config);
    };

    return model;
}

module.exports = http;
