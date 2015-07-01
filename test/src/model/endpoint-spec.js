import assign from 'object-assign';
import endpoint from 'model/endpoint';

describe('endpoint', () => {
    let testEndpoint;
    let parent;
    let httpBackend;
    let requestInterceptor;
    let responseInterceptor;
    let fullResponseInterceptor;

    beforeEach(() => {
        httpBackend = {
            request: jasmine.createSpy('request'),
        };

        requestInterceptor = jasmine.createSpy('requestInterceptor');
        responseInterceptor = jasmine.createSpy('responseInterceptor');
        fullResponseInterceptor = jasmine.createSpy('fullResponseInterceptor');

        parent = assign(() => httpBackend, {
            headers: jasmine.createSpy('headers').and.returnValue({
                Authorization: 'Token yyyy',
                'Content-Type': 'text/plain',
            }),
            fullRequestInterceptors: jasmine.createSpy('headers').and.returnValue([]),
            fullResponseInterceptors: jasmine.createSpy('headers').and.returnValue([fullResponseInterceptor]),
            requestInterceptors: jasmine.createSpy('headers').and.returnValue([requestInterceptor]),
            responseInterceptors:jasmine.createSpy('headers').and.returnValue([responseInterceptor]),
        });

        testEndpoint = endpoint('/url', parent);
    });

    describe('get', () => {
        beforeEach(() => {
            httpBackend.request.calls.reset();

            testEndpoint.responseInterceptors([]);
            testEndpoint.fullResponseInterceptors([]);
            testEndpoint.requestInterceptors([]);
            testEndpoint.fullRequestInterceptors([]);
        });

        it('should call httpBackend with correct config when called with no argument', () => {
            testEndpoint.get();

            expect(httpBackend.request).toHaveBeenCalledWith('get', {
                method: 'get',
                url: '/url',
                params: {},
                headers: {
                    Authorization: 'Token yyyy',
                    'Content-Type': 'text/plain',
                },
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called with params and headers', () => {
            let params = { filter: 'asc' };
            let headers = { Authorization: 'Token xxxx' };

            testEndpoint.get(params, headers);

            expect(httpBackend.request).toHaveBeenCalledWith('get', {
                method: 'get',
                url: '/url',
                params: params,
                headers: {
                    Authorization: 'Token xxxx',
                    'Content-Type': 'text/plain',
                },
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called and endpoint has full request interceptors', () => {
            let params = { filter: 'asc' };
            let headers = { Authorization: 'Token xxxx' };

            let fullRequestInterceptor = jasmine.createSpy('fullRequestInterceptor').and.callFake(() => {
                return {
                    method: 'post',
                    url: '/intercepted',
                };
            });

            testEndpoint.fullRequestInterceptors().push(fullRequestInterceptor)
            testEndpoint.get(params, headers);

            expect(fullRequestInterceptor).toHaveBeenCalledWith(params, headers, null, 'get', '/url');
            expect(httpBackend.request).toHaveBeenCalledWith('post', {
                method: 'post',
                url: '/intercepted',
                params: params,
                headers: {
                    Authorization: 'Token xxxx',
                    'Content-Type': 'text/plain',
                },
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            httpBackend.request.calls.reset();

            testEndpoint.responseInterceptors([]);
            testEndpoint.fullResponseInterceptors([]);
            testEndpoint.requestInterceptors([]);
            testEndpoint.fullRequestInterceptors([]);
        });

        it('should call httpBackend with correct config when called with no argument', () => {
            testEndpoint.getAll();

            expect(httpBackend.request).toHaveBeenCalledWith('get', {
                method: 'get',
                url: '/url',
                params: {},
                headers: {
                    Authorization: 'Token yyyy',
                    'Content-Type': 'text/plain',
                },
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called with params and headers', () => {
            let params = { filter: 'asc' };
            let headers = { Authorization: 'Token xxxx' };

            testEndpoint.getAll(params, headers);

            expect(httpBackend.request).toHaveBeenCalledWith('get', {
                method: 'get',
                url: '/url',
                params: params,
                headers: {
                    Authorization: 'Token xxxx',
                    'Content-Type': 'text/plain',
                },
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called and endpoint has full request interceptors', () => {
            let params = { filter: 'asc' };
            let headers = { Authorization: 'Token xxxx' };

            let fullRequestInterceptor = jasmine.createSpy('fullRequestInterceptor').and.callFake(() => {
                return {
                    method: 'post',
                    url: '/intercepted',
                };
            });

            testEndpoint.fullRequestInterceptors().push(fullRequestInterceptor)
            testEndpoint.getAll(params, headers);

            expect(fullRequestInterceptor).toHaveBeenCalledWith(params, headers, null, 'get', '/url');
            expect(httpBackend.request).toHaveBeenCalledWith('post', {
                method: 'post',
                url: '/intercepted',
                params: params,
                headers: {
                    Authorization: 'Token xxxx',
                    'Content-Type': 'text/plain',
                },
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });
    });

    describe('post', () => {
        beforeEach(() => {
            httpBackend.request.calls.reset();

            testEndpoint.responseInterceptors([]);
            testEndpoint.fullResponseInterceptors([]);
            testEndpoint.requestInterceptors([]);
            testEndpoint.fullRequestInterceptors([]);
        });

        it('should call httpBackend with correct config when called with only data', () => {
            let data = [ 'request', 'data' ];

            testEndpoint.post(data);

            expect(httpBackend.request).toHaveBeenCalledWith('post', {
                method: 'post',
                url: '/url',
                data: data,
                params: {},
                headers: {
                    Authorization: 'Token yyyy',
                    'Content-Type': 'text/plain',
                },
                requestInterceptors: [requestInterceptor],
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called with data and headers', () => {
            let data = [ 'request', 'data' ];
            let headers = { Authorization: 'Token xxxx' };

            testEndpoint.post(data, headers);

            expect(httpBackend.request).toHaveBeenCalledWith('post', {
                method: 'post',
                url: '/url',
                data: data,
                params: {},
                headers: {
                    Authorization: 'Token xxxx',
                    'Content-Type': 'text/plain',
                },
                requestInterceptors: [requestInterceptor],
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called and endpoint has full request interceptors', () => {
            let data = [ 'request', 'data' ];
            let headers = { Authorization: 'Token xxxx' };

            let fullRequestInterceptor = jasmine.createSpy('fullRequestInterceptor').and.callFake(() => {
                return {
                    method: 'put',
                    url: '/intercepted',
                };
            });

            testEndpoint.fullRequestInterceptors().push(fullRequestInterceptor)
            testEndpoint.post(data, headers);

            expect(fullRequestInterceptor).toHaveBeenCalledWith({}, headers, data, 'post', '/url');
            expect(httpBackend.request).toHaveBeenCalledWith('put', {
                method: 'put',
                url: '/intercepted',
                data: data,
                params: {},
                headers: {
                    Authorization: 'Token xxxx',
                    'Content-Type': 'text/plain',
                },
                requestInterceptors: [requestInterceptor],
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });
    });

    describe('put', () => {
        beforeEach(() => {
            httpBackend.request.calls.reset();

            testEndpoint.responseInterceptors([]);
            testEndpoint.fullResponseInterceptors([]);
            testEndpoint.requestInterceptors([]);
            testEndpoint.fullRequestInterceptors([]);
        });

        it('should call httpBackend with correct config when called with only data', () => {
            let data = [ 'request', 'data' ];

            testEndpoint.put(data);

            expect(httpBackend.request).toHaveBeenCalledWith('put', {
                method: 'put',
                url: '/url',
                data: data,
                params: {},
                headers: {
                    Authorization: 'Token yyyy',
                    'Content-Type': 'text/plain',
                },
                requestInterceptors: [requestInterceptor],
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called with data and headers', () => {
            let data = [ 'request', 'data' ];
            let headers = { Authorization: 'Token xxxx' };

            testEndpoint.put(data, headers);

            expect(httpBackend.request).toHaveBeenCalledWith('put', {
                method: 'put',
                url: '/url',
                data: data,
                params: {},
                headers: {
                    Authorization: 'Token xxxx',
                    'Content-Type': 'text/plain',
                },
                requestInterceptors: [requestInterceptor],
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called and endpoint has full request interceptors', () => {
            let data = [ 'request', 'data' ];
            let headers = { Authorization: 'Token xxxx' };

            let fullRequestInterceptor = jasmine.createSpy('fullRequestInterceptor').and.callFake(() => {
                return {
                    method: 'patch',
                    url: '/intercepted',
                };
            });

            testEndpoint.fullRequestInterceptors().push(fullRequestInterceptor)
            testEndpoint.put(data, headers);

            expect(fullRequestInterceptor).toHaveBeenCalledWith({}, headers, data, 'put', '/url');
            expect(httpBackend.request).toHaveBeenCalledWith('patch', {
                method: 'patch',
                url: '/intercepted',
                data: data,
                params: {},
                headers: {
                    Authorization: 'Token xxxx',
                    'Content-Type': 'text/plain',
                },
                requestInterceptors: [requestInterceptor],
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });
    });

    describe('patch', () => {
        beforeEach(() => {
            httpBackend.request.calls.reset();

            testEndpoint.responseInterceptors([]);
            testEndpoint.fullResponseInterceptors([]);
            testEndpoint.requestInterceptors([]);
            testEndpoint.fullRequestInterceptors([]);
        });

        it('should call httpBackend with correct config when called with only data', () => {
            let data = [ 'request', 'data' ];

            testEndpoint.patch(data);

            expect(httpBackend.request).toHaveBeenCalledWith('patch', {
                method: 'patch',
                url: '/url',
                data: data,
                params: {},
                headers: {
                    Authorization: 'Token yyyy',
                    'Content-Type': 'text/plain',
                },
                requestInterceptors: [requestInterceptor],
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called with data and headers', () => {
            let data = [ 'request', 'data' ];
            let headers = { Authorization: 'Token xxxx' };

            testEndpoint.patch(data, headers);

            expect(httpBackend.request).toHaveBeenCalledWith('patch', {
                method: 'patch',
                url: '/url',
                data: data,
                params: {},
                headers: {
                    Authorization: 'Token xxxx',
                    'Content-Type': 'text/plain',
                },
                requestInterceptors: [requestInterceptor],
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called and endpoint has full request interceptors', () => {
            let data = [ 'request', 'data' ];
            let headers = { Authorization: 'Token xxxx' };

            let fullRequestInterceptor = jasmine.createSpy('fullRequestInterceptor').and.callFake(() => {
                return {
                    method: 'delete',
                    url: '/intercepted',
                    headers: {
                        'Content-Type': 'xml',
                    },
                };
            });

            testEndpoint.fullRequestInterceptors().push(fullRequestInterceptor)
            testEndpoint.patch(data, headers);

            expect(fullRequestInterceptor).toHaveBeenCalledWith({}, headers, data, 'patch', '/url');
            expect(httpBackend.request).toHaveBeenCalledWith('delete', {
                method: 'delete',
                url: '/intercepted',
                data: data,
                params: {},
                headers: {
                    'Content-Type': 'xml',
                },
                requestInterceptors: [requestInterceptor],
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            httpBackend.request.calls.reset();

            testEndpoint.responseInterceptors([]);
            testEndpoint.fullResponseInterceptors([]);
            testEndpoint.requestInterceptors([]);
            testEndpoint.fullRequestInterceptors([]);
        });

        it('should call httpBackend with correct config when called with no argument', () => {
            testEndpoint.delete();

            expect(httpBackend.request).toHaveBeenCalledWith('delete', {
                method: 'delete',
                url: '/url',
                params: {},
                headers: {
                    Authorization: 'Token yyyy',
                    'Content-Type': 'text/plain',
                },
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called with headers', () => {
            let headers = { Authorization: 'Token xxxx' };

            testEndpoint.delete(headers);

            expect(httpBackend.request).toHaveBeenCalledWith('delete', {
                method: 'delete',
                url: '/url',
                params: {},
                headers: {
                    Authorization: 'Token xxxx',
                    'Content-Type': 'text/plain',
                },
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called and endpoint has full request interceptors', () => {
            let headers = { Authorization: 'Token xxxx' };

            let fullRequestInterceptor = jasmine.createSpy('fullRequestInterceptor').and.callFake(() => {
                return {
                    method: 'head',
                    url: '/intercepted',
                    headers: {
                        'Content-Type': 'xml',
                    },
                };
            });

            testEndpoint.fullRequestInterceptors().push(fullRequestInterceptor)
            testEndpoint.delete(headers);

            expect(fullRequestInterceptor).toHaveBeenCalledWith({}, headers, null, 'delete', '/url');
            expect(httpBackend.request).toHaveBeenCalledWith('head', {
                method: 'head',
                url: '/intercepted',
                params: {},
                headers: {
                    'Content-Type': 'xml',
                },
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });
    });

    describe('head', () => {
        beforeEach(() => {
            httpBackend.request.calls.reset();

            testEndpoint.responseInterceptors([]);
            testEndpoint.fullResponseInterceptors([]);
            testEndpoint.requestInterceptors([]);
            testEndpoint.fullRequestInterceptors([]);
        });

        it('should call httpBackend with correct config when called with no argument', () => {
            testEndpoint.head();

            expect(httpBackend.request).toHaveBeenCalledWith('head', {
                method: 'head',
                url: '/url',
                params: {},
                headers: {
                    Authorization: 'Token yyyy',
                    'Content-Type': 'text/plain',
                },
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called with headers', () => {
            let headers = { Authorization: 'Token xxxx' };

            testEndpoint.head(headers);

            expect(httpBackend.request).toHaveBeenCalledWith('head', {
                method: 'head',
                url: '/url',
                params: {},
                headers: {
                    Authorization: 'Token xxxx',
                    'Content-Type': 'text/plain',
                },
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });

        it('should call httpBackend with correct config when called and endpoint has full request interceptors', () => {
            let headers = { Authorization: 'Token xxxx' };

            let fullRequestInterceptor = jasmine.createSpy('fullRequestInterceptor').and.callFake(() => {
                return {
                    method: 'get',
                    url: '/intercepted',
                    headers: {
                        'Content-Type': 'xml',
                    },
                };
            });

            testEndpoint.fullRequestInterceptors().push(fullRequestInterceptor)
            testEndpoint.head(headers);

            expect(fullRequestInterceptor).toHaveBeenCalledWith({}, headers, null, 'head', '/url');
            expect(httpBackend.request).toHaveBeenCalledWith('get', {
                method: 'get',
                url: '/intercepted',
                params: {},
                headers: {
                    'Content-Type': 'xml',
                },
                responseInterceptors: [responseInterceptor],
                fullResponseInterceptors: [fullResponseInterceptor],
            });
        });
    });
});
