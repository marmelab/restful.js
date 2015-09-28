export default function(data, endpoint) {
    return {
        all: endpoint.all,
        custom: endpoint.custom,
        data() {
            return data;
        },
        delete: endpoint.delete,
        id() {
            return data[endpoint.identifier()];
        },
        one: endpoint.one,
        save(...args) {
            return endpoint.put(data, ...args);
        },
        url: endpoint.url,
    };
}
