import { expect } from 'chai';
import httpService from '../../../src/service/http';
import { Map } from 'immutable';
import sinon from 'sinon';

/* eslint-disable new-cap */
describe('HTTP Service', () => {
    let emitter;
    let http;
    let httpBackend;

    beforeEach(() => {
        emitter = sinon.spy();
        httpBackend = sinon.stub().returns(Promise.resolve({ output: 1 }));
        http = httpService(httpBackend);
    });

    it('should execute request interceptors, then call the http backend and execute response interceptors before returning result', (done) => {
        const requestInterceptor1 = sinon.stub().returns({ method: 'PUT' });
        const requestInterceptor2 = sinon.stub().returns({ params: { asc: 1 } });
        const requestInterceptor3 = sinon.stub().returns(new Promise((resolve) => {
            setTimeout(() => {
                resolve({ url: '/updated' });
            }, 100);
        }));
        const responseInterceptor1 = sinon.stub().returns({ status: 'yes' });

        http(Map({
            method: 'GET',
            form: {
                test: 'test',
            },
            requestInterceptors: [requestInterceptor1, requestInterceptor2, requestInterceptor3],
            responseInterceptors: [responseInterceptor1],
            url: '/url',
        }), emitter).then((response) => {
            expect(emitter.getCall(0).args).to.deep.equal([
                'request:interceptor:pre',
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(1).args).to.deep.equal([
                'request:interceptor:post',
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(2).args).to.deep.equal([
                'request:interceptor:pre',
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(3).args).to.deep.equal([
                'request:interceptor:post',
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    params: {
                        asc: 1,
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(4).args).to.deep.equal([
                'request:interceptor:pre',
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    params: {
                        asc: 1,
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(5).args).to.deep.equal([
                'request:interceptor:post',
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    params: {
                        asc: 1,
                    },
                    url: '/updated',
                },
                'proxy',
            ]);
            expect(emitter.getCall(6).args).to.deep.equal([
                'request',
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    params: {
                        asc: 1,
                    },
                    url: '/updated',
                },
            ]);
            expect(emitter.getCall(7).args).to.deep.equal([
                'response:interceptor:pre',
                {
                    output: 1,
                },
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    params: {
                        asc: 1,
                    },
                    url: '/updated',
                },
                'proxy',
            ]);
            expect(emitter.getCall(8).args).to.deep.equal([
                'response:interceptor:post',
                {
                    output: 1,
                    status: 'yes',
                },
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    params: {
                        asc: 1,
                    },
                    url: '/updated',
                },
                'proxy',
            ]);
            expect(requestInterceptor1.getCall(0).args).to.deep.equal([
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(requestInterceptor2.getCall(0).args).to.deep.equal([
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(requestInterceptor3.getCall(0).args).to.deep.equal([
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    params: {
                        asc: 1,
                    },
                    url: '/url',
                },
            ]);
            expect(httpBackend.getCall(0).args).to.deep.equal([
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    params: {
                        asc: 1,
                    },
                    url: '/updated',
                },
            ]);
            expect(responseInterceptor1.getCall(0).args).to.deep.equal([
                {
                    output: 1,
                },
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    params: {
                        asc: 1,
                    },
                    url: '/updated',
                },
            ]);
            expect(response.toJS()).to.deep.equal({
                output: 1,
                status: 'yes',
            });
            done();
        }).catch(done);
    });

    it('should execute error interceptors when an error occured in a request interceptor', (done) => {
        const requestInterceptor1 = sinon.stub().returns({ method: 'PUT' });
        const requestInterceptor2 = sinon.stub().returns(new Promise(() => {
            throw new Error('Oops');
        }));
        const errorInterceptor1 = sinon.stub().returns({ status: 'yes' });

        http(Map({
            errorInterceptors: [errorInterceptor1],
            method: 'GET',
            form: {
                test: 'test',
            },
            requestInterceptors: [requestInterceptor1, requestInterceptor2],
            responseInterceptors: [],
            url: '/url',
        }), emitter).then(done.bind(done, 'It should throw an error'), (error) => {
            expect(emitter.getCall(0).args).to.deep.equal([
                'request:interceptor:pre',
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(1).args).to.deep.equal([
                'request:interceptor:post',
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(2).args).to.deep.equal([
                'request:interceptor:pre',
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(3).args).to.deep.equal([
                'error:interceptor:pre',
                new Error('Oops'),
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(4).args).to.deep.equal([
                'error:interceptor:post',
                {
                    status: 'yes',
                },
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(requestInterceptor1.getCall(0).args).to.deep.equal([
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(requestInterceptor2.getCall(0).args).to.deep.equal([
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(httpBackend.callCount).to.equal(0);
            expect(errorInterceptor1.getCall(0).args).to.deep.equal([
                new Error('Oops'),
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(error).to.deep.equal({ status: 'yes' });
            done();
        }).catch(done);
    });

    it('should execute error interceptors when an error occured in a response interceptor', (done) => {
        const responseInterceptor1 = sinon.stub().returns(new Promise(() => {
            throw new Error('Oops');
        }));
        const errorInterceptor1 = sinon.stub().returns({ status: 'yes' });

        http(Map({
            errorInterceptors: [errorInterceptor1],
            method: 'GET',
            form: {
                test: 'test',
            },
            requestInterceptors: [],
            responseInterceptors: [responseInterceptor1],
            url: '/url',
        }), emitter).then(done.bind(done, 'It should throw an error'), (error) => {
            expect(emitter.getCall(0).args).to.deep.equal([
                'request',
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(emitter.getCall(1).args).to.deep.equal([
                'response:interceptor:pre',
                {
                    output: 1,
                },
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(2).args).to.deep.equal([
                'error:interceptor:pre',
                new Error('Oops'),
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(3).args).to.deep.equal([
                'error:interceptor:post',
                {
                    status: 'yes',
                },
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(responseInterceptor1.getCall(0).args).to.deep.equal([
                {
                    output: 1,
                },
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(httpBackend.getCall(0).args).to.deep.equal([
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(errorInterceptor1.getCall(0).args).to.deep.equal([
                new Error('Oops'),
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(error).to.deep.equal({ status: 'yes' });
            done();
        }).catch(done);
    });


    it('should execute error interceptors when an error occured in httpBackend', (done) => {
        const requestInterceptor1 = sinon.stub().returns({ method: 'PUT' });
        const errorInterceptor1 = sinon.stub().returns({ status: 'yes' });
        httpBackend.returns(Promise.reject(new Error('Oops')));

        http(Map({
            errorInterceptors: [errorInterceptor1],
            method: 'GET',
            form: {
                test: 'test',
            },
            requestInterceptors: [requestInterceptor1],
            responseInterceptors: [],
            url: '/url',
        }), emitter).then(done.bind(done, 'It should throw an error'), (error) => {
            expect(emitter.getCall(0).args).to.deep.equal([
                'request:interceptor:pre',
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(1).args).to.deep.equal([
                'request:interceptor:post',
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(2).args).to.deep.equal([
                'request',
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(emitter.getCall(3).args).to.deep.equal([
                'error:interceptor:pre',
                new Error('Oops'),
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(emitter.getCall(4).args).to.deep.equal([
                'error:interceptor:post',
                {
                    status: 'yes',
                },
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
                'proxy',
            ]);
            expect(requestInterceptor1.getCall(0).args).to.deep.equal([
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(httpBackend.getCall(0).args).to.deep.equal([
                {
                    method: 'PUT',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(errorInterceptor1.getCall(0).args).to.deep.equal([
                new Error('Oops'),
                {
                    method: 'GET',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(error).to.deep.equal({ status: 'yes' });
            done();
        }).catch(done);
    });
});
