import assign from 'object-assign';
import restful from '../src';
import fetchBackend from '../src/http/fetch';
import 'whatwg-fetch';

export default assign((baseUrl, httpBackend = fetchBackend(fetch)) => {
    return restful(baseUrl, httpBackend);
}, {
    _flush: restful._flush,
    _instances: restful._instances,
});
