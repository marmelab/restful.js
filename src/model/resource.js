'use strict';

function resource(refEndpoint) {
    function model() {
        return refEndpoint;
    }

    model.requestInterceptor = function(interceptor) {
        refEndpoint.requestInterceptors().push(interceptor);

        return model;
    };

    model.requestInterceptors = function() {
        return refEndpoint.requestInterceptors()
    };

    model.responseInterceptor = function(interceptor) {
        refEndpoint.responseInterceptors().push(interceptor);

        return model;
    };

    model.responseInterceptors = function() {
        return refEndpoint.responseInterceptors;
    };

    model.header = function(name, value) {
        refEndpoint.headers()[name] = value;

        return model
    };

    model.headers = function() {
        return refEndpoint.headers();
    };

    return model;
}

module.exports = resource;
