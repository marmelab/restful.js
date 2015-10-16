import api from '../mock/api';
import { expect } from 'chai';
import nock from 'nock';
import request from 'request';
import restful, { requestBackend } from '../../src';
import sinon from 'sinon';

describe('Restful', () => {
    it('should create an endpoint with provided url when it is called', (done) => {
        const client = restful('http://url', sinon.stub().returns(Promise.resolve({
            data: { output: 1 },
        })));

        expect(client.url()).to.equal('http://url');

        client.get().then((response) => {
            expect(response.body(false)).to.deep.equal({
                output: 1,
            });

            done();
        }).catch(done);
    });

    it('should create an endpoint with current url if none provided and window.location exists', () => {
        global.window = {
            location: {
                host: 'test.com',
                protocol: 'https:',
            },
        };

        const client = restful();

        expect(client.url()).to.equal('https://test.com');

        delete global.window;
    });

    it('should work with a real API', (done) => {
        api(nock);
        const client = restful('http://localhost', requestBackend(request));

        client
            .all('articles')
            .identifier('_id')
            .getAll()
            .then((response) => {
                const articles = response.body();

                expect(articles[0].data()).to.deep.equal({
                    author: 'Pedro',
                    title: 'Beauty Is A Kaleidoscope of Colour',
                    _id: '1',
                });
                expect(articles[0].id()).to.equal('1');

                expect(articles[3].data()).to.deep.equal({
                    author: 'Tuco',
                    title: 'The Admirable Reason Why He Took The Right Path',
                    _id: '4',
                });
                expect(articles[3].id()).to.equal('4');

                return articles;
            })
            .then((articles) => {
                return articles[4]
                    .one('comments', 2)
                    .identifier('id')
                    .get()
                    .then((response) => {
                        const comment = response.body();

                        expect(comment.id()).to.equal('2');
                        comment.data().content = 'Updated';
                        return comment.save();
                    })
                    .then((response) => {
                        expect(response.body(false)).to.deep.equal({
                            content: 'Updated',
                            id: '2',
                        });
                        return client.all('articles').post({
                            title: 'Hello',
                        });
                    })
                    .then((response) => {
                        expect(response.body(false)).to.deep.equal({
                            title: 'Hello',
                        });
                        expect(response.statusCode()).to.equal(201);

                        return client.one('articles', 1).delete({ cascade: '1' });
                    })
                    .then((response) => {
                        expect(response.body(false)).to.deep.equal({
                            cascade: '1',
                        });
                        expect(response.statusCode()).to.equal(200);
                    });
            })
            .then(() => done())
            .catch(done);
    });

    it('shoud append to restful._instances each instance of restful', () => {
        restful._flush();
        expect(restful._instances()).to.deep.equal([]);

        const instance1 = restful();
        const instance2 = restful();

        expect(restful._instances()).to.deep.equal([
            instance1,
            instance2,
        ]);
    });
});
