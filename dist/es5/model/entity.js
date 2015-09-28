"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function (_data, endpoint) {
    return {
        all: endpoint.all,
        custom: endpoint.custom,
        data: function data() {
            return _data;
        },
        "delete": endpoint["delete"],
        id: function id() {
            return _data[endpoint.identifier()];
        },
        one: endpoint.one,
        save: function save() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return endpoint.put.apply(endpoint, [_data].concat(args));
        },
        url: endpoint.url
    };
};

module.exports = exports["default"];