'use strict';

function inherit(source, dest) {
    return dest
        .config()
        ._parent(source)
        ._httpBackend(source.config()._httpBackend())
        .responseInterceptors(source.config().responseInterceptors())
        .requestInterceptors(source.config().responseInterceptors())
        .end();
}

module.exports = inherit;
