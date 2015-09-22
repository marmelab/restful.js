import { expect } from 'chai';
import httpService from '../../../src/service/http';
import sinon from 'sinon';

describe('HTTP Service', () => {
    let http;
    let httpBackend;

    beforeEach(() => {
        httpBackend = sinon.stub().returns(Promise.resolve({ output: 1 }));
        http = httpService(httpBackend);
    });

    it('should execute request interceptors, then call the http backend and execute response interceptors before returning result', (done) => {
        const requestInterceptor1 = sinon.stub().returns({ method: 'put' });
        const requestInterceptor2 = sinon.stub().returns({ params: { asc: 1 } });
        const requestInterceptor3 = sinon.stub().returns(new Promise((resolve) => {
            setTimeout(() => {
                resolve({ url: '/updated' });
            }, 100);
        }));
        const responseInterceptor1 = sinon.stub().returns({ status: 'yes' });

        http({
            method: 'get',
            form: {
                test: 'test',
            },
            requestInterceptors: [requestInterceptor1, requestInterceptor2, requestInterceptor3],
            responseInterceptors: [responseInterceptor1],
            url: '/url',
        }).then((response) => {
            expect(requestInterceptor1.getCall(0).args).to.deep.equal([
                {
                    method: 'get',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(requestInterceptor2.getCall(0).args).to.deep.equal([
                {
                    method: 'put',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(requestInterceptor3.getCall(0).args).to.deep.equal([
                {
                    method: 'put',
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
                    method: 'put',
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
                    method: 'put',
                    form: {
                        test: 'test',
                    },
                    params: {
                        asc: 1,
                    },
                    url: '/updated',
                },
            ]);
            expect(response).to.deep.equal({
                output: 1,
                status: 'yes',
            });
            done();
        }).catch(done);
    });

    it('should execute error interceptors when an error occured in a request interceptor', (done) => {
        const requestInterceptor1 = sinon.stub().returns({ method: 'put' });
        const requestInterceptor2 = sinon.stub().returns(new Promise(() => {
            throw new Error('Oops');
        }));
        const errorInterceptor1 = sinon.stub().returns({ status: 'yes' });

        http({
            errorInterceptors: [errorInterceptor1],
            method: 'get',
            form: {
                test: 'test',
            },
            requestInterceptors: [requestInterceptor1, requestInterceptor2],
            responseInterceptors: [],
            url: '/url',
        }).then(done.bind(done, 'It should throw an error'), (error) => {
            expect(requestInterceptor1.getCall(0).args).to.deep.equal([
                {
                    method: 'get',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(requestInterceptor2.getCall(0).args).to.deep.equal([
                {
                    method: 'put',
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
                    method: 'get',
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

        http({
            errorInterceptors: [errorInterceptor1],
            method: 'get',
            form: {
                test: 'test',
            },
            requestInterceptors: [],
            responseInterceptors: [responseInterceptor1],
            url: '/url',
        }).then(done.bind(done, 'It should throw an error'), (error) => {
            expect(responseInterceptor1.getCall(0).args).to.deep.equal([
                {
                    output: 1,
                },
                {
                    method: 'get',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(httpBackend.getCall(0).args).to.deep.equal([
                {
                    method: 'get',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(errorInterceptor1.getCall(0).args).to.deep.equal([
                new Error('Oops'),
                {
                    method: 'get',
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
        const requestInterceptor1 = sinon.stub().returns({ method: 'put' });
        const errorInterceptor1 = sinon.stub().returns({ status: 'yes' });
        httpBackend.returns(Promise.reject(new Error('Oops')));

        http({
            errorInterceptors: [errorInterceptor1],
            method: 'get',
            form: {
                test: 'test',
            },
            requestInterceptors: [requestInterceptor1],
            responseInterceptors: [],
            url: '/url',
        }).then(done.bind(done, 'It should throw an error'), (error) => {
            expect(requestInterceptor1.getCall(0).args).to.deep.equal([
                {
                    method: 'get',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(httpBackend.getCall(0).args).to.deep.equal([
                {
                    method: 'put',
                    form: {
                        test: 'test',
                    },
                    url: '/url',
                },
            ]);
            expect(errorInterceptor1.getCall(0).args).to.deep.equal([
                new Error('Oops'),
                {
                    method: 'get',
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
