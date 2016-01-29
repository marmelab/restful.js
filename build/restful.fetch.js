import restful from '../src';
import fetchBackend from '../src/http/fetch';
import 'whatwg-fetch';

export default function (baseUrl, httpBackend = fetchBackend(fetch)) {
    return restful(baseUrl, httpBackend);
}
