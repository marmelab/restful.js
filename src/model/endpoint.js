'use strict';

var configurable = require('../util/configurable'),
    entity = require('./entity'),
    merge = require('../util/merge');

function endpoint(url, parent) {
    var model = {},
        config = {
            _parent: parent,
            headers: {},
            requestInterceptors: [],
            responseInterceptors:[]
        };

    configurable(model, config);

    /**
     * Merge the local request interceptors and the parent's ones
     * @private
     * @return {array} request interceptors
     */
    function _getRequestInterceptors() {
        var current = model,
            requestInterceptors = [];

        while (current) {
            requestInterceptors = requestInterceptors.concat(current.requestInterceptors());

            current = current._parent ? current._parent() : null;
        }

        return requestInterceptors;
    };

    /**
     * Merge the local response interceptors and the parent's ones
     * @private
     * @return {array} response interceptors
     */
    function _getResponseInterceptors() {
        var current = model,
            responseInterceptors = [];

        while (current) {
            responseInterceptors = responseInterceptors.concat(current.responseInterceptors());

            current = current._parent ? current._parent() : null;
        }

        return responseInterceptors;
    };

    /**
     * Merge the local headers and the parent's ones
     * @private
     * @return {array} headers
     */
    function _getHeaders() {
        var current = model,
            headers = {};

        while (current) {
            headers = merge(current.headers(), headers);

            current = current._parent ? current._parent() : null;
        }

        return headers;
    };

    /**
     * Return the http layer. We ask it to the parent endpoint. This way it is defined in src/restful.js
     * @private
     * @return {object} http layer
     */
    model._http = function() {
        return config._parent._http();
    };

    model.get = function(id, params, headers) {
        headers = headers ? merge(headers, _getHeaders()) : _getHeaders();

        return model._http().get(
            url + '/' + id,
            {
                params: params || {},
                headers: headers,
                responseInterceptors: _getResponseInterceptors()
            }
        );
    };

    model.getAll = function(params, headers) {
        headers = headers ? merge(headers, _getHeaders()) : _getHeaders();

        return model._http().get(
            url,
            {
                params: params || {},
                headers: headers,
                responseInterceptors: _getResponseInterceptors()
            }
        );
    };

    model.post = function(data, headers) {
        headers = headers ? merge(headers, _getHeaders()) : _getHeaders();

        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=UTF-8';
        }

        return model._http().post(
            url,
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
            url + '/' + id,
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
            url + '/' + id,
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
            url + '/' + id,
            {
                headers: headers,
                responseInterceptors: _getResponseInterceptors()
            }
        );
    };

    model.head = function(id, headers) {
        headers = headers ? merge(headers, _getHeaders()) : _getHeaders();

        return model._http().head(
            url + '/' + id,
            {
                headers: headers,
                responseInterceptors: _getResponseInterceptors()
            }
        );
    };

    return model;
};

module.exports = endpoint;
