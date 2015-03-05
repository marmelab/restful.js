import configurable from 'util/configurable';
import entity from 'model/entity';

export default function endpoint(url, parent) {
    var config = {
            _parent: parent,
            headers: {},
            requestInterceptors: [],
            responseInterceptors:[],
        };

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
            Object.assign(headers, current.headers())

            current = current._parent ? current._parent() : null;
        }

        return headers;
    };

    function _generateRequestConfig(url, params = {}, headers = {}, data = null) {
        var config = {
            url: url,
            params: params || {},
            headers: Object.assign({}, _getHeaders(), headers || {}),
            responseInterceptors: _getResponseInterceptors(),
        };

        if (data) {
            config.data = data;
            config.requestInterceptors = _getRequestInterceptors();
        }

        return config;
    }

    var model = {
        get(id, params, headers) {
            return config._parent().request(
                'get',
                _generateRequestConfig(url + '/' + id, params, headers)
            );
        },

        getAll(params, headers) {
            return config._parent().request(
                'get',
                _generateRequestConfig(url, params, headers)
            );
        },

        post(data, headers) {
            headers = headers || {};

            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/json;charset=UTF-8';
            }

            return config._parent().request(
                'post',
                _generateRequestConfig(url, {}, headers, data)
            );
        },

        put(id, data, headers) {
            headers = headers || {};

            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/json;charset=UTF-8';
            }

            return config._parent().request(
                'put',
                _generateRequestConfig(url + '/' + id, {}, headers, data)
            );
        },

        patch(id, data, headers) {
            headers = headers || {};

            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/json;charset=UTF-8';
            }

            return config._parent().request(
                'patch',
                _generateRequestConfig(url + '/' + id, {}, headers, data)
            );
        },

        delete(id, headers) {
            return config._parent().request(
                'delete',
                _generateRequestConfig(url + '/' + id, {}, headers)
            );
        },

        head(id, headers) {
            return config._parent().request(
                'head',
                _generateRequestConfig(url + '/' + id, {}, headers)
            );
        },

    };

    model = Object.assign(function() {
        return config._parent();
    }, model);

    configurable(model, config);

    return model;
};
