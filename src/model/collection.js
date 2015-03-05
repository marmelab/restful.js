'use strict';

import endpoint from 'model/endpoint';
import entity from 'model/entity';
import member from 'model/member';
import resource from 'model/resource';

export default function collection(name, parent) {
    var refEndpoint = endpoint([parent.url(), name].join('/'), parent());

    var model = {
        get(id, params, headers) {
            var entityMember = member(name, id, parent);

            // Configure the endpoint
            // We do it this way because the entity must have a member which inherits from this collection config
            entityMember()
                .headers(refEndpoint.headers())
                .responseInterceptors(refEndpoint.responseInterceptors())
                .requestInterceptors(refEndpoint.requestInterceptors());

            return refEndpoint
                .get(id, params, headers)
                .then(function(response) {
                    return entity(
                        id,
                        response,
                        entityMember
                    );
                });
        },

        getAll(params, headers) {
            return refEndpoint
                .getAll(params, headers)
                .then(function(response) {
                    return response.data.map(function(data) {
                        response = JSON.parse(JSON.stringify(response));
                        response.data = data;

                        var entityMember = member(name, data.id, parent);

                        // Configure the endpoint
                        // We do it this way because the entity must have a member which inherits from this collection config
                        entityMember()
                            .headers(refEndpoint.headers())
                            .responseInterceptors(refEndpoint.responseInterceptors())
                            .requestInterceptors(refEndpoint.requestInterceptors());

                        return entity(
                            data.id,
                            response,
                            entityMember
                        );
                    });
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
