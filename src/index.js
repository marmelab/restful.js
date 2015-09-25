import debug from './service/debug';
import endpoint from './model/endpoint';
import http from './service/http';
import { member } from './model/decorator';
import scope from './model/scope';

export default function(baseUrl, httpBackend) {
    const rootScope = scope();
    rootScope.assign('config', 'entityIdentifier', 'id');
    rootScope.set('debug', false);
    if (!baseUrl && typeof(window) !== undefined && window.location) {
        rootScope.set('url', `${window.location.protocol}//${window.location.host}`);
    } else {
        rootScope.set('url', baseUrl);
    }

    const rootEndpoint = member(endpoint(http(httpBackend))(rootScope));

    if (process.env.NODE_ENV !== 'production') {
        // We make the root endpoint retrievable from any debug tool
        debug(rootEndpoint);
    }

    return rootEndpoint;
}
