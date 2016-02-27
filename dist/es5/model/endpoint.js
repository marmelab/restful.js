'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

var _immutable = require('immutable');

var _utilSerialize = require('../util/serialize');

var _utilSerialize2 = _interopRequireDefault(_utilSerialize);

/* eslint-disable new-cap */

exports['default'] = function (request) {
    return function endpointFactory(scope) {
        scope.on('error', function () {
            return true;
        }); // Add a default error listener to prevent unwanted exception
        var endpoint = {}; // Persists reference

        function _generateRequestConfig(method, data, params, headers) {
            var config = (0, _immutable.Map)({
                errorInterceptors: (0, _immutable.List)(scope.get('errorInterceptors')),
                headers: (0, _immutable.Map)(scope.get('headers')).mergeDeep((0, _immutable.Map)(headers)),
                method: method,
                params: params,
                requestInterceptors: (0, _immutable.List)(scope.get('requestInterceptors')),
                responseInterceptors: (0, _immutable.List)(scope.get('responseInterceptors')),
                url: scope.get('url')
            });

            if (data) {
                if (!config.hasIn(['headers', 'Content-Type'])) {
                    config = config.setIn(['headers', 'Content-Type'], 'application/json;charset=UTF-8');
                }

                config = config.set('data', (0, _immutable.fromJS)(data));
            }

            return config;
        }

        function _onResponse(config, rawResponse) {
            var response = (0, _response2['default'])(rawResponse, endpoint);
            scope.emit('response', response, (0, _utilSerialize2['default'])(config));
            return response;
        }

        function _onError(config, error) {
            scope.emit('error', error, (0, _utilSerialize2['default'])(config));
            throw error;
        }

        function _httpMethodFactory(method) {
            var expectData = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            var emitter = function emitter() {
                scope.emit.apply(scope, arguments);
            };

            if (expectData) {
                return function (data) {
                    var params = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
                    var headers = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

                    var config = _generateRequestConfig(method, data, params, headers);
                    return request(config, emitter).then(function (rawResponse) {
                        return _onResponse(config, rawResponse);
                    }, function (rawResponse) {
                        return _onError(config, rawResponse);
                    });
                };
            }

            return function () {
                var params = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
                var headers = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                var config = _generateRequestConfig(method, null, params, headers);
                return request(config, emitter).then(function (rawResponse) {
                    return _onResponse(config, rawResponse);
                }, function (error) {
                    return _onError(config, error);
                });
            };
        }

        function addInterceptor(type) {
            return function (interceptor) {
                scope.push(type + 'Interceptors', interceptor);

                return endpoint;
            };
        }

        (0, _objectAssign2['default'])(endpoint, {
            addErrorInterceptor: addInterceptor('error'),
            addRequestInterceptor: addInterceptor('request'),
            addResponseInterceptor: addInterceptor('response'),
            'delete': _httpMethodFactory('DELETE'),
            identifier: function identifier(newIdentifier) {
                if (newIdentifier === undefined) {
                    return scope.get('config').get('entityIdentifier');
                }

                scope.assign('config', 'entityIdentifier', newIdentifier);

                return endpoint;
            },
            get: _httpMethodFactory('GET', false),
            head: _httpMethodFactory('HEAD', false),
            header: function header(key, value) {
                return scope.assign('headers', key, value);
            },
            headers: function headers() {
                return scope.get('headers');
            },
            'new': function _new(url) {
                var childScope = scope['new']();
                childScope.set('url', url);

                return endpointFactory(childScope);
            },
            on: scope.on,
            once: scope.once,
            patch: _httpMethodFactory('PATCH'),
            post: _httpMethodFactory('POST'),
            put: _httpMethodFactory('PUT'),
            url: function url() {
                return scope.get('url');
            }
        });

        return endpoint;
    };
};

module.exports = exports['default'];