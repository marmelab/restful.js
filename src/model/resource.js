export default function resource(refEndpoint) {
    var model = {
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
    };

    return Object.assign(function() {
        return refEndpoint;
    }, model);
}
