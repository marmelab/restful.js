'use strict';

var configurable = require('../util/configurable'),
    entity = require('./entity'),
    merge = require('../util/merge');

function endpoint(name, id, parent) {
    var model = {},
        config = {
            _parent: parent,
            _name: name,
            _id: id !== undefined ? id : null,
            headers: {},
            requestInterceptors: [],
            responseInterceptors:[]
        };

    configurable(model, config);

    function _getRequestInterceptors() {
        var current = model,
            requestInterceptors = [];

        while (current) {
            requestInterceptors = requestInterceptors.concat(current.requestInterceptors());

            current = current._parent ? current._parent() : null;
        }

        return requestInterceptors;
    };

    function _getResponseInterceptors() {
        var current = model,
            responseInterceptors = [];

        while (current) {
            responseInterceptors = responseInterceptors.concat(current.responseInterceptors());

            current = current._parent ? current._parent() : null;
        }

        return responseInterceptors;
    };

    function _getHeaders() {
        var current = model,
            headers = {};

        while (current) {
            headers = merge(current.headers(), headers);

            current = current._parent ? current._parent() : null;
        }

        return headers;
    };

    model._http = function() {
        return config._parent._http();
    };

    model.url = function(id) {
        id = id || config._id;

        var url = config._parent.url();

        if (config._name) {
            url += '/' + config._name;
        }

        if (~~id === id) {
            url += '/' + id;
        }

        return url;
    };

    model.get = function(id, params, headers) {
        headers = headers ? merge(headers, _getHeaders()) : _getHeaders();

        return model._http().get(
            model.url(id),
            {
                params: params || {},
                headers: headers,
                responseInterceptors: _getResponseInterceptors()
            }
        );
    };

    model.getAll = function(params, headers) {
        return model.get(null, params, headers);
    };

    model.post = function(data, headers) {
        headers = headers ? merge(headers, _getHeaders()) : _getHeaders();

        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=UTF-8';
        }

        return model._http().post(
            model.url(),
            data,
            {
                headers: headers,
                requestInterceptors: _getRequestInterceptors(),
                responseInterceptors: _getResponseInterceptors()
            }
        );
    };

    model.put = function(id, data, headers) {
        headers = headers ? merge(headers, _getHeaders()) : _getHeaders();

        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=UTF-8';
        }

        return model._http().put(
            model.url(id),
            data,
            {
                headers: headers,
                requestInterceptors: _getRequestInterceptors(),
                responseInterceptors: _getResponseInterceptors()
            }
        );
    };

    model.patch = function(id, data, headers) {
        headers = headers ? merge(headers, _getHeaders()) : _getHeaders();

        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=UTF-8';
        }

        return model._http().patch(
            model.url(id),
            data,
            {
                headers: headers,
                requestInterceptors: _getRequestInterceptors(),
                responseInterceptors: _getResponseInterceptors()
            }
        );
    };

    model.delete = function(id, headers) {
        headers = headers ? merge(headers, _getHeaders()) : _getHeaders();

        return model._http().delete(
            model.url(id),
            {
                headers: headers,
                responseInterceptors: _getResponseInterceptors()
            }
        );
    };

    model.head = function(id, headers) {
        headers = headers ? merge(headers, _getHeaders()) : _getHeaders();

        return model._http().head(
            model.url(id),
            {
                headers: headers,
                responseInterceptors: _getResponseInterceptors()
            }
        );
    };

    return model;
};

module.exports = endpoint;
