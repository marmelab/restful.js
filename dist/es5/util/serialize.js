'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _immutable = require('immutable');

exports['default'] = function (value) {
    if (_immutable.Iterable.isIterable(value)) {
        return value.toJS();
    }

    return value;
};

module.exports = exports['default'];