import entity from './entity';

export default function(response, endpoint) {
    const url = endpoint.url();
    const identifier = endpoint.identifier();

    return {
        status() {
            return response.statusCode;
        },
        body(hydrate = true) {
            const { data } = response;

            if (!hydrate) {
                return data;
            }

            if (Object.prototype.toString.call(data) === '[object Array]') {
                return data.map((datum) => {
                    const id = datum[identifier];
                    return entity(datum, endpoint.new(`${url}/${id}`));
                });
            }

            return entity(data, endpoint);
        },
        headers() {
            return response.headers;
        },
    };
}
