define(function(require) {
    'use strict';

    var configurable = require('util/configurable');

    return function configurator(values, referrer) {
        var model = {
            end: function() {
                return referrer;
            }
        };

        configurable(model, values);

        return model;
    };
});
