import assign from 'object-assign';

export default function resource(refEndpoint) {
    function modelFunc() {
        return refEndpoint;
    }

    let model = assign(modelFunc, {
        addFullRequestInterceptor(interceptor) {
            refEndpoint.fullRequestInterceptors().push(interceptor);

            return model;
        },

        fullRequestInterceptors() {
            return refEndpoint.fullRequestInterceptors();
        },

        addFullResponseInterceptor(interceptor) {
            refEndpoint.fullResponseInterceptors().push(interceptor);

            return model;
        },

        fullResponseInterceptors() {
            return refEndpoint.fullResponseInterceptors();
        },

        addRequestInterceptor(interceptor) {
            refEndpoint.requestInterceptors().push(interceptor);

            return model;
        },

        requestInterceptors() {
            return refEndpoint.requestInterceptors();
        },

        addResponseInterceptor(interceptor) {
            refEndpoint.responseInterceptors().push(interceptor);

            return model;
        },

        responseInterceptors() {
            return refEndpoint.responseInterceptors();
        },

        header(name, value) {
            refEndpoint.headers()[name] = value;

            return model;
        },

        headers() {
            return refEndpoint.headers();
        }
    });

    return model;
}
