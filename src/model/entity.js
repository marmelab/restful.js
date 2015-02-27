'use strict';

function entity(id, response, member) {
    function model() {
        return response;
    }

    model.one = function(name, id) {
        return member.one(name, id);
    };

    model.all = function(name) {
        return member.all(name);
    };

    model.save = function(headers) {
        return member.put(response.data, headers);
    };

    model.remove = function(headers) {
        return member.delete(headers);
    };

    model.url = function() {
        return member.url(id);
    };

    model.id = function() {
        return id;
    };

    return model;
};

module.exports = entity;
