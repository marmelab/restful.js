export default function(data, endpoint, identifier) {
    return {
        all: endpoint.all,
        custom: endpoint.custom,
        data() {
            return data;
        },
        delete(...args) {
            return endpoint.delete(...args);
        },
        id() {
            return data[identifier];
        },
        one: endpoint.one,
        save(...args) {
            return endpoint.put(data, ...args);
        },
        url: endpoint.url,
    };
}
