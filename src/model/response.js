import entity from './entity';
import { List } from 'immutable';
import serialize from '../util/serialize';

/* eslint-disable new-cap */
export default function(response, decoratedEndpoint) {
    const identifier = decoratedEndpoint.identifier();

    return {
        statusCode() {
            return serialize(response.get('statusCode'));
        },
        body(hydrate = true) {
            const data = response.get('data');

            if (!hydrate) {
                return serialize(data);
            }

            if (List.isList(data)) {
                if (decoratedEndpoint.all) {
                    throw new Error('Unexpected array as response, you should use all method for that');
                }

                return serialize(data.map((datum) => {
                    const id = datum.get(identifier);
                    return entity(serialize(datum), decoratedEndpoint.custom(`${id}`));
                }));
            }

            if (!decoratedEndpoint.all) {
                throw new Error('Expected array as response, you should use one method for that');
            }

            return entity(serialize(data), decoratedEndpoint);
        },
        headers() {
            return serialize(response.get('headers'));
        },
    };
}
