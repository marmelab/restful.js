import assign from 'object-assign';
import configurable from 'util/configurable';
import collection from 'model/collection';
import member from 'model/member';
import resource from 'model/resource';
import axios from 'axios';
import http from 'service/http';

export default function restful(baseUrl, port) {
    let config = {
        baseUrl: baseUrl,
        port: port || 80,
        prefixUrl: '',
        protocol: 'http',
    };

    let fakeEndpoint = (function() {
        let _config = {
            _http: http(axios),
            headers: {},
            fullRequestInterceptors: [],
            fullResponseInterceptors: [],
            requestInterceptors: [],
            responseInterceptors: [],
        };

        let model = {
            url() {
                let url = config.protocol + '://' + config.baseUrl;

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

    let model = {
        _url: null,

        customUrl(url) {
            if (typeof url === 'undefined') {
                return this._url;
            }

            this._url = url;

            return this;
        },

        url() {
            return fakeEndpoint.url();
        },

        one(name, id) {
            return member(name, id, model);
        },

        oneUrl(name, url) {
            this.customUrl(url);

            return this.one(name, null);
        },

        all(name) {
            return collection(name, model);
        },

        allUrl(name, url) {
            this.customUrl(url);

            return this.all(name);
        }
    };

    // We override model because one and all need it as a closure
    model = assign(resource(fakeEndpoint), model);

    configurable(model, config);

    return model;
}
