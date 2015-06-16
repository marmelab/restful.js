import assign from 'object-assign';
import configurable from 'util/configurable';

export default function endpoint(url, parent) {
    var config = {
            _parent: parent,
            headers: {},
            fullRequestInterceptors: [],
            requestInterceptors: [],
            responseInterceptors:[],
        };

    /**
     * Merge the local full request interceptors and the parent's ones
     * @private
     * @return {array} full request interceptors
     */
    function _getFullRequestInterceptors() {
        var current = model,
            fullRequestInterceptors = [];

        while (current) {
            fullRequestInterceptors = fullRequestInterceptors.concat(current.fullRequestInterceptors());

            current = current._parent ? current._parent() : null;
        }

        return fullRequestInterceptors;
    }

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
    }

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
    }

    /**
     * Merge the local headers and the parent's ones
     * @private
     * @return {array} headers
     */
    function _getHeaders() {
        var current = model,
            headers = {};

        while (current) {
            assign(headers, current.headers());

            current = current._parent ? current._parent() : null;
        }

        return headers;
    }

    function _generateRequestConfig(url, params = {}, headers = {}, data = null) {
        var config = {
            url: url,
            params: params || {},
            headers: assign({}, _getHeaders(), headers || {}),
            responseInterceptors: _getResponseInterceptors(),
        };

        if (data) {
            config.data = data;
            config.requestInterceptors = _getRequestInterceptors();
        }

        var interceptors = _getFullRequestInterceptors();
        for (let i in interceptors) {
            let intercepted = interceptors[i](url, params, headers, data);

            if (intercepted.url) {
                config.url = intercepted.url;
            }

            if (intercepted.params) {
                config.params = intercepted.params;
            }

            if (intercepted.headers) {
                config.headers = intercepted.headers;
            }

            if (intercepted.data) {
                config.params = intercepted.data;
            }
        }

        return config;
    }

    var model = {
        get(params, headers) {
            return config._parent().request(
                'get',
                _generateRequestConfig(url, params, headers)
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

        put(data, headers) {
            headers = headers || {};

            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/json;charset=UTF-8';
            }

            return config._parent().request(
                'put',
                _generateRequestConfig(url, {}, headers, data)
            );
        },

        patch(data, headers) {
            headers = headers || {};

            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/json;charset=UTF-8';
            }

            return config._parent().request(
                'patch',
                _generateRequestConfig(url, {}, headers, data)
            );
        },

        delete(headers) {
            return config._parent().request(
                'delete',
                _generateRequestConfig(url, {}, headers)
            );
        },

        head(headers) {
            return config._parent().request(
                'head',
                _generateRequestConfig(url, {}, headers)
            );
        },

    };

    model = assign(function() {
        return config._parent();
    }, model);

    configurable(model, config);

    return model;
}
