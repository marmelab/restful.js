'use strict';

function inherit(source, dest) {
    var sourceConfig = source.config();

    return dest
        .config()
        ._parent(source)
        ._httpBackend(sourceConfig._httpBackend())
        .headers(sourceConfig.headers())
        .responseInterceptors(sourceConfig.responseInterceptors())
        .requestInterceptors(sourceConfig.responseInterceptors())
        .end();
}

module.exports = inherit;
