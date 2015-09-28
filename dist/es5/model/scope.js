'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = scopeFactory;

var _events = require('events');

var _immutable = require('immutable');

/* eslint-disable new-cap */

function scopeFactory(parentScope) {
    var _data = (0, _immutable.Map)();
    var _emitter = new _events.EventEmitter();

    var scope = {
        assign: function assign(key, subKey, value) {
            if (!scope.has(key)) {
                scope.set(key, (0, _immutable.Map)());
            }

            _data = _data.setIn([key, subKey], value);
            return scope;
        },
        emit: function emit() {
            _emitter.emit.apply(_emitter, arguments);

            if (parentScope) {
                parentScope.emit.apply(parentScope, arguments);
            }
        },
        get: function get(key) {
            var datum = _data.get(key);

            if (scope.has(key) && !_immutable.Iterable.isIterable(datum) || !parentScope) {
                return datum;
            } else if (!scope.has(key) && parentScope) {
                return parentScope.get(key);
            }

            var parentDatum = parentScope.get(key);

            if (!parentDatum) {
                return datum;
            }

            if (_immutable.List.isList(parentDatum)) {
                return parentDatum.concat(datum);
            }

            return parentDatum.mergeDeep(datum);
        },
        has: function has(key) {
            return _data.has(key);
        },
        'new': function _new() {
            return scopeFactory(scope);
        },
        on: _emitter.on.bind(_emitter),
        once: _emitter.once.bind(_emitter),
        push: function push(key, value) {
            if (!scope.has(key)) {
                scope.set(key, (0, _immutable.List)());
            }

            _data = _data.update(key, function (list) {
                return list.push(value);
            });
            return scope;
        },
        set: function set(key, value) {
            _data = _data.set(key, value);
            return scope;
        }
    };

    return scope;
}

module.exports = exports['default'];