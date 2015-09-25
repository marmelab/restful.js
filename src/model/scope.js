import { EventEmitter } from 'events';
import { List, Map, Iterable } from 'immutable';

/* eslint-disable new-cap */
export default function scopeFactory(parentScope) {
    let _data = Map();
    const _emitter = new EventEmitter();

    const scope = {
        assign(key, subKey, value) {
            if (!scope.has(key)) {
                scope.set(key, Map());
            }

            _data = _data.setIn([key, subKey], value);
            return scope;
        },
        emit(...args) {
            _emitter.emit(...args);

            if (parentScope) {
                parentScope.emit(...args);
            }
        },
        get(key) {
            const datum = _data.get(key);

            if ((scope.has(key) && !Iterable.isIterable(datum)) || !parentScope) {
                return datum;
            } else if (!scope.has(key) && parentScope) {
                return parentScope.get(key);
            }

            const parentDatum = parentScope.get(key);

            if (!parentDatum) {
                return datum;
            }

            if (List.isList(parentDatum)) {
                return parentDatum.concat(datum);
            }

            return parentDatum.mergeDeep(datum);
        },
        has(key) {
            return _data.has(key);
        },
        new() {
            return scopeFactory(scope);
        },
        on: _emitter.on.bind(_emitter),
        once: _emitter.once.bind(_emitter),
        push(key, value) {
            if (!scope.has(key)) {
                scope.set(key, List());
            }

            _data = _data.update(key, (list) => list.push(value));
            return scope;
        },
        set(key, value) {
            _data = _data.set(key, value);
            return scope;
        },
    };

    return scope;
}
