import { expect } from 'chai';
import { fromJS } from 'immutable';
import responseModel from '../../../src/model/response';
import sinon from 'sinon';

describe('Response model', () => {
    let endpoint;
    let response;

    beforeEach(() => {
        endpoint = {
            all: sinon.spy(),
            custom: sinon.stub().returns({
                url: sinon.stub().returns('/url/id'),
            }),
            identifier: sinon.stub().returns('hello'),
            url: sinon.stub().returns('/url'),
        };

        response = responseModel(fromJS({
            data: {
                hello: 'world',
                here: 'again',
            },
            headers: {
                hello: 'world',
            },
            statusCode: 200,
        }), endpoint);
    });

    it('should return its statusCode when statusCode is called', () => {
        expect(response.statusCode()).to.equal(200);
    });

    it('should return its headers when headers is called', () => {
        expect(response.headers()).to.deep.equal({
            hello: 'world',
        });
    });

    it('should return its raw data when body is called with false as argument', () => {
        expect(response.body(false)).to.deep.equal({
            hello: 'world',
            here: 'again',
        });
    });

    it('should return one entity when it raw data is not an array and body is called without argument', () => {
        const entity = response.body();

        expect(entity.data()).to.deep.equal({
            hello: 'world',
            here: 'again',
        });

        // Ensure the same endpoint is given to our entity
        expect(entity.url()).to.equal('/url');
        expect(endpoint.url.getCall(0).args).to.deep.equal([]);
    });

    it('should return an array of entities when it raw data is an array and body is called without argument', () => {
        delete endpoint.all; // We simulate a collection endpoint;

        const entities = responseModel(fromJS({
            data: [
                {
                    hello: 'world',
                    here: 'again',
                },
                {
                    hello: 'world2',
                    here: 'again2',
                },
            ],
        }), endpoint).body();

        expect(entities[0].data()).to.deep.equal({
            hello: 'world',
            here: 'again',
        });
        expect(entities[1].data()).to.deep.equal({
            hello: 'world2',
            here: 'again2',
        });

        expect(entities[0].url()).to.equal('/url/id');
        expect(entities[1].url()).to.equal('/url/id');

        expect(endpoint.custom.getCall(0).args).to.deep.equal(['world']);
        expect(endpoint.custom.getCall(1).args).to.deep.equal(['world2']);
    });
});
