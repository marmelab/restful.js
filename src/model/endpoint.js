import assign from 'object-assign';
import configurable from 'util/configurable';

export default function endpoint(url, parent) {
    let config = {
            _parent: parent,
            headers: {},
            fullRequestInterceptors: [],
            fullResponseInterceptors: [],
            requestInterceptors: [],
            responseInterceptors:[],
        };

    let model;

    function _mergeProperty(propertyName) {
        let current = model,
            isLitteral = current[propertyName]().length === undefined,
            properties = isLitteral ? {} : [];

        while (current) {
            if (isLitteral) {
                properties = assign({}, current[propertyName](), properties);
            } else {
                properties = properties.concat(current[propertyName]());
            }

            current = current._parent ? current._parent() : null;
        }

        return properties;
    }

    function _generateRequestConfig(method, params = null, headers = {}, data = null) {
        let config = {
            method: method,
            url: url,
            params: params,
            headers: assign({}, _mergeProperty('headers'), headers),
            responseInterceptors: _mergeProperty('responseInterceptors'),
            fullResponseInterceptors: _mergeProperty('fullResponseInterceptors'),
        };

        if (data) {
            config.data = data;
            config.requestInterceptors = _mergeProperty('requestInterceptors');
        }

        let interceptors = _mergeProperty('fullRequestInterceptors');

        for (let i in interceptors) {
            config = assign(config, interceptors[i](params, headers, data, method, url));
        }

        return config;
    }

    function _request(method, params, headers, data) {
        let nextConfig = _generateRequestConfig(method, params, headers, data);

        return config._parent().request(
            nextConfig.method,
            nextConfig
        );
    }

    function _normalizeContentType(headers = {}) {
        let _headers = _mergeProperty('headers');

        if (!_headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=UTF-8';
        }

        return headers;
    }

    model = assign(function() {
        return config._parent();
    }, {
        get: (params, headers) => _request('get', params, headers),

        post: (data, headers) => _request('post', null, _normalizeContentType(headers), data),

        put: (data, headers) => _request('put', null, _normalizeContentType(headers), data),

        patch: (data, headers) => _request('patch', null, _normalizeContentType(headers), data),

        delete: (data, headers) => request('delete', url, {}, headers, data),

        head: (headers) => _request('head', null, headers),
    });

    configurable(model, config);

    return model;
}
