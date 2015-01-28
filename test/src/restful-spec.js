/*global describe,it,expect,beforeEach,jasmine*/

(function() {
    'use strict';

    var http,
        resource,
        q;

    describe('restful', function() {
        beforeEach(function() {
            q = function q(result) {
                return {
                    then: function(cb) {
                        return q(cb(result));
                    }
                };
            };

            http = {
                get: function(url, config) {

                    if (url.substr(url.length - 1) !== 's') {
                        return q({
                            // `data` is the response that was provided by the server
                            data: config.transformResponse[0]({
                                id: 1,
                                title: 'test',
                                body: 'Hello, I am a test',
                                published_at: '2015-01-03'
                            }),

                            // `status` is the HTTP status code from the server response
                            status: 200,

                            // `headers` the headers that the server responded with
                            headers: {},

                            // `config` is the config that was provided to `axios` for the request
                            config: {}
                        });
                    } else {
                        return q({
                            // `data` is the response that was provided by the server
                            data: [
                                {
                                    id: 1,
                                    title: 'test',
                                    body: 'Hello, I am a test'
                                },
                                {
                                    id: 2,
                                    title: 'test2',
                                    body: 'Hello, I am a test2'
                                }
                            ],

                            // `status` is the HTTP status code from the server response
                            status: 200,

                            // `headers` the headers that the server responded with
                            headers: {},

                            // `config` is the config that was provided to `axios` for the request
                            config: {}
                        });
                    }
                },

                put: function(url, data, headers) {
                    return q({
                        // `data` is the response that was provided by the server
                        data: {
                            result: 2
                        },

                        // `status` is the HTTP status code from the server response
                        status: 200,

                        // `headers` the headers that the server responded with
                        headers: {},

                        // `config` is the config that was provided to `axios` for the request
                        config: {}
                    });
                },

                delete: function(url, data, headers) {
                    return q({
                        // `data` is the response that was provided by the server
                        data: {
                            result: 1
                        },

                        // `status` is the HTTP status code from the server response
                        status: 200,

                        // `headers` the headers that the server responded with
                        headers: {},

                        // `config` is the config that was provided to `axios` for the request
                        config: {}
                    });
                },

                post: function(url, data, headers) {
                    return q({
                        // `data` is the response that was provided by the server
                        data: {
                            result: 0
                        },

                        // `status` is the HTTP status code from the server response
                        status: 200,

                        // `headers` the headers that the server responded with
                        headers: {},

                        // `config` is the config that was provided to `axios` for the request
                        config: {}
                    });
                },

                patch: function(url, data, headers) {
                    return q({
                        // `data` is the response that was provided by the server
                        data: {
                            result: 4
                        },

                        // `status` is the HTTP status code from the server response
                        status: 200,

                        // `headers` the headers that the server responded with
                        headers: {},

                        // `config` is the config that was provided to `axios` for the request
                        config: {}
                    });
                },

                head: function(url, data, headers) {
                    return q({
                        // `data` is the response that was provided by the server
                        data: {
                            result: 5
                        },

                        // `status` is the HTTP status code from the server response
                        status: 200,

                        // `headers` the headers that the server responded with
                        headers: {},

                        // `config` is the config that was provided to `axios` for the request
                        config: {}
                    });
                }
            };

            resource = restful('localhost')
                        .config()
                        .port(3000)
                        .prefixUrl('v1')
                        .protocol('https')
                        ._httpBackend(http)
                        .end();
        });

        it('should provide a configured resource', function() {
            var config = resource.config();

            expect(config.baseUrl()).toBe('localhost');
            expect(config.port()).toBe(3000);
            expect(config.prefixUrl()).toBe('v1');
            expect(config.protocol()).toBe('https');
            expect(config._httpBackend()).toBe(http);

            expect(resource.url()).toBe('https://localhost:3000/v1');
        });

        it('should provide a configured collection when resource.all is called', function() {
            var articles = resource.all('articles');

            expect(articles.url()).toBe('https://localhost:3000/v1/articles');
            expect(articles.config()._parent()).toBe(resource);
        });

        it('should provide a configured collection/member when calls are chained', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 5);

            expect(comment.url()).toBe('https://localhost:3000/v1/articles/3/comments/5');
            expect(comment.config()._parent()).toBe(article);

            var comments = article.all('comments');

            expect(comments.url()).toBe('https://localhost:3000/v1/articles/3/comments');
        });

        it('should call http.get with correct parameters when get is called on a member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 5);

            spyOn(http, 'get').andCallThrough();

            comment.get().then(function(entity) {
                // As we use a promesse mock, this is always called synchronously
                expect(entity.title()).toBe('test');
                expect(entity.body()).toBe('Hello, I am a test');
            });

            expect(http.get).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                params: {},
                headers: {},
                transformResponse: [jasmine.any(Function)]
            });

            http.get.reset();

            comment.get({ test: 'test3' }, { bar: 'foo' }).then(function(entity) {
                // As we use a promesse mock, this is always called synchronously
                expect(entity.title()).toBe('test');
                expect(entity.body()).toBe('Hello, I am a test');
            });

            expect(http.get).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                params: { test: 'test3' },
                headers: { bar: 'foo' },
                transformResponse: [jasmine.any(Function)]
            });
        });

        it('should call http.get with correct parameters when rawGet is called on a member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 5);

            spyOn(http, 'get').andCallThrough();

            comment.rawGet({ test: 'test3' }, { bar: 'foo' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    // `data` is the response that was provided by the server
                    data: {
                        id: 1,
                        title: 'test',
                        body: 'Hello, I am a test',
                        published_at: '2015-01-03'
                    },

                    // `status` is the HTTP status code from the server response
                    status: 200,

                    // `headers` the headers that the server responded with
                    headers: {},

                    // `config` is the config that was provided to `axios` for the request
                    config: {}
                });
            });

            expect(http.get).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                params: { test: 'test3' },
                headers: { bar: 'foo' },
                transformResponse: [jasmine.any(Function)]
            });
        });

        it('should call http.put with correct parameters when put is called on member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 2);

            spyOn(http, 'put').andCallThrough();

            comment.put({ body: 'I am a new comment' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({ result: 2 });
            });

            expect(http.put).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    body: 'I am a new comment'
                },
                {
                    headers: {},
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.put with correct parameters when rawPut is called on member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 2);

            spyOn(http, 'put').andCallThrough();

            comment.rawPut({ body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    // `data` is the response that was provided by the server
                    data: {
                        result: 2
                    },

                    // `status` is the HTTP status code from the server response
                    status: 200,

                    // `headers` the headers that the server responded with
                    headers: {},

                    // `config` is the config that was provided to `axios` for the request
                    config: {}
                });
            });

            expect(http.put).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    body: 'I am a new comment'
                },
                {
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.delete with correct parameters when delete is called on member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 2);

            spyOn(http, 'delete').andCallThrough();

            comment.delete({ foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({ result: 1 });
            });

            expect(http.delete).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.delete with correct parameters when rawDelete is called on member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 2);

            spyOn(http, 'delete').andCallThrough();

            comment.rawDelete({ foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    // `data` is the response that was provided by the server
                    data: {
                        result: 1
                    },

                    // `status` is the HTTP status code from the server response
                    status: 200,

                    // `headers` the headers that the server responded with
                    headers: {},

                    // `config` is the config that was provided to `axios` for the request
                    config: {}
                });
            });

            expect(http.delete).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.head with correct parameters when head is called on a member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 5);

            spyOn(http, 'head').andCallThrough();

            comment.head({ bar: 'foo' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    // `data` is the response that was provided by the server
                    data: {
                        result: 5
                    },

                    // `status` is the HTTP status code from the server response
                    status: 200,

                    // `headers` the headers that the server responded with
                    headers: {},

                    // `config` is the config that was provided to `axios` for the request
                    config: {}
                });
            });

            expect(http.head).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                headers: { bar: 'foo' },
                transformResponse: [jasmine.any(Function)]
            });
        });

        it('should call http.patch with correct parameters when patch is called on member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 2);

            spyOn(http, 'patch').andCallThrough();

            comment.patch({ body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    result: 4
                });
            });

            expect(http.patch).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    body: 'I am a new comment'
                },
                {
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.patch with correct parameters when rawPatch is called on member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 2);

            spyOn(http, 'patch').andCallThrough();

            comment.rawPatch({ body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    // `data` is the response that was provided by the server
                    data: {
                        result: 4
                    },

                    // `status` is the HTTP status code from the server response
                    status: 200,

                    // `headers` the headers that the server responded with
                    headers: {},

                    // `config` is the config that was provided to `axios` for the request
                    config: {}
                });
            });

            expect(http.patch).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    body: 'I am a new comment'
                },
                {
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.put with correct parameters when save is called on an entity', function() {
            var articles = resource.one('articles', 3),
                comment = articles.one('comments', 5);

            spyOn(http, 'get').andCallThrough();
            spyOn(http, 'put').andCallThrough();

            comment.get().then(function(entity) {
                // As we use a promesse mock, this is always called synchronously
                expect(entity.title()).toBe('test');
                expect(entity.body()).toBe('Hello, I am a test');
                expect(entity.publishedAt()).toBe('2015-01-03');

                entity.body('Overriden');
                entity.publishedAt('2015-01-06');
                entity.save();
            });

            expect(http.get).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                params: {},
                headers: {},
                transformResponse: [jasmine.any(Function)]
            });

            expect(http.put).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/5',
                {
                    id: 1,
                    title: 'test',
                    body: 'Overriden',
                    published_at: '2015-01-06'
                },
                {
                    headers: {},
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                }
            );

            http.put.reset();

            comment.get().then(function(entity) {
                // As we use a promesse mock, this is always called synchronously
                entity.save({ foo: 'bar' });
            });

            expect(http.put).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/5',
                {
                    id: 1,
                    title: 'test',
                    body: 'Hello, I am a test',
                    published_at: '2015-01-03'
                },
                {
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.delete with correct parameters when remove is called on an entity', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 5);

            spyOn(http, 'get').andCallThrough();
            spyOn(http, 'delete').andCallThrough();

            comment.get().then(function(entity) {
                // As we use a promesse mock, this is always called synchronously
                expect(entity.title()).toBe('test');
                expect(entity.body()).toBe('Hello, I am a test');

                entity.remove()
            });

            expect(http.get).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                params: {},
                headers: {},
                transformResponse: [jasmine.any(Function)]
            });

            expect(http.delete).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                headers: {},
                transformResponse: [jasmine.any(Function)]
            });

            http.delete.reset();

            comment.get().then(function(entity) {
                // As we use a promesse mock, this is always called synchronously
                entity.remove({ foo: 'bar' });
            });

            expect(http.delete).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                headers: { foo: 'bar' },
                transformResponse: [jasmine.any(Function)]
            });
        });

        it('should call http.get with correct parameters when get is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'get').andCallThrough();

            comments.get(1, { page: 1 }, { foo: 'bar' }).then(function(entity) {
                // As we use a promesse mock, this is always called synchronously
                expect(entity.id()).toBe(1);
                expect(entity.title()).toBe('test');
                expect(entity.body()).toBe('Hello, I am a test');
            });

            expect(http.get).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/1',
                {
                    params: { page: 1 },
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.get with correct parameters when rawGet is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'get').andCallThrough();

            comments.rawGet(1, { page: 1 }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    // `data` is the response that was provided by the server
                    data: {
                        id: 1,
                        title: 'test',
                        body: 'Hello, I am a test',
                        published_at: '2015-01-03'
                    },

                    // `status` is the HTTP status code from the server response
                    status: 200,

                    // `headers` the headers that the server responded with
                    headers: {},

                    // `config` is the config that was provided to `axios` for the request
                    config: {}
                });
            });

            expect(http.get).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/1',
                {
                    params: { page: 1 },
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.get with correct parameters when getAll is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'get').andCallThrough();

            comments.getAll({ page: 1 }, { foo: 'bar' }).then(function(entities) {
                // As we use a promesse mock, this is always called synchronously
                expect(entities[0].id()).toBe(1);
                expect(entities[0].title()).toBe('test');
                expect(entities[0].body()).toBe('Hello, I am a test');

                expect(entities[1].id()).toBe(2);
                expect(entities[1].title()).toBe('test2');
                expect(entities[1].body()).toBe('Hello, I am a test2');
            });

            expect(http.get).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments',
                {
                    params: { page: 1 },
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.get with correct parameters when rawGetAll is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'get').andCallThrough();

            comments.rawGetAll({ page: 1 }, { foo: 'bar' }).then(function(responses) {
                // As we use a promesse mock, this is always called synchronously
                expect(responses).toEqual({
                    // `data` is the response that was provided by the server
                    data: [
                        {
                            id: 1,
                            title: 'test',
                            body: 'Hello, I am a test'
                        },
                        {
                            id: 2,
                            title: 'test2',
                            body: 'Hello, I am a test2'
                        }
                    ],

                    // `status` is the HTTP status code from the server response
                    status: 200,

                    // `headers` the headers that the server responded with
                    headers: {},

                    // `config` is the config that was provided to `axios` for the request
                    config: {}
                });
            });

            expect(http.get).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments',
                {
                    params: { page: 1 },
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.post with correct parameters when post is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'post').andCallThrough();

            comments.post({ body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({ result: 0 });
            });

            expect(http.post).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments',
                '{"body":"I am a new comment"}',
                {
                    headers: { 'Content-Type': 'json', foo: 'bar' },
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.post with correct parameters when rawPost is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'post').andCallThrough();

            comments.rawPost({ body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    // `data` is the response that was provided by the server
                    data: {
                        result: 0
                    },

                    // `status` is the HTTP status code from the server response
                    status: 200,

                    // `headers` the headers that the server responded with
                    headers: {},

                    // `config` is the config that was provided to `axios` for the request
                    config: {}
                });
            });

            expect(http.post).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments',
                '{"body":"I am a new comment"}',
                {
                    headers: { 'Content-Type': 'json', foo: 'bar' },
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.put with correct parameters when put is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'put').andCallThrough();

            comments.put(2, { body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({ result: 2 });
            });

            expect(http.put).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    body: 'I am a new comment'
                },
                {
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.put with correct parameters when rawPost is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'put').andCallThrough();

            comments.rawPut(2, { body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    // `data` is the response that was provided by the server
                    data: {
                        result: 2
                    },

                    // `status` is the HTTP status code from the server response
                    status: 200,

                    // `headers` the headers that the server responded with
                    headers: {},

                    // `config` is the config that was provided to `axios` for the request
                    config: {}
                });
            });

            expect(http.put).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    body: 'I am a new comment'
                },
                {
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.delete with correct parameters when delete is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'delete').andCallThrough();

            comments.delete(2, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({ result: 1 });
            });

            expect(http.delete).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.delete with correct parameters when rawPost is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'delete').andCallThrough();

            comments.rawDelete(2, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    // `data` is the response that was provided by the server
                    data: {
                        result: 1
                    },

                    // `status` is the HTTP status code from the server response
                    status: 200,

                    // `headers` the headers that the server responded with
                    headers: {},

                    // `config` is the config that was provided to `axios` for the request
                    config: {}
                });
            });

            expect(http.delete).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.head with correct parameters when head is called on a collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'head').andCallThrough();

            comments.head(5, { bar: 'foo' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    // `data` is the response that was provided by the server
                    data: {
                        result: 5
                    },

                    // `status` is the HTTP status code from the server response
                    status: 200,

                    // `headers` the headers that the server responded with
                    headers: {},

                    // `config` is the config that was provided to `axios` for the request
                    config: {}
                });
            });

            expect(http.head).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                headers: { bar: 'foo' },
                transformResponse: [jasmine.any(Function)]
            });
        });

        it('should call http.patch with correct parameters when patch is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'patch').andCallThrough();

            comments.patch(2, { body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    result: 4
                });
            });

            expect(http.patch).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    body: 'I am a new comment'
                },
                {
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                }
            );
        });

        it('should call http.patch with correct parameters when rawPatch is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'patch').andCallThrough();

            comments.rawPatch(2, { body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    // `data` is the response that was provided by the server
                    data: {
                        result: 4
                    },

                    // `status` is the HTTP status code from the server response
                    status: 200,

                    // `headers` the headers that the server responded with
                    headers: {},

                    // `config` is the config that was provided to `axios` for the request
                    config: {}
                });
            });

            expect(http.patch).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    body: 'I am a new comment'
                },
                {
                    headers: { foo: 'bar' },
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                }
            );
        });

        it('should merge global headers with headers argument', function() {
            resource
                .config()
                .headers({ foo2: 'bar2' });

            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'get').andCallThrough();

            comments.get(2, null, { foo: 'bar' });

            expect(http.get).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    params: {},
                    headers: { foo: 'bar', foo2: 'bar2' },
                    transformResponse: [jasmine.any(Function)]
                }
            );

            http.get.reset();

            comments.get(2, null, { foo2: 'bar' });

            expect(http.get).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    params: {},
                    headers: { foo2: 'bar' },
                    transformResponse: [jasmine.any(Function)]
                }
            );

            comments
                .config()
                    .headers({ foo3: 'bar3' })
                    .end()
                .responseInterceptor(function(res) {
                    res.title = 'Intercepted :)';

                    return res;
                });

            comments.get(1).then(function(comment) {
                http.get.reset();

                expect(comment.title()).toBe('Intercepted :)');

                // test inheritance pattern
                resource.one('articles', 1).get().then(function(article) {
                    expect(article.title()).toBe('test');
                });

                comment.one('authors', 1).get();

                expect(http.get).toHaveBeenCalledWith(
                    'https://localhost:3000/v1/articles/3/comments/1/authors/1',
                    {
                        params: {},
                        headers: { foo3: 'bar3' },
                        transformResponse: [jasmine.any(Function)]
                    }
                );
            });
        });

        it('should call response interceptors on get response', function() {
            var interceptor1 = jasmine.createSpy('interceptor1').andReturn({
                id: 1,
                title: 'Intercepted',
                body: 'Hello, I am a test',
                published_at: '2015-01-03'
            });

            var interceptor2 = jasmine.createSpy('interceptor2').andReturn({
                id: 1,
                title: 'Intercepted !!',
                body: 'Hello, I am a test',
                published_at: '2015-01-03'
            });

            resource.responseInterceptor(interceptor1);
            resource.responseInterceptor(interceptor2);

            var getArgs;

            spyOn(http, 'get').andCallFake(function(url, config) {
                getArgs = {
                    url: url,
                    config: config
                };

                return q({
                    data: {
                        id: 1,
                        title: 'test',
                        body: 'Hello, I am a test',
                        published_at: '2015-01-03'
                    }
                });
            });

            resource.one('articles', 1).get().then(function(article) {
                expect(getArgs).toEqual({
                    url: 'https://localhost:3000/v1/articles/1',
                    config: {
                        params : {},
                        headers: {},
                        transformResponse: [jasmine.any(Function)]
                    }
                });

                var transformedData = getArgs.config.transformResponse[0](JSON.stringify({
                    id: 1,
                    title: 'test',
                    body: 'Hello, I am a test',
                    published_at: '2015-01-03'
                }));

                expect(interceptor1).toHaveBeenCalledWith({
                    id: 1,
                    title: 'test',
                    body: 'Hello, I am a test',
                    published_at: '2015-01-03'
                });

                expect(interceptor2).toHaveBeenCalledWith({
                    id: 1,
                    title: 'Intercepted',
                    body: 'Hello, I am a test',
                    published_at: '2015-01-03'
                });

                expect(transformedData.title).toBe('Intercepted !!');
            });
        });
    });
})();
