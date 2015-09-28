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
function reducePromiseList(list, initialValue) {
    var params = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    return list.reduce(function (promise, nextItem) {
        return promise.then(function (currentValue) {
            return Promise.resolve(nextItem.apply(undefined, [(0, _utilSerialize2['default'])(currentValue)].concat(_toConsumableArray(params)))).then(function (nextValue) {
                if (!_immutable.Iterable.isIterable(currentValue)) {
                    return (0, _objectAssign2['default'])({}, currentValue, nextValue);
                }

                return currentValue.mergeDeep(nextValue);
            });
        });
    }, Promise.resolve(initialValue));
}

exports['default'] = function (httpBackend) {
    return function (config) {
        var errorInterceptors = (0, _immutable.List)(config.get('errorInterceptors'));
        var requestInterceptors = (0, _immutable.List)(config.get('requestInterceptors'));
        var responseInterceptors = (0, _immutable.List)(config.get('responseInterceptors'));
        var currentConfig = config['delete']('errorInterceptors')['delete']('requestInterceptors')['delete']('responseInterceptors');

        return reducePromiseList(requestInterceptors, currentConfig).then(function (transformedConfig) {
            return httpBackend((0, _utilSerialize2['default'])(transformedConfig)).then(function (response) {
                return reducePromiseList(responseInterceptors, (0, _immutable.fromJS)(response), [(0, _utilSerialize2['default'])(transformedConfig)]);
            });
        }).then(null, function (error) {
            return reducePromiseList(errorInterceptors, error, [(0, _utilSerialize2['default'])(currentConfig)]).then(function (transformedError) {
                return Promise.reject(transformedError);
            });
        });
    };
};

module.exports = exports['default'];