import assign from 'object-assign';

export default function resource(refEndpoint) {
    function modelFunc() {
        return refEndpoint;
    }

    var model = assign(modelFunc, {
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
