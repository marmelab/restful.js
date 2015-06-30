import assign from 'object-assign';
import endpoint from 'model/endpoint';
import responseBuilder from 'service/responseBuilder';
import member from 'model/member';
import resource from 'model/resource';

export default function collection(name, parent) {
    var url = parent.customUrl && parent.customUrl() ? parent.customUrl() : [parent.url(), name].join('/');

    var refEndpoint = endpoint(url, parent());

    function refEndpointFactory(id) {
        var _endpoint = endpoint(url + '/' + id, parent());

        // Configure the endpoint
        // We do it this way because the request must have an endpoint which inherits from this collection config
        _endpoint
            .headers(refEndpoint.headers())
            .responseInterceptors(refEndpoint.responseInterceptors())
            .requestInterceptors(refEndpoint.requestInterceptors());

        return _endpoint;
    }

    function memberFactory(id) {
        var _member = member(name, id, parent);

        // Configure the endpoint
        // We do it this way because the response must have a member which inherits from this collection config
        _member()
            .headers(refEndpoint.headers())
            .responseInterceptors(refEndpoint.responseInterceptors())
            .requestInterceptors(refEndpoint.requestInterceptors());

        return _member;
    }

    var model = {
        get(id, params, headers) {
            return refEndpointFactory(id)
                .get(params, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse, memberFactory);
                });
        },

        getAll(params, headers) {
            return refEndpoint
                .getAll(params, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse, memberFactory);
                });
        },

        post(data, headers) {
            return refEndpoint
                .post(data, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse);
                });
        },

        put(id, data, headers) {
            return refEndpointFactory(id)
                .put(data, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse);
                });
        },

        patch(id, data, headers) {
            return refEndpointFactory(id)
                .patch(data, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse);
                });
        },

        head(id, data, headers) {
            return refEndpointFactory(id)
                .head(data, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse);
                });
        },

        delete(id, headers, data) {
            return refEndpointFactory(id)
                .delete(headers,data)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse);
                });
        },

        url() {
            return url;
        }
    };

    return assign(resource(refEndpoint), model);
}
