import assign from 'object-assign';
import { fromJS, List, Iterable } from 'immutable';
import serialize from '../util/serialize';

/* eslint-disable new-cap */
function reducePromiseList(list, initialValue, params = []) {
    return list.reduce((promise, nextItem) => {
        return promise.then(currentValue => {
            return Promise.resolve(nextItem(serialize(currentValue), ...params))
                .then((nextValue) => {
                    if (!Iterable.isIterable(currentValue)) {
                        return assign({}, currentValue, nextValue);
                    }

                    return currentValue.mergeDeep(nextValue);
                });
        });
    }, Promise.resolve(initialValue));
}

export default function(httpBackend) {
    return (config) => {
        const errorInterceptors = List(config.get('errorInterceptors'));
        const requestInterceptors = List(config.get('requestInterceptors'));
        const responseInterceptors = List(config.get('responseInterceptors'));
        const currentConfig = config
            .delete('errorInterceptors')
            .delete('requestInterceptors')
            .delete('responseInterceptors');

        return reducePromiseList(requestInterceptors, currentConfig)
            .then((transformedConfig) => {
                return httpBackend(serialize(transformedConfig)).then((response) => {
                    return reducePromiseList(responseInterceptors, fromJS(response), [serialize(transformedConfig)]);
                });
            })
            .then(null, (error) => {
                return reducePromiseList(errorInterceptors, error, [serialize(currentConfig)])
                    .then((transformedError) => Promise.reject(transformedError));
            });
    };
}
