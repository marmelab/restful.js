import entity from './entity';

export default function(response, decoratedEndpoint) {
    const url = decoratedEndpoint.url();
    const identifier = decoratedEndpoint.identifier();

    return {
        statusCode() {
            return response.statusCode;
        },
        body(hydrate = true) {
            const { data } = response;

            if (!hydrate) {
                return data;
            }

            if (Object.prototype.toString.call(data) === '[object Array]') {
                if (decoratedEndpoint.all) {
                    throw new Error('Unexpected array as response, you should use all method for that');
                }

                return data.map((datum) => {
                    const id = datum[identifier];
                    return entity(datum, decoratedEndpoint.new(`${url}/${id}`));
                });
            }

            if (!decoratedEndpoint.all) {
                throw new Error('Expected array as response, you should use one method for that');
            }

            return entity(data, decoratedEndpoint);
        },
        headers() {
            return response.headers;
        },
    };
}
