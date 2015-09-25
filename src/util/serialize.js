import { Iterable } from 'immutable';

export default function(value) {
    if (Iterable.isIterable(value)) {
        return value.toJS();
    }

    return value;
}
