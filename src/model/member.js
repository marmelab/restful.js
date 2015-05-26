import assign from 'object-assign';
import collection from 'model/collection';
import endpoint from 'model/endpoint';
import responseBuilder from 'service/responseBuilder';
import resource from 'model/resource';

export default function member(name, id, parent) {
    var url = parent.customUrl && parent.customUrl() ? parent.customUrl() : [parent.url(), name, id].join('/');

    var refEndpoint = endpoint(url, parent());

    var model = {

        get(params, headers) {
            return refEndpoint
                .get(params, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse, function() {
                        return model;
                    });
                });
        },

        put(data, headers) {
            return refEndpoint.put(data, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse);
                });
        },

        patch(data, headers) {
            return refEndpoint.patch(data, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse);
                });
        },

        head(data, headers) {
            return refEndpoint.head(data, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse);
                });
        },

        delete(headers) {
            return refEndpoint.delete(headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse);
                });
        },

        one(name, id) {
            return member(name, id, model);
        },

        all(name) {
            return collection(name, model);
        },

        url() {
            return url;
        },
    };

    // We override model because one and all need it as a closure
    model = assign(resource(refEndpoint), model);

    return model;
};
