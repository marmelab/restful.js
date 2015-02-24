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
            headers: parent ? JSON.parse(JSON.stringify(parent.headers())) : {},
            requestInterceptors: parent ? [].slice.apply(parent.requestInterceptors()) : [],
            responseInterceptors: parent ? [].slice.apply(parent.responseInterceptors()) : []
        };

    configurable(model, config);

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
        headers = headers ? merge(headers, config.headers) : config.headers;

        return model._http().get(
            model.url(id),
            {
                params: params || {},
                headers: headers,
                responseInterceptors: config.responseInterceptors
            }
        );
    };

    model.getAll = function(params, headers) {
        return model.get(null, params, headers);
    };

    model.post = function(data, headers) {
        headers = headers ? merge(headers, config.headers) : config.headers;

        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'json';
        }

        try {
            data = JSON.stringify(data);
        } catch (e) {}

        return model._http().post(
            model.url(),
            data,
            {
                headers: headers,
                requestInterceptors: config.requestInterceptors,
                responseInterceptors: config.responseInterceptors
            }
        );
    };

    model.put = function(id, data, headers) {
        headers = headers ? merge(headers, config.headers) : config.headers;

        return model._http().put(
            model.url(id),
            data,
            {
                headers: headers,
                requestInterceptors: config.requestInterceptors,
                responseInterceptors: config.responseInterceptors
            }
        );
    };

    model.patch = function(id, data, headers) {
        headers = headers ? merge(headers, config.headers) : config.headers;

        return model._http().patch(
            model.url(id),
            data,
            {
                headers: headers,
                requestInterceptors: config.requestInterceptors,
                responseInterceptors: config.responseInterceptors
            }
        );
    };

    model.delete = function(id, headers) {
        headers = headers ? merge(headers, config.headers) : config.headers;

        return model._http().delete(
            model.url(id),
            {
                headers: headers,
                responseInterceptors: config.responseInterceptors
            }
        );
    };

    model.head = function(id, headers) {
        headers = headers ? merge(headers, config.headers) : config.headers;

        return model._http().head(
            model.url(id),
            {
                headers: headers,
                responseInterceptors: config.responseInterceptors
            }
        );
    };

    return model;
};

module.exports = endpoint;
