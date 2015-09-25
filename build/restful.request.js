import request from 'request';
import requestBackend from '../src/http/request';
import restful from '../src';

export default function(baseUrl, httpBackend = requestBackend(request)) {
    return restful(baseUrl, httpBackend);
}
