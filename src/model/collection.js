'use strict';

import endpoint from 'model/endpoint';
import responseBuilder from 'service/responseBuilder';
import member from 'model/member';
import resource from 'model/resource';

export default function collection(name, parent) {
    var refEndpoint = endpoint([parent.url(), name].join('/'), parent());

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
            return refEndpoint
                .get(id, params, headers)
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
            return refEndpoint.post(data, headers);
        },

        put(id, data, headers) {
            return refEndpoint.put(id, data, headers);
        },

        patch(id, data, headers) {
            return refEndpoint.patch(id, data, headers);
        },

        head(id, data, headers) {
            return refEndpoint.head(id, data, headers);
        },

        delete(id, headers) {
            return refEndpoint.delete(id, headers);
        },

        url() {
            return [parent.url(), name].join('/');
        },
    };

    return Object.assign(resource(refEndpoint), model);
};
