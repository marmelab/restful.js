export default function resource(refEndpoint) {
    function model() {
        return refEndpoint;
    }

    model = Object.assign(model, {
        addRequestInterceptor(interceptor) {
            refEndpoint.requestInterceptors().push(interceptor);

            return model;
        },

        requestInterceptors() {
            return refEndpoint.requestInterceptors()
        },

        addResponseInterceptor(interceptor) {
            refEndpoint.responseInterceptors().push(interceptor);

            return model;
        },

        responseInterceptors() {
            return refEndpoint.responseInterceptors;
        },

        header(name, value) {
            refEndpoint.headers()[name] = value;

            return model
        },

        headers() {
            return refEndpoint.headers();
        },
    });

    return model;
}
