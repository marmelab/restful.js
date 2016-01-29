import { expect } from 'chai';
import * as decorators from '../../../src/model/decorator';
import sinon from 'sinon';

describe('Decorator Model', () => {
    let endpoint;

    beforeEach(() => {
        endpoint = {
            new: sinon.stub().returns({ fake: true }),
            url: sinon.stub().returns('/url'),
        };
    });

    describe('Member Decorator', () => {
        it('should add all, custom and one methods to an endpoint', () => {
            const member = decorators.member(endpoint);

            expect(typeof(member.all)).to.equal('function');
            expect(typeof(member.custom)).to.equal('function');
            expect(typeof(member.one)).to.equal('function');
        });

        it('should create a new endpoint with correct url when one is called', () => {
            const member = decorators.member(endpoint);

            const childMember = member.one('articles', 1);

            expect(endpoint.new.getCall(0).args).to.deep.equal([
                '/url/articles/1',
            ]);
            expect(childMember.fake).to.equal(true);
            expect(typeof(childMember.all)).to.equal('function');
            expect(typeof(childMember.custom)).to.equal('function');
            expect(typeof(childMember.one)).to.equal('function');
        });

        it('should create a new endpoint with correct url when all is called', () => {
            const member = decorators.member(endpoint);

            const articles = member.all('articles');

            expect(endpoint.new.getCall(0).args).to.deep.equal([
                '/url/articles',
            ]);

            expect(articles.all).to.equal(undefined);
            expect(typeof(articles.custom)).to.equal('function');
        });

        it('should create a new endpoint with correct url when custom is called', () => {
            const member = decorators.member(endpoint);

            const test = member.custom('test/me');

            expect(endpoint.new.getCall(0).args).to.deep.equal([
                '/url/test/me',
            ]);

            expect(typeof(test.one)).to.equal('function');
            expect(typeof(test.all)).to.equal('function');
            expect(typeof(test.custom)).to.equal('function');

            const testAbsolute = member.custom('/test/me', false);

            expect(endpoint.new.getCall(1).args).to.deep.equal([
                '/test/me',
            ]);

            expect(typeof(testAbsolute.one)).to.equal('function');
            expect(typeof(testAbsolute.all)).to.equal('function');
            expect(typeof(testAbsolute.custom)).to.equal('function');
        });
    });

    describe('Collection Decorator', () => {
        it('should add custom and one methods to an endpoint', () => {
            const collection = decorators.collection(endpoint);

            expect(typeof(collection.custom)).to.equal('function');
        });

        it('should create a new endpoint with correct url when custom is called', () => {
            const collection = decorators.collection(endpoint);

            const test = collection.custom('test/me');

            expect(endpoint.new.getCall(0).args).to.deep.equal([
                '/url/test/me',
            ]);

            expect(typeof(test.one)).to.equal('function');
            expect(typeof(test.all)).to.equal('function');
            expect(typeof(test.custom)).to.equal('function');

            const testAbsolute = collection.custom('/test/me', false);

            expect(endpoint.new.getCall(1).args).to.deep.equal([
                '/test/me',
            ]);

            expect(typeof(testAbsolute.one)).to.equal('function');
            expect(typeof(testAbsolute.all)).to.equal('function');
            expect(typeof(testAbsolute.custom)).to.equal('function');
        });

        it('should create a new endpoint with correct url on the fly when an http method is called', () => {
            const collection = decorators.collection(endpoint);
            endpoint.post = sinon.stub().returns({ hello2: 'world2' });
            const get = sinon.stub().returns({ hello: 'world' });

            endpoint.new.returns({
                get,
            });

            expect(collection.get(1, { test: 1 }, { here: 2 })).to.deep.equal({ hello: 'world' });
            expect(get.getCall(0).args).to.deep.equal([
                { test: 1 },
                { here: 2 },
            ]);
            expect(endpoint.new.getCall(0).args).to.deep.equal([
                '/url/1',
            ]);

            expect(collection.post({ data: true }, { test: 1 }, { here: 2 })).to.deep.equal({ hello2: 'world2' });
            expect(endpoint.post.getCall(0).args).to.deep.equal([
                { data: true },
                { test: 1 },
                { here: 2 },
            ]);
        });

        it('should call get on the endpoint when getAll is called', () => {
            endpoint.get = { do: 1 };

            const collection = decorators.collection(endpoint);
            expect(collection.getAll).to.deep.equal({ do: 1 });
        });
    });
});
