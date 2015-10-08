import endpoint from './model/endpoint';
import fetchBackend from './http/fetch';
import http from './service/http';
import { member } from './model/decorator';
import requestBackend from './http/request';
import scope from './model/scope';

export default function(baseUrl, httpBackend) {
    const rootScope = scope();
    rootScope.assign('config', 'entityIdentifier', 'id');
    if (!baseUrl && typeof(window) !== undefined && window.location) {
        rootScope.set('url', `${window.location.protocol}//${window.location.host}`);
    } else {
        rootScope.set('url', baseUrl);
    }

    return member(endpoint(http(httpBackend))(rootScope));
}

export { fetchBackend, requestBackend };
