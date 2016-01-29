'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.custom = custom;
exports.collection = collection;
exports.member = member;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function custom(endpoint) {
    return function (name) {
        var relative = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        if (relative) {
            return member(endpoint['new'](endpoint.url() + '/' + name)); // eslint-disable-line no-use-before-define
        }

        return member(endpoint['new'](name)); // eslint-disable-line no-use-before-define
    };
}

function collection(endpoint) {
    function _bindHttpMethod(method) {
        return function () {
            var _member;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var id = args.shift();
            return (_member = member(endpoint['new'](endpoint.url() + '/' + id)))[method].apply(_member, args); // eslint-disable-line no-use-before-define
        };
    }

    return (0, _objectAssign2['default'])(endpoint, {
        custom: custom(endpoint),
        'delete': _bindHttpMethod('delete'),
        getAll: endpoint.get,
        get: _bindHttpMethod('get'),
        head: _bindHttpMethod('head'),
        patch: _bindHttpMethod('patch'),
        put: _bindHttpMethod('put')
    });
}

function member(endpoint) {
    return (0, _objectAssign2['default'])(endpoint, {
        all: function all(name) {
            return collection(endpoint['new'](endpoint.url() + '/' + name));
        },
        custom: custom(endpoint),
        one: function one(name, id) {
            return member(endpoint['new'](endpoint.url() + '/' + name + '/' + id));
        }
    });
}