'use strict';

var configurator = require('./model/configurator'),
    collection = require('./model/collection'),
    member = require('./model/member'),
    inherit = require('./util/inherit'),
    axios = require('axios');

function restful(baseUrl, port) {
    var model = {},
        config = configurator({
            _httpBackend: axios,
            baseUrl: baseUrl,
            headers: {},
            port: port || 80,
            prefixUrl: '',
            protocol: 'http',
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
        return inherit(model, member(name, id));
    };

    model.all = function(name) {
        return inherit(model, collection(name));
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

module.exports = restful;
