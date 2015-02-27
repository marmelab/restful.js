'use strict';

var endpoint = require('./endpoint'),
    entity = require('./entity'),
    resource = require('./resource');

function collection(name, parent) {
    var refEndpoint = endpoint(name, null, parent()),
        model = resource(refEndpoint);

    model.get = function(id, params, headers) {
        var member = parent.factory(name, id, parent); // We use this way to avoid circular dependencies

        // Configure the endpoint
        member()
            .headers(refEndpoint.headers())
            .responseInterceptors(refEndpoint.responseInterceptors())
            .requestInterceptors(refEndpoint.requestInterceptors());

        return refEndpoint
            .get(id, params, headers)
            .then(function(response) {
                return entity(
                    id,
                    response,
                    member
                );
            });
    };

    model.getAll = function(params, headers) {
        return refEndpoint
            .getAll(params, headers)
            .then(function(response) {
                return response.data.map(function(data) {
                    response = JSON.parse(JSON.stringify(response));
                    response.data = data;

                    var member = parent.factory(name, data.id, parent); // We use this way to avoid circular dependencies

                    // Configure the endpoint
                    member()
                        .headers(refEndpoint.headers())
                        .responseInterceptors(refEndpoint.responseInterceptors())
                        .requestInterceptors(refEndpoint.requestInterceptors());

                    return entity(
                        data.id,
                        response,
                        member
                    );
                });
            });
    };

    model.post = function(data, headers) {
        return refEndpoint.post(data, headers);
    };

    model.put = function(id, data, headers) {
        return refEndpoint.put(id, data, headers);
    };

    model.patch = function(id, data, headers) {
        return refEndpoint.patch(id, data, headers);
    };

    model.head = function(id, data, headers) {
        return refEndpoint.head(id, data, headers);
    };

    model.delete = function(id, headers) {
        return refEndpoint.delete(id, headers);
    };

    model.url = function() {
        return refEndpoint.url();
    };

    return model;
};

module.exports = collection;
