import entity from 'model/entity';

export default function response(serverResponse, memberFactory) {
    var model = {
        status() {
            return serverResponse.status;
        },

        body(hydrate = true) {
            if (!hydrate) {
                return serverResponse.data;
            }

            if (Object.prototype.toString.call(serverResponse.data) === '[object Array]') {
                return serverResponse.data.map(function(datum) {
                    return entity(datum.id, datum, memberFactory(datum.id));
                });
            }

            return entity(
                serverResponse.data.id,
                serverResponse.data,
                memberFactory(serverResponse.data.id)
            );
        },

        headers() {
            return serverResponse.headers;
        },
    };

    return Object.assign(function () {
        return serverResponse;
    }, model);
};
