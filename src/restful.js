'use strict';

var configurable = require('./util/configurable'),
    collection = require('./model/collection'),
    member = require('./model/member'),
    http = require('./service/http');

function restful(baseUrl, port) {
    var config = {
            _http: http,
            baseUrl: baseUrl,
            headers: {},
            port: port || 80,
            prefixUrl: '',
            protocol: 'http',
            requestInterceptors: [],
            responseInterceptors: []
        };

    var fakeEndpoint = {
        url: function() {
            var url = config.protocol + '://' + config.baseUrl;

            if (config.port !== 80) {
                url += ':' + config.port;
            }

            if (config.prefixUrl !== '') {
                url += '/' + config.prefixUrl;
            }

            return url;
        },

        _http: function() {
            return config._http;
        },

        headers: function() {
            return config.headers;
        },

        requestInterceptors: function() {
            return config.requestInterceptors;
        },

        responseInterceptors: function() {
            return config.responseInterceptors;
        }
    };

    function model() {
        return fakeEndpoint;
    };

    configurable(model, config);

    model.factory = member;

    model.url = function() {
        return fakeEndpoint.url();
    };

    model.one = function(name, id) {
        return member(name, id, model);
    };

    model.all = function(name) {
        return collection(name, model);
    };

    return model;
};

module.exports = restful;
