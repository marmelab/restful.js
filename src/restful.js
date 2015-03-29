import assign from 'object-assign';
import configurable from 'util/configurable';
import collection from 'model/collection';
import member from 'model/member';
import resource from 'model/resource';
import axios from 'axios';
import http from 'service/http';

export default function restful(baseUrl, port) {
    var config = {
        baseUrl: baseUrl,
        port: port || 80,
        prefixUrl: '',
        protocol: 'http',
    };

    var fakeEndpoint = (function() {
        var _config = {
            _http: http(axios),
            headers: {},
            requestInterceptors: [],
            responseInterceptors: [],
        };

        var model = {
            url() {
                var url = config.protocol + '://' + config.baseUrl;

                if (config.port !== 80) {
                    url += ':' + config.port;
                }

                if (config.prefixUrl !== '') {
                    url += '/' + config.prefixUrl;
                }

                return url;
            }
        };

        configurable(model, _config);

        return assign(function() {
            return _config._http;
        }, model);
    }());

    var model = {
        url() {
            return fakeEndpoint.url();
        },

        one(name, id) {
            return member(name, id, model);
        },

        all(name) {
            return collection(name, model);
        }
    };

    // We override model because one and all need it as a closure
    model = assign(resource(fakeEndpoint), model);

    configurable(model, config);

    return model;
};
