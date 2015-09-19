import assign from 'object-assign';
import { EventEmitter } from 'events';

export default function scopeFactory(parentScope) {
    const _data = {};
    const _emitter = new EventEmitter();

    const scope = {
        assign(key, subKey, value) {
            if (!scope.has(key)) {
                scope.set(key, {});
            }

            _data[key][subKey] = value;
            return scope;
        },
        emit(...args) {
            _emitter.emit(...args);

            if (parentScope) {
                parentScope.emit(...args);
            }
        },
        get(key) {
            const datum = _data[key];

            if ((scope.has(key) && typeof(datum) !== 'object') || !parentScope) {
                return datum;
            } else if (!scope.has(key) && parentScope) {
                return parentScope.get(key);
            }

            const parentDatum = parentScope.get(key);

            if (datum.length === undefined) {
                return assign({}, parentDatum, datum);
            }

            return (parentDatum || []).concat(datum);
        },
        has(key) {
            return _data.hasOwnProperty(key);
        },
        new() {
            return scopeFactory(scope);
        },
        on: _emitter.on.bind(_emitter),
        once: _emitter.once.bind(_emitter),
        push(key, value) {
            if (!scope.has(key)) {
                scope.set(key, []);
            }

            _data[key].push(value);
            return scope;
        },
        set(key, value) {
            _data[key] = value;
            return scope;
        },
    };

    return scope;
}
