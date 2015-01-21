define(function(require) {
    'use strict';

    var endpoint = require('model/endpoint');

    return function collection(name) {
        var model = {},
            refEndpoint = endpoint(name, null, model);

        model.config = function() {
            return refEndpoint.config();
        };

        model.rawGet = function(id, params, headers) {
            return refEndpoint.rawGet(id, params, headers);
        };

        model.get = function(id, params, headers) {
            return refEndpoint.get(id, params, headers);
        };

        model.rawGetAll = function(params, headers) {
            return refEndpoint.rawGetAll(params, headers);
        };

        model.getAll = function(params, headers) {
            return refEndpoint.getAll(params, headers);
        };

        model.rawPost = function(data, headers) {
            return refEndpoint.rawPost(data, headers);
        };

        model.post = function(data, headers) {
            return refEndpoint.post(data, headers);
        };

        model.rawPut = function(id, data, headers) {
            return refEndpoint.rawPut(id, data, headers);
        };

        model.put = function(id, data, headers) {
            return refEndpoint.put(id, data, headers);
        };

        model.rawDelete = function(id, headers) {
            return refEndpoint.rawDelete(id, headers);
        };

        model.delete = function(id, headers) {
            return refEndpoint.delete(id, headers);
        };

        model.url = function() {
            return refEndpoint.url();
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
