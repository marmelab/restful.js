'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _immutable = require('immutable');

var _utilSerialize = require('../util/serialize');

var _utilSerialize2 = _interopRequireDefault(_utilSerialize);

/* eslint-disable new-cap */
function reducePromiseList(emitter, list, initialValue) {
    var params = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

    return list.reduce(function (promise, nextItem) {
        return promise.then(function (currentValue) {
            emitter.apply(undefined, ['pre', (0, _utilSerialize2['default'])(currentValue)].concat(_toConsumableArray(params), [nextItem.name]));
            return Promise.resolve(nextItem.apply(undefined, [(0, _utilSerialize2['default'])(currentValue)].concat(_toConsumableArray(params)))).then(function (nextValue) {
                if (!_immutable.Iterable.isIterable(currentValue)) {
                    return (0, _objectAssign2['default'])({}, currentValue, nextValue);
                }

                return currentValue.mergeDeep(nextValue);
            }).then(function (nextValue) {
                emitter.apply(undefined, ['post', (0, _utilSerialize2['default'])(nextValue)].concat(_toConsumableArray(params), [nextItem.name]));

                return nextValue;
            });
        });
    }, Promise.resolve(initialValue));
}

exports['default'] = function (httpBackend) {
    return function (config, emitter) {
        var errorInterceptors = (0, _immutable.List)(config.get('errorInterceptors'));
        var requestInterceptors = (0, _immutable.List)(config.get('requestInterceptors'));
        var responseInterceptors = (0, _immutable.List)(config.get('responseInterceptors'));
        var currentConfig = config['delete']('errorInterceptors')['delete']('requestInterceptors')['delete']('responseInterceptors');

        function emitterFactory(type) {
            return function (event) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                emitter.apply(undefined, [type + ':' + event].concat(args));
            };
        }

        return reducePromiseList(emitterFactory('request:interceptor'), requestInterceptors, currentConfig).then(function (transformedConfig) {
            emitter('request', (0, _utilSerialize2['default'])(transformedConfig));
            return httpBackend((0, _utilSerialize2['default'])(transformedConfig)).then(function (response) {
                return reducePromiseList(emitterFactory('response:interceptor'), responseInterceptors, (0, _immutable.fromJS)(response), [(0, _utilSerialize2['default'])(transformedConfig)]);
            });
        }).then(null, function (error) {
            return reducePromiseList(emitterFactory('error:interceptor'), errorInterceptors, error, [(0, _utilSerialize2['default'])(currentConfig)]).then(function (transformedError) {
                return Promise.reject(transformedError);
            });
        });
    };
};

module.exports = exports['default'];