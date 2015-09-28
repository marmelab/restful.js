'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelEndpoint = require('./model/endpoint');

var _modelEndpoint2 = _interopRequireDefault(_modelEndpoint);

var _httpFetch = require('./http/fetch');

var _httpFetch2 = _interopRequireDefault(_httpFetch);

var _serviceHttp = require('./service/http');

var _serviceHttp2 = _interopRequireDefault(_serviceHttp);

var _modelDecorator = require('./model/decorator');

var _httpRequest = require('./http/request');

var _httpRequest2 = _interopRequireDefault(_httpRequest);

var _modelScope = require('./model/scope');

var _modelScope2 = _interopRequireDefault(_modelScope);

exports['default'] = function (baseUrl, httpBackend) {
    var rootScope = (0, _modelScope2['default'])();
    rootScope.assign('config', 'entityIdentifier', 'id');
    rootScope.set('debug', false);
    if (!baseUrl && typeof window !== undefined && window.location) {
        rootScope.set('url', window.location.protocol + '//' + window.location.host);
    } else {
        rootScope.set('url', baseUrl);
    }

    return (0, _modelDecorator.member)((0, _modelEndpoint2['default'])((0, _serviceHttp2['default'])(httpBackend))(rootScope));
};

exports.fetchBackend = _httpFetch2['default'];
exports.requestBackend = _httpRequest2['default'];