define(function(require) {
    'use strict';

    var configurator = require('model/configurator'),
        collection = require('model/collection'),
        member = require('model/member');

    return function restClient(baseUrl, port) {
        var model = {},
            config = configurator({
                baseUrl: baseUrl,
                port: port || 80,
                protocol: 'http',
                prefixUrl: '',
                httpBackend: window.axios,
                requestInterceptors: [],
                responseInterceptors: []
            }, model);

        model.config = function() {
            return config;
        };

        model.url = function() {
            var url = config.protocol() + '://' + config.baseUrl();

            if (config.port() !== 80) {
                url += ':' + config.port();
            }

            if (config.prefixUrl() !== '') {
                url += '/' + config.prefixUrl();
            }

            return url;
        }

        model.one = function(name, id) {
            return member(name, id)
                    .config()
                    .parent(model)
                    .httpBackend(config.httpBackend())
                    .responseInterceptors(config.responseInterceptors())
                    .requestInterceptors(config.responseInterceptors())
                    .end();
        };

        model.all = function(name) {
            return collection(name)
                    .config()
                    .parent(model)
                    .httpBackend(config.httpBackend())
                    .responseInterceptors(config.responseInterceptors())
                    .requestInterceptors(config.responseInterceptors())
                    .end();
        };

        model.requestInterceptor = function(interceptor) {
            config.requestInterceptors().push(interceptor);

            return model;
        };

        model.responseInterceptor = function(interceptor) {
            config.responseInterceptors().push(interceptor);

            return model;
        };

        return model;
    };
});
