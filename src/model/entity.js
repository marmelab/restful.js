define(function(require) {
    'use strict';

    var configurable = require('util/configurable');

    function fromCamelCaseToSnakeCase(input) {
        return input.replace(/([A-Z])/g, function(ch) {
            return '_' + ch.toLowerCase();
        });
    }

    function fromSnakeCaseToCamelCase(input) {
        return input.replace(/(_[a-z])/g, function(ch) {
            return ch.toUpperCase().replace('_', '');
        });
    }

    function convertToCamelCase(data) {
        var convertedData = {};

        for (var i in data) {
            if (!data.hasOwnProperty(i)) {
                continue;
            }

            convertedData[fromSnakeCaseToCamelCase(i)] = data[i];
        }

        return convertedData;
    }

    function convertToSnakeCase(data) {
        var convertedData = {};

        for (var i in data) {
            if (!data.hasOwnProperty(i)) {
                continue;
            }

            convertedData[fromCamelCaseToSnakeCase(i)] = data[i];
        }

        return convertedData;
    }

    return function entity(id, data, endpoint) {
        var model = {},
            data = convertToCamelCase(data) || {};

        model.one = function(name, id) {
            return endpoint.one(name, id);
        };

        model.all = function(name) {
            return endpoint.one(name);
        };

        model.save = function(headers) {
            return endpoint.put(convertToSnakeCase(data), headers);
        };

        model.remove = function(headers) {
            return endpoint.delete(headers);
        };

        configurable(model, data);

        return model;
    };
});
