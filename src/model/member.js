'use strict';

var endpoint = require('./endpoint'),
    entity = require('./entity'),
    collection = require('./collection'),
    resource = require('./resource');

function member(name, id, parent) {
    var refEndpoint = endpoint([parent.url(), name].join('/'), parent());

    var model = resource(refEndpoint);

    function model() {
        return refEndpoint;
    };

    model.get = function(params, headers) {
        return refEndpoint
            .get(id, params, headers)
            .then(function(response) {
                return entity(
                    id,
                    response,
                    model
                );
            });
    };

    model.put = function(data, headers) {
        return refEndpoint.put(id, data, headers);
    };

    model.patch = function(data, headers) {
        return refEndpoint.patch(id, data, headers);
    };

    model.head = function(data, headers) {
        return refEndpoint.head(id, data, headers);
    };

    model.delete = function(headers) {
        return refEndpoint.delete(id, headers);
    };

    model.one = function(name, id) {
        return member(name, id, model);
    };

    model.all = function(name) {
        return collection(name, model);
    };

    model.url = function() {
        return [parent.url(), name, id].join('/')
    };

    model.factory = member;

    return model;
};

module.exports = member;
