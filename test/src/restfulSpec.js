import api from '../mock/api';
import { expect } from 'chai';
import nock from 'nock';
import requestBackend from '../../src/http/request';
import request from 'request';
import restful from '../../src';
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

    it.only('should work with a real API', (done) => {
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
                        // return comment.save();
                    });
            })
            .then(() => done())
            .catch(done);
    });
});
