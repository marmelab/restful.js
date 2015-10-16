import assign from 'object-assign';
import { fromJS, List, Iterable } from 'immutable';
import serialize from '../util/serialize';

/* eslint-disable new-cap */
function reducePromiseList(emitter, list, initialValue, params = []) {
    return list.reduce((promise, nextItem) => {
        return promise.then(currentValue => {
            emitter('pre', serialize(currentValue), ...params, nextItem.name);
            return Promise.resolve(nextItem(serialize(currentValue), ...params))
                .then((nextValue) => {
                    if (!Iterable.isIterable(currentValue)) {
                        return assign({}, currentValue, nextValue);
                    }

                    return currentValue.mergeDeep(nextValue);
                })
                .then((nextValue) => {
                    emitter('post', serialize(nextValue), ...params, nextItem.name);

                    return nextValue;
                });
        });
    }, Promise.resolve(initialValue));
}

export default function(httpBackend) {
    return (config, emitter) => {
        const errorInterceptors = List(config.get('errorInterceptors'));
        const requestInterceptors = List(config.get('requestInterceptors'));
        const responseInterceptors = List(config.get('responseInterceptors'));
        const currentConfig = config
            .delete('errorInterceptors')
            .delete('requestInterceptors')
            .delete('responseInterceptors');

        function emitterFactory(type) {
            return (event, ...args) => {
                emitter(`${type}:${event}`, ...args);
            };
        }

        return reducePromiseList(emitterFactory('request:interceptor'), requestInterceptors, currentConfig)
            .then((transformedConfig) => {
                emitter('request', serialize(transformedConfig));
                return httpBackend(serialize(transformedConfig)).then((response) => {
                    return reducePromiseList(emitterFactory('response:interceptor'), responseInterceptors, fromJS(response), [serialize(transformedConfig)]);
                });
            })
            .then(null, (error) => {
                return reducePromiseList(emitterFactory('error:interceptor'), errorInterceptors, error, [serialize(currentConfig)])
                    .then((transformedError) => Promise.reject(transformedError));
            });
    };
}
