import collection from 'model/collection';
import endpoint from 'model/endpoint';
import responseBuilder from 'service/responseBuilder';
import resource from 'model/resource';

export default function member(name, id, parent) {
    var refEndpoint = endpoint([parent.url(), name].join('/'), parent());

    var model = {

        get(params, headers) {
            return refEndpoint
                .get(id, params, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse, function() {
                        return model;
                    });
                });
        },

        put(data, headers) {
            return refEndpoint.put(id, data, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse);
                });
        },

        patch(data, headers) {
            return refEndpoint.patch(id, data, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse);
                });
        },

        head(data, headers) {
            return refEndpoint.head(id, data, headers)
                .then(function(serverResponse) {
                    return responseBuilder(serverResponse);
                });
        },

        delete(headers) {
            return refEndpoint.delete(id, headers)
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
            return [parent.url(), name, id].join('/')
        },
    };

    // We override model because one and all need it as a closure
    model = Object.assign(resource(refEndpoint), model);

    return model;
};
