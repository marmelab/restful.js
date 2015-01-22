'use strict';

var configurator = require('./configurator'),
    entity = require('./entity'),
    inherit = require('../util/inherit');

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

function merge(master, slave) {
    var merged = {};

    for (var i in slave) {
        merged[i] = slave[i];
    }

    for (var i in master) {
        merged[i] = master[i];
    }

    return merged;
}

function createEntity(id, data, model) {
    var config = model.config(),
        entityEnpoint = inherit(model, config._parent().one(config.name(), id));

    // Reset the real parent
    entityEnpoint
        .config()
        ._parent(config._parent());

    return entity(id, data, entityEnpoint);
}

function endpoint(name, id, referrer) {
    var model = {},
        config = configurator({
            _httpBackend: null,
            _parent: null,
            headers: {},
            id: id !== undefined ? id : null,
            name: name,
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
        headers = headers ? merge(headers, config.headers()) : config.headers();

        return config._httpBackend().get(
            model.url(config.id() || id),
            {
                params: params || {},
                headers: headers,
                transformResponse: [transformerFactory(config.responseInterceptors())]
            }
        );
    };

    model.get = function(id, params, headers) {
        return model.rawGet(id, params, headers).then(function(response) {
            return createEntity(id, response.data, model);
        });
    };

    model.rawGetAll = function(params, headers) {
        return model.rawGet(null, params, headers);
    };

    model.getAll = function(params, headers) {
        return model.rawGet(null, params, headers).then(function(responses) {
            return responses.data.map(function(data) {
                return createEntity(data.id, data, model);
            });
        });
    };

    model.rawPost = function(data, headers) {
        headers = headers ? merge(headers, config.headers()) : config.headers();

        return config._httpBackend().post(
            model.url(),
            data,
            {
                headers: headers,
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
        headers = headers ? merge(headers, config.headers()) : config.headers();

        return config._httpBackend().put(
            model.url(config.id() || id),
            data,
            {
                headers: headers,
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

    model.rawPatch = function(id, data, headers) {
        headers = headers ? merge(headers, config.headers()) : config.headers();

        return config._httpBackend().patch(
            model.url(config.id() || id),
            data,
            {
                headers: headers,
                transformRequest: [transformerFactory(config.requestInterceptors())],
                transformResponse: [transformerFactory(config.responseInterceptors())]
            }
        );
    };

    model.patch = function(id, data, headers) {
        return model.rawPatch(id, data, headers).then(function(response) {
            return response.data;
        });
    };

    model.rawDelete = function(id, headers) {
        headers = headers ? merge(headers, config.headers()) : config.headers();

        return config._httpBackend().delete(
            model.url(config.id() || id),
            {
                headers: headers,
                transformResponse: [transformerFactory(config.responseInterceptors())]
            }
        );
    };

    model.delete = function(id, headers) {
        return model.rawDelete(id, headers).then(function(response) {
            return response.data;
        });
    };

    model.head = function(id, headers) {
        headers = headers ? merge(headers, config.headers()) : config.headers();

        return config._httpBackend().head(
            model.url(config.id() || id),
            {
                headers: headers,
                transformResponse: [transformerFactory(config.responseInterceptors())]
            }
        );
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
