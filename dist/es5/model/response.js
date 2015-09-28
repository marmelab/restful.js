'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _entity = require('./entity');

var _entity2 = _interopRequireDefault(_entity);

var _immutable = require('immutable');

var _utilSerialize = require('../util/serialize');

var _utilSerialize2 = _interopRequireDefault(_utilSerialize);

/* eslint-disable new-cap */

exports['default'] = function (response, decoratedEndpoint) {
    var identifier = decoratedEndpoint.identifier();

    return {
        statusCode: function statusCode() {
            return (0, _utilSerialize2['default'])(response.get('statusCode'));
        },
        body: function body() {
            var hydrate = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

            var data = response.get('data');

            if (!hydrate) {
                return (0, _utilSerialize2['default'])(data);
            }

            if (_immutable.List.isList(data)) {
                if (decoratedEndpoint.all) {
                    throw new Error('Unexpected array as response, you should use all method for that');
                }

                return (0, _utilSerialize2['default'])(data.map(function (datum) {
                    var id = datum.get(identifier);
                    return (0, _entity2['default'])((0, _utilSerialize2['default'])(datum), decoratedEndpoint.custom('' + id));
                }));
            }

            if (!decoratedEndpoint.all) {
                throw new Error('Expected array as response, you should use one method for that');
            }

            return (0, _entity2['default'])((0, _utilSerialize2['default'])(data), decoratedEndpoint);
        },
        headers: function headers() {
            return (0, _utilSerialize2['default'])(response.get('headers'));
        }
    };
};

module.exports = exports['default'];