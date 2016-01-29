import entity from './entity';
import { List } from 'immutable';
import serialize from '../util/serialize';
import warning from 'warning';

/* eslint-disable new-cap */
export default function (response, decoratedEndpoint) {
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
                warning(response.get('method') !== 'get' || !decoratedEndpoint.all, 'Unexpected array as response, you should use all method for that');

                return serialize(data.map((datum) => {
                    const id = datum.get(identifier);
                    return entity(serialize(datum), decoratedEndpoint.custom(`${id}`));
                }));
            }

            warning(response.get('method') !== 'get' || decoratedEndpoint.all, 'Expected array as response, you should use one method for that');

            return entity(serialize(data), decoratedEndpoint);
        },
        headers() {
            return serialize(response.get('headers'));
        },
    };
}
