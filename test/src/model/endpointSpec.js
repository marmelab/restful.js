import { expect } from 'chai';
import endpointModel from '../../../src/model/endpoint';
import { Map } from 'immutable';
import scopeModel from '../../../src/model/scope';
import sinon from 'sinon';

/* eslint-disable new-cap */
describe('Endpoint model', () => {
    let endpoint;
    let request;
    let scope;

    beforeEach(() => {
        request = sinon.stub().returns(Promise.resolve(Map({
            data: { result: true },
        })));

        scope = scopeModel();
        scope.set('url', '/url');
        scope.assign('config', 'entityIdentifier', 'id');
        sinon.spy(scope, 'on');
        endpoint = endpointModel(request)(scope);
    });

    describe('get', () => {
        it('should call request with correct config when called with no argument', () => {
            endpoint.get();

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                errorInterceptors: [],
                headers: {},
                method: 'GET',
                params: null,
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });

        it('should call request with correct config when called with params and headers', () => {
            endpoint.get({ filter: 'asc' }, { Authorization: 'Token xxxx' });

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                errorInterceptors: [],
                headers: {
                    Authorization: 'Token xxxx',
                },
                method: 'GET',
                params: {
                    filter: 'asc',
                },
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });
    });

    describe('post', () => {
        it('should call request with correct config when called with only data', () => {
            endpoint.post([
                'request',
                'data',
            ]);

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                data: [
                    'request',
                    'data',
                ],
                errorInterceptors: [],
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                method: 'POST',
                params: null,
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });

        it('should call request with correct config when called with data and headers', () => {
            endpoint.post([
                'request',
                'data',
            ], {
                goodbye: 'planet',
            }, {
                hello: 'world',
            });

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                data: [
                    'request',
                    'data',
                ],
                errorInterceptors: [],
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    hello: 'world',
                },
                method: 'POST',
                params: {
                    goodbye: 'planet',
                },
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });
    });

    describe('put', () => {
        it('should call request with correct config when called with only data', () => {
            endpoint.put([
                'request',
                'data',
            ]);

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                data: [
                    'request',
                    'data',
                ],
                errorInterceptors: [],
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                method: 'PUT',
                params: null,
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });

        it('should call request with correct config when called with data and headers', () => {
            endpoint.put([
                'request',
                'data',
            ], {
                goodbye: 'planet',
            }, {
                hello: 'world',
            });

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                data: [
                    'request',
                    'data',
                ],
                errorInterceptors: [],
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    hello: 'world',
                },
                method: 'PUT',
                params: {
                    goodbye: 'planet',
                },
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });
    });

    describe('patch', () => {
        it('should call request with correct config when called with only data', () => {
            endpoint.patch([
                'request',
                'data',
            ]);

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                data: [
                    'request',
                    'data',
                ],
                errorInterceptors: [],
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                method: 'PATCH',
                params: null,
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });

        it('should call request with correct config when called with data and headers', () => {
            endpoint.patch([
                'request',
                'data',
            ], {
                goodbye: 'planet',
            }, {
                hello: 'world',
            });

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                data: [
                    'request',
                    'data',
                ],
                errorInterceptors: [],
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    hello: 'world',
                },
                method: 'PATCH',
                params: {
                    goodbye: 'planet',
                },
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });
    });

    describe('delete', () => {
        it('should call request with correct config when called with only data', () => {
            endpoint.delete([
                'request',
                'data',
            ]);

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                data: [
                    'request',
                    'data',
                ],
                errorInterceptors: [],
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                method: 'DELETE',
                params: null,
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });

        it('should call request with correct config when called with data and headers', () => {
            endpoint.delete([
                'request',
                'data',
            ], {
                goodbye: 'planet',
            }, {
                hello: 'world',
            });

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                data: [
                    'request',
                    'data',
                ],
                errorInterceptors: [],
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    hello: 'world',
                },
                method: 'DELETE',
                params: {
                    goodbye: 'planet',
                },
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });
    });

    describe('head', () => {
        it('should call request with correct config when called with no argument', () => {
            endpoint.head();

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                errorInterceptors: [],
                headers: {},
                method: 'HEAD',
                params: null,
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });

        it('should call request with correct config when called with params and headers', () => {
            endpoint.head({ filter: 'asc' }, { Authorization: 'Token xxxx' });

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                errorInterceptors: [],
                headers: {
                    Authorization: 'Token xxxx',
                },
                method: 'HEAD',
                params: {
                    filter: 'asc',
                },
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });
    });

    describe('interceptors', () => {
        it('should add a request interceptor and pass it to the request callback when one request is performed', () => {
            endpoint.addRequestInterceptor({ hello: 'world' });

            endpoint.get();

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                errorInterceptors: [],
                headers: {},
                method: 'GET',
                params: null,
                requestInterceptors: [{ hello: 'world' }],
                responseInterceptors: [],
                url: '/url',
            });
        });

        it('should add a response interceptor and pass it to the request callback when one request is performed', () => {
            endpoint.addResponseInterceptor({ hello2: 'world2' });

            endpoint.get();

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                errorInterceptors: [],
                headers: {},
                method: 'GET',
                params: null,
                requestInterceptors: [],
                responseInterceptors: [{ hello2: 'world2' }],
                url: '/url',
            });
        });

        it('should add a error interceptor and pass it to the request callback when one request is performed', () => {
            endpoint.addErrorInterceptor({ hello3: 'world3' });

            endpoint.get();

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                errorInterceptors: [{ hello3: 'world3' }],
                headers: {},
                method: 'GET',
                params: null,
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });
    });

    describe('headers', () => {
        it('should add an header to all request done by the endpoint when header is called', () => {
            endpoint.header('Authorization', 'xxxx');
            endpoint.get(null, { hello: 'world' });

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                errorInterceptors: [],
                headers: {
                    Authorization: 'xxxx',
                    hello: 'world',
                },
                method: 'GET',
                params: null,
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });

        it('should override existing headers when performing a request with the same header name', () => {
            endpoint.header('Authorization', 'xxxx');
            endpoint.get(null, { Authorization: 'yyyy' });

            expect(request.getCall(0).args[0].toJS()).to.deep.equal({
                errorInterceptors: [],
                headers: {
                    Authorization: 'yyyy',
                },
                method: 'GET',
                params: null,
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
        });
    });

    it('should return the endpoint url when url is called', () => {
        expect(endpoint.url()).to.equal('/url');
    });

    it('should create a child endpoint when new is called with a child scope', () => {
        const childEndpoint = endpoint.new('/url2');

        expect(childEndpoint.url()).to.equal('/url2');

        endpoint.header('Authorization', 'xxxx');
        endpoint.header('hello', 'world');
        endpoint.addRequestInterceptor({ alpha: 'beta' });

        childEndpoint.header('hello', 'planet');
        childEndpoint.addResponseInterceptor({ omega: 'gamma' });

        childEndpoint.post({ content: 'test' });

        expect(request.getCall(0).args[0].toJS()).to.deep.equal({
            data: { content: 'test' },
            errorInterceptors: [],
            headers: {
                Authorization: 'xxxx',
                'Content-Type': 'application/json;charset=UTF-8',
                hello: 'planet',
            },
            method: 'POST',
            params: null,
            requestInterceptors: [
                { alpha: 'beta' },
            ],
            responseInterceptors: [
                { omega: 'gamma' },
            ],
            url: '/url2',
        });
    });

    it('should emit a response event when a response is received', (done) => {
        const listener = sinon.spy();
        endpoint.on('response', listener);

        endpoint.get().then((response) => {
            expect(listener.getCall(0).args[0].body(false)).to.deep.equal({
                result: true,
            });
            expect(listener.getCall(0).args[1]).to.deep.equal({
                errorInterceptors: [],
                headers: {},
                method: 'GET',
                params: null,
                requestInterceptors: [],
                responseInterceptors: [],
                url: '/url',
            });
            expect(response.body(false)).to.deep.equal({
                result: true,
            });

            done();
        }).catch(done);
    });

    it('should emit a error event when an error response is received', (done) => {
        const listener = sinon.spy();
        endpoint.on('error', listener);
        request.returns(Promise.reject(new Error('Oops')));

        endpoint.get().then(done.bind(done, ['It should throw an error']), (error) => {
            expect(listener.getCall(0).args).to.deep.equal([
                new Error('Oops'),
                {
                    errorInterceptors: [],
                    headers: {},
                    method: 'GET',
                    params: null,
                    requestInterceptors: [],
                    responseInterceptors: [],
                    url: '/url',
                },
            ]);
            expect(error.message).to.equal('Oops');
            done();
        }).catch(done);
    });

    it('should emit event across parent endpoints', (done) => {
        const listener = sinon.spy();
        const childEndpoint = endpoint.new('/child');
        endpoint.on('error', listener);

        request.returns(Promise.reject(new Error('Oops')));

        childEndpoint.get().then(done.bind(done, ['It should throw an error']), (error) => {
            expect(listener.getCall(0).args).to.deep.equal([
                new Error('Oops'),
                {
                    errorInterceptors: [],
                    headers: {},
                    method: 'GET',
                    params: null,
                    requestInterceptors: [],
                    responseInterceptors: [],
                    url: '/child',
                },
            ]);
            expect(error.message).to.equal('Oops');
            done();
        }).catch(done);
    });

    it('should register a default error listener', () => {
        expect(scope.on.getCall(0).args[0]).to.equal('error');
    });
});
