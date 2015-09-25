import { expect } from 'chai';
import requestBackend from '../../../src/http/request';
import sinon from 'sinon';

describe('Request HTTP Backend', () => {
    let httpBackend;
    let request;

    beforeEach(() => {
        request = sinon.spy();
        httpBackend = requestBackend(request);
    });

    it('should map config to be compatible with request package', () => {
        httpBackend({
            data: {
                me: 'you',
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            params: {
                asc: 1,
            },
            url: '/url',
        });

        expect(request.getCall(0).args[0]).to.deep.equal({
            form: '{"me":"you"}',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            qs: {
                asc: 1,
            },
            url: '/url',
        });

        httpBackend({
            data: {
                me: 'you',
            },
            headers: {},
            params: {
                asc: 1,
            },
            url: '/url',
        });

        expect(request.getCall(1).args[0]).to.deep.equal({
            form: {
                me: 'you',
            },
            headers: {},
            qs: {
                asc: 1,
            },
            url: '/url',
        });
    });

    it('should correctly format the response when it succeed', (done) => {
        httpBackend({
            data: {
                me: 'you',
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            params: {
                asc: 1,
            },
            url: '/url',
        })
        .then((response) => {
            expect(response).to.deep.equal({
                data: {
                    content: 'Yes',
                },
                headers: {
                    test: 'here',
                },
                statusCode: 200,
            });

            done();
        })
        .catch(done);

        request.getCall(0).args[1](null, {
            headers: {
                test: 'here',
            },
            statusCode: 200,
        }, '{"content":"Yes"}');
    });

    it('should correctly format the error when it fails', (done) => {
        httpBackend({
            data: {
                me: 'you',
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            params: {
                asc: 1,
            },
            url: '/url',
        })
        .then(done.bind(done, ['It should throw an error']), (error) => {
            expect(error.message).to.equal('Not Found');
            expect(error.response).to.deep.equal({
                data: {
                    content: 'Yes',
                },
                headers: {
                    test: 'here',
                },
                statusCode: 404,
            });

            done();
        })
        .catch(done);

        request.getCall(0).args[1](null, {
            headers: {
                test: 'here',
            },
            statusCode: 404,
            statusMessage: 'Not Found',
        }, '{"content":"Yes"}');
    });
});
