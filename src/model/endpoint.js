import assign from 'object-assign';
import responseFactory from './response';

export default function(request) {
    return function endpointFactory(scope) {
        scope.on('error', () => true); // Add default error listener to prevent unwanted throw
        const endpoint = {}; // Persist reference

        function _generateRequestConfig(method, data, params, headers) {
            const config = {
                headers: assign({}, scope.get('headers'), headers || {}),
                method,
                params,
                requestInterceptors: scope.get('requestInterceptors') || [],
                responseInterceptors: scope.get('responseInterceptors') || [],
                url: scope.get('url'),
            };

            if (data) {
                if (!config.headers['Content-Type']) {
                    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
                }

                config.data = data;
            }

            scope.emit('request', assign({}, config));

            return config;
        }

        function _onResponse(config, rawResponse) {
            const response = responseFactory(rawResponse, endpoint, scope.get('config').entityIdentifier);
            scope.emit('response', assign({}, response), assign({}, config));
            return response;
        }

        function _onError(config, error) {
            scope.emit('error', error, assign({}, config));
            throw error;
        }

        function _httpMethodFactory(method, expectData = true) {
            if (expectData) {
                return (data, params = null, headers = null) => {
                    const config = _generateRequestConfig(method, data, params, headers);
                    return request(assign({}, config)).then(
                        (rawResponse) => _onResponse(assign({}, config), rawResponse),
                        (rawResponse) => _onError(assign({}, config), rawResponse)
                    );
                };
            }

            return (params = null, headers = null) => {
                const config = _generateRequestConfig(method, null,  params, headers);
                return request(assign({}, config)).then(
                    (rawResponse) => _onResponse(config, rawResponse),
                    (error) => _onError(config, error)
                );
            };
        }

        assign(endpoint, {
            addRequestInterceptor: interceptor => scope.push('requestInterceptors', interceptor),
            addResponseInterceptor: interceptor => scope.push('responseInterceptors', interceptor),
            delete: _httpMethodFactory('delete'),
            identifier: (newIdentifier) => scope.assign('config', 'entityIdentifier', newIdentifier),
            get: _httpMethodFactory('get', false),
            head: _httpMethodFactory('head', false),
            header: (key, value) => scope.assign('headers', key, value),
            headers: () => scope.get('headers'),
            new: (url) => {
                const childScope = scope.new();
                childScope.set('url', url);

                return endpointFactory(childScope);
            },
            on: scope.on,
            once: scope.once,
            patch: _httpMethodFactory('patch'),
            post: _httpMethodFactory('post'),
            put: _httpMethodFactory('put'),
            url: () => scope.get('url'),
        });

        return endpoint;
    };
}
