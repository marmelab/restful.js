define(function(require) {
    'use strict';

    var endpoint = require('model/endpoint'),
        collection = require('model/collection');

    return function member(name, id) {
        var model = {},
            refEndpoint = endpoint(name, id, model);

        model.config = function() {
            return refEndpoint.config();
        };

        model.rawGet = function(params, headers) {
            return refEndpoint.rawGet(id, params, headers);
        };

        model.get = function(params, headers) {
            return refEndpoint.get(id, params, headers);
        };

        model.rawPut = function(data, headers) {
            return refEndpoint.rawPut(id, data, headers);
        };

        model.put = function(data, headers) {
            return refEndpoint.put(id, data, headers);
        };

        model.rawDelete = function(data, headers) {
            return refEndpoint.rawDelete(id, data, headers);
        };

        model.delete = function(headers) {
            return refEndpoint.delete(id, headers);
        };

        model.one = function(name, id) {
            return member(name, id)
                    .config()
                    .parent(model)
                    .httpBackend(refEndpoint.config().httpBackend())
                    .responseInterceptors(refEndpoint.config().responseInterceptors())
                    .requestInterceptors(refEndpoint.config().responseInterceptors())
                    .end();
        };

        model.all = function(name) {
            return collection(name)
                    .config()
                    .parent(model)
                    .httpBackend(refEndpoint.config().httpBackend())
                    .responseInterceptors(refEndpoint.config().responseInterceptors())
                    .requestInterceptors(refEndpoint.config().responseInterceptors())
                    .end();
        };

        model.url = function() {
            return refEndpoint.url(id);
        };

        model.requestInterceptor = function(interceptor) {
            return refEndpoint.requestInterceptor(interceptor);
        };

        model.responseInterceptor = function(interceptor) {
            return refEndpoint.responseInterceptor(interceptor);
        };

        return model;
    };
});
