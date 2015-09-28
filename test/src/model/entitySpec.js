import { expect } from 'chai';
import entityModel from '../../../src/model/entity';
import sinon from 'sinon';

describe('Entity model', () => {
    let endpoint;
    let entity;

    beforeEach(() => {
        endpoint = {
            all: sinon.spy(),
            custom: sinon.spy(),
            delete: sinon.spy(),
            identifier: sinon.stub().returns('hello'),
            one: sinon.spy(),
            put: sinon.spy(),
            url: sinon.stub().returns('/url'),
        };

        entity = entityModel({
            hello: 'world',
            here: 'again',
        }, endpoint);
    });

    it('should return its id based on the endpoint identifier', () => {
        expect(entity.id()).to.equal('world');
        expect(endpoint.identifier.callCount).to.equal(1);
    });

    it('should return its data when data is called', () => {
        expect(entity.data()).to.deep.equal({
            hello: 'world',
            here: 'again',
        });
    });

    it('should call endpoint.all when all is called', () => {
        entity.all('test', 'me');
        expect(endpoint.all.getCall(0).args).to.deep.equal([
            'test',
            'me',
        ]);
    });

    it('should call endpoint.one when one is called', () => {
        entity.one('test', 'me');
        expect(endpoint.one.getCall(0).args).to.deep.equal([
            'test',
            'me',
        ]);
    });

    it('should call endpoint.delete when delete is called', () => {
        entity.delete('test', 'me');
        expect(endpoint.delete.getCall(0).args).to.deep.equal([
            'test',
            'me',
        ]);
    });

    it('should call endpoint.put with entity data when save is called', () => {
        entity.save('test', 'me');
        expect(endpoint.put.getCall(0).args).to.deep.equal([
            {
                hello: 'world',
                here: 'again',
            },
            'test',
            'me',
        ]);
    });

    it('should call endpoint.url when url is called', () => {
        expect(entity.url('test', 'me')).to.equal('/url');
        expect(endpoint.url.getCall(0).args).to.deep.equal([
            'test',
            'me',
        ]);
    });
});
