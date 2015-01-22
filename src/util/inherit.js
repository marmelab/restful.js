'use strict';

function inherit(source, dest) {
    var sourceConfig = source.config(),
        headers;

    try {
        headers = JSON.parse(JSON.stringify(sourceConfig.headers()));
    } catch (e) {
        headers = {};
    }

    return dest
        .config()
        ._parent(source)
        ._httpBackend(sourceConfig._httpBackend())
        .headers(headers)
        .responseInterceptors([].slice.apply(sourceConfig.responseInterceptors()))
        .requestInterceptors([].slice.apply(sourceConfig.responseInterceptors()))
        .end();
}

module.exports = inherit;
