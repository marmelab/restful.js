'use strict';

var configurable = require('../util/configurable');

function configurator(values, referrer) {
    var model = {
        end: function() {
            return referrer;
        }
    };

    configurable(model, values);

    return model;
};

module.exports = configurator;
