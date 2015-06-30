import assign from 'object-assign';
import configurable from 'util/configurable';

export default function endpoint(url, parent) {
    var config = {
            _parent: parent,
            headers: {},
            fullRequestInterceptors: [],
            fullResponseInterceptors: [],
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
     * Merge the local full response interceptors and the parent's ones
     * @private
     * @return {array} full response interceptors
     */
    function _getFullResponseInterceptors() {
        var current = model,
            fullResponseInterceptors = [];

        while (current) {
            fullResponseInterceptors = fullResponseInterceptors.concat(current.fullResponseInterceptors());

            current = current._parent ? current._parent() : null;
        }

        return fullResponseInterceptors;
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

    function _generateRequestConfig(method, url, params = {}, headers = {}, data = null) {
        var config = {
            method: method,
            url: url,
            params: params || {},
            headers: assign({}, _getHeaders(), headers || {}),
            responseInterceptors: _getResponseInterceptors(),
            fullResponseInterceptors: _getFullResponseInterceptors(),
        };

        if (data) {
            config.data = data;
            config.requestInterceptors = _getRequestInterceptors();
        }

        var interceptors = _getFullRequestInterceptors();
        for (let i in interceptors) {
            let intercepted = interceptors[i](params, headers, data, method, url);

            if (intercepted.method) {
                config.method = intercepted.method;
            }

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
                config.data = intercepted.data;
            }
        }

        return config;
    }

    var model = {
        get(params, headers) {
            var nextConfig = _generateRequestConfig('get', url, params, headers);

            return config._parent().request(
                nextConfig.method,
                nextConfig
            );
        },

        getAll(params, headers) {
            var nextConfig = _generateRequestConfig('get', url, params, headers);

            return config._parent().request(
                nextConfig.method,
                nextConfig
            );
        },

        post(data, headers) {
            headers = headers || {};
            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/json;charset=UTF-8';
            }
            var nextConfig = _generateRequestConfig('post', url, {}, headers, data);

            return config._parent().request(
                nextConfig.method,
                nextConfig
            );
        },

        put(data, headers) {
            headers = headers || {};
            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/json;charset=UTF-8';
            }
            var nextConfig = _generateRequestConfig('put', url, {}, headers, data);

            return config._parent().request(
                nextConfig.method,
                nextConfig
            );
        },

        patch(data, headers) {
            headers = headers || {};
            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/json;charset=UTF-8';
            }
            var nextConfig = _generateRequestConfig('patch', url, {}, headers, data);

            return config._parent().request(
                nextConfig.method,
                nextConfig
            );
        },

        delete(headers,data) {
            var nextConfig = _generateRequestConfig('delete', url, {}, headers,data);

            return config._parent().request(
                nextConfig.method,
                nextConfig
            );
        },

        head(headers) {
            var nextConfig = _generateRequestConfig('head', url, {}, headers);

            return config._parent().request(
                nextConfig.method,
                nextConfig
            );
        },

    };

    model = assign(function() {
        return config._parent();
    }, model);

    configurable(model, config);

    return model;
}
