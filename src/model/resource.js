'use strict';

function resource(refEndpoint) {
    function model() {
        return refEndpoint;
    }

    model.requestInterceptor = function(interceptor) {
        return refEndpoint.requestInterceptors().push(interceptor);
    };

    model.requestInterceptors = refEndpoint.requestInterceptors;

    model.responseInterceptor = function(interceptor) {
        return refEndpoint.responseInterceptors().push(interceptor);
    };

    model.responseInterceptors = refEndpoint.responseInterceptors;

    model.header = function(name, value) {
        refEndpoint.headers()[name] = value;
    };

    model.headers = refEndpoint.headers;

    return model;
}

module.exports = resource;
