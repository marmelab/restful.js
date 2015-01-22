'use strict';

var configurator = require('./configurator'),
    entity = require('./entity');

function transformerFactory(transformers) {
    return function(data) {
        var parsedData;

        try {
            parsedData = JSON.parse(data);
        } catch (e) {
            parsedData = data;
        }

        for (var i in transformers) {
            parsedData = transformers[i](parsedData);
        }

        return parsedData;
    }
};

function endpoint(name, id, referrer) {
    var model = {},
        config = configurator({
            name: name,
            id: id !== undefined ? id : null,
            _parent: null,
            _httpBackend: null,
            requestInterceptors: [],
            responseInterceptors: []
        }, referrer);

    model.config = function() {
        return config;
    };

    model.url = function(id) {
        var url = config._parent().url() + '/' + config.name();

        if (~~id === id) {
            url += '/' + id;
        }

        return url;
    };

    model.rawGet = function(id, params, headers) {
        return config._httpBackend().get(
            model.url(config.id() || id),
            {
                params: params || {},
                headers: headers || {},
                transformResponse: [transformerFactory(config.responseInterceptors())]
            }
        );
    };

    model.get = function(id, params, headers) {
        return model.rawGet(id, params, headers).then(function(response) {
            return entity(id, response.data, config._parent().one(config.name(), id));
        });
    };

    model.rawGetAll = function(params, headers) {
        return model.rawGet(null, params, headers);
    };

    model.getAll = function(params, headers) {
        return model.rawGet(null, params, headers).then(function(responses) {
            return responses.data.map(function(data) {
                return entity(data.id, data, config._parent().one(config.name(), data.id));
            });
        });
    };

    model.rawPost = function(data, headers) {
        return config._httpBackend().post(
            model.url(),
            data,
            {
                headers: headers || {},
                transformRequest: [transformerFactory(config.requestInterceptors())],
                transformResponse: [transformerFactory(config.responseInterceptors())]
            }
        );
    };

    model.post = function(data, headers) {
        return model.rawPost(data, headers).then(function(response) {
            return response.data;
        });
    };

    model.rawPut = function(id, data, headers) {
        return config._httpBackend().put(
            model.url(config.id() || id),
            data,
            {
                headers: headers || {},
                transformRequest: [transformerFactory(config.requestInterceptors())],
                transformResponse: [transformerFactory(config.responseInterceptors())]
            }
        );
    };

    model.put = function(id, data, headers) {
        return model.rawPut(id, data, headers).then(function(response) {
            return response.data;
        });
    };

    model.rawDelete = function(id, headers) {
        return config._httpBackend().delete(
            model.url(config.id() || id),
            {
                headers: headers || {},
                transformResponse: [transformerFactory(config.responseInterceptors())]
            }
        );
    };

    model.delete = function(id, headers) {
        return model.rawDelete(id, headers).then(function(response) {
            return response.data;
        });
    };

    model.requestInterceptor = function(interceptor) {
        config.requestInterceptors().push(interceptor);

        return model;
    };

    model.responseInterceptor = function(interceptor) {
        config.responseInterceptors().push(interceptor);

        return model;
    };

    return model;
};

module.exports = endpoint;
