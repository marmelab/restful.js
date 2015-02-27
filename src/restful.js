'use strict';

var configurable = require('./util/configurable'),
    collection = require('./model/collection'),
    resource = require('./model/resource'),
    member = require('./model/member'),
    http = require('./service/http');

function restful(baseUrl, port) {
    var config = {
        baseUrl: baseUrl,
        port: port || 80,
        prefixUrl: '',
        protocol: 'http',
    };

    var fakeEndpoint = (function() {
        var model = {},
            _config = {
                _http: http,
                headers: {},
                requestInterceptors: [],
                responseInterceptors: []
            };

        configurable(model, _config);

        model.url = function() {
            var url = config.protocol + '://' + config.baseUrl;

            if (config.port !== 80) {
                url += ':' + config.port;
            }

            if (config.prefixUrl !== '') {
                url += '/' + config.prefixUrl;
            }

            return url;
        }

        return model;
    }()),
    model = resource(fakeEndpoint);

    configurable(model, config);

    model.url = function() {
        return fakeEndpoint.url();
    };

    model.one = function(name, id) {
        return member(name, id, model);
    };

    model.all = function(name) {
        return collection(name, model);
    };

    model.factory = member;

    return model;
};

module.exports = restful;
