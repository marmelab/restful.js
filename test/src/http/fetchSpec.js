import { expect } from 'chai';
import fetchBackend from '../../../src/http/fetch';
import sinon from 'sinon';

describe('Fetch HTTP Backend', () => {
    let httpBackend;
    let fetch;
    let response;

    beforeEach(() => {
        response = {
            headers: {
                forEach: (cb) => {
                    cb('here', 'test');
                },
            },
			      text: sinon.stub().returns(Promise.resolve('{ "content": "Yes" }')),
            json: sinon.stub().returns(Promise.resolve({ content: 'Yes' })),
            status: 200,
        };
        fetch = sinon.stub().returns(Promise.resolve(response));
        httpBackend = fetchBackend(fetch);
    });

    it('should map config to be compatible with fetch package', () => {
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

        expect(fetch.getCall(0).args).to.deep.equal([
            '/url?asc=1',
            {
                body: '{"me":"you"}',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            },
        ]);

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

        expect(fetch.getCall(1).args).to.deep.equal([
            '/url?asc=1',
            {
                body: {
                    me: 'you',
                },
                headers: {},
            },
        ]);
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
        .then((response) => { // eslint-disable-line no-shadow
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
    });

    it('should correctly format the response when body content is empty', (done) => {
        response.status = 204;
        response.text = sinon.stub().returns(Promise.resolve(''));
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
        .then((_response) => {
            expect(_response).to.deep.equal({
                data: {},
                headers: {
                    test: 'here',
                },
                statusCode: 204,
            });

            expect(response.json.callCount).to.equal(0);
            done();
        })
        .catch(done);
    });

    it('should correctly format the error when it fails', (done) => {
        response.status = 404;
        response.statusText = 'Not Found';

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
    });

    it('should correctly stringify the query string', () => {
        httpBackend({
            data: {
                me: 'you',
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            params: {
                asc: 1,
                fields: [
                    'name',
                    'firstname',
                    'email',
                ],
            },
            url: '/url',
        });

        expect(fetch.getCall(0).args).to.deep.equal([
            encodeURI('/url?asc=1&fields[]=name&fields[]=firstname&fields[]=email'),
            {
                body: '{"me":"you"}',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            },
        ]);

        httpBackend({
            data: {
                me: 'you',
            },
            headers: {},
            params: {},
            url: '/url',
        });

        expect(fetch.getCall(1).args).to.deep.equal([
            '/url',
            {
                body: {
                    me: 'you',
                },
                headers: {},
            },
        ]);
    });
});
