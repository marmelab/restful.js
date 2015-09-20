import endpoint from './model/endpoint';
import http from './service/http';
import { member } from './model/decorator';
import scope from './model/scope';

export default function(baseUrl, httpBackend) {
    const rootScope = scope();
    rootScope.assign('config', 'entityIdentifier', 'id');
    rootScope.set('debug', false);
    rootScope.set('url', baseUrl || `${window.location.protocol}//${window.location.host}`);

    const rootEndpoint = member(endpoint(http(httpBackend))(rootScope));

    if (process.env.NODE_ENV !== 'production') {
        const debug = require('./service/debug');
        rootEndpoint.on('error', (error, config) => rootScope.get('debug') && debug('error', error, config));
        rootEndpoint.on('request', config => rootScope.get('debug') && debug('request', null, config));
        rootEndpoint.on('response', (response, config) => rootScope.get('debug') && debug('response', response.body(false), config));

        rootEndpoint.debug = enabled => rootScope.set('debug', enabled);
    }

    return rootEndpoint;
}
