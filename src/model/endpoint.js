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

    function _generateRequestConfig(method, data = null, params = null, headers = {}) {
        let config = {
            method: method,
            url: url,
            params: params,
            headers: assign({}, _mergeProperty('headers'), headers),
            responseInterceptors: _mergeProperty('responseInterceptors'),
            fullResponseInterceptors: _mergeProperty('fullResponseInterceptors'),
        };

        if (data) {
            if (!config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/json;charset=UTF-8';
            }

            config.data = data;
            config.requestInterceptors = _mergeProperty('requestInterceptors');
        }

        let interceptors = _mergeProperty('fullRequestInterceptors');

        for (let i in interceptors) {
            config = assign(config, interceptors[i](params, headers, data, method, url));
        }

        return config;
    }

    function _request(method, data, params, headers) {
        let nextConfig = _generateRequestConfig(method, data, params, headers);

        return config._parent().request(
            nextConfig.method,
            nextConfig
        );
    }

    model = assign(function() {
        return config._parent();
    }, {
        get: (params, headers) => _request('get', null, params, headers),

        post: (data, headers) => _request('post', data, null, headers),

        put: (data, headers) => _request('put', data, null, headers),

        patch: (data, headers) => _request('patch', data, null, headers),

        delete: (data, headers) => request('delete', data, {}, headers),

        head: (headers) => _request('head', null, null, headers),
    });

    configurable(model, config);

    return model;
}
