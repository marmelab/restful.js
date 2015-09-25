import { expect } from 'chai';
import serialize from '../../../src/util/serialize';
import { Map } from 'immutable';

/* eslint-disable new-cap */
describe('Serialize util', () => {
    it('should call to JS on an Iterable before returning it', () => {
        expect(serialize(Map({ test: 'test' }))).to.deep.equal({
            test: 'test',
        });
    });

    it('should return a non Iterable value', () => {
        expect(serialize('test')).to.equal('test');

        expect(serialize({ test: 'test' })).to.deep.equal({
            test: 'test',
        });
    });
});
