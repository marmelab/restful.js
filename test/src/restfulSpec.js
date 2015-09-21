global.window = {
    location: {
        host: 'test.com',
        protocol: 'https:',
    },
};
global.self = {};

import { expect } from 'chai';
import restful from '../../src';
import sinon from 'sinon';

describe('Restful', () => {
    let httpBackend;

    beforeEach(() => {
        httpBackend = sinon.stub().returns(Promise.resolve({
            data: { output: 1 },
        }));
    });

    it('should create an endpoint with provided url when it is called', (done) => {
        const api = restful('http://url', httpBackend);

        expect(api.url()).to.equal('http://url');

        api.get().then((response) => {
            expect(response.body(false)).to.deep.equal({
                output: 1,
            });

            done();
        }).catch(done);
    });

    it('should create an endpoint with current url if none provided', () => {
        const api = restful(null, httpBackend);

        expect(api.url()).to.equal('https://test.com');
    });
});
