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
                            data: config.responseInterceptors[0] ? config.responseInterceptors[0]({
                                id: 1,
                                title: 'test',
                                body: 'Hello, I am a test',
                                published_at: '2015-01-03'
                            }) : {
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
                        .port(3000)
                        .prefixUrl('v1')
                        .protocol('https')
                        ._http(http);
        });

        it('should provide a configured resource', function() {
            expect(resource.baseUrl()).toBe('localhost');
            expect(resource.port()).toBe(3000);
            expect(resource.prefixUrl()).toBe('v1');
            expect(resource.protocol()).toBe('https');
            expect(resource._http()).toBe(http);

            expect(resource.url()).toBe('https://localhost:3000/v1');
        });

        it('should provide a configured collection when resource.all is called', function() {
            var articles = resource.all('articles');

            expect(articles.url()).toBe('https://localhost:3000/v1/articles');
            expect(articles()._parent()).toBe(resource());
        });

        it('should provide a configured collection/member when calls are chained', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 5);

            expect(comment.url()).toBe('https://localhost:3000/v1/articles/3/comments/5');
            expect(comment()._parent()).toBe(article());

            var comments = article.all('comments');

            expect(comments.url()).toBe('https://localhost:3000/v1/articles/3/comments');
        });

        it('should call http.get with correct parameters when get is called on a member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 5);

            spyOn(http, 'get').andCallThrough();

            comment.get().then(function(entity) {
                // As we use a promesse mock, this is always called synchronously
                expect(entity().data.title).toBe('test');
                expect(entity().data.body).toBe('Hello, I am a test');
            });

            expect(http.get).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                params: {},
                headers: {},
                responseInterceptors: []
            });

            http.get.reset();

            comment.get({ test: 'test3' }, { bar: 'foo' }).then(function(entity) {
                // As we use a promesse mock, this is always called synchronously
                expect(entity().data.title).toBe('test');
                expect(entity().data.body).toBe('Hello, I am a test');
            });

            expect(http.get).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                params: { test: 'test3' },
                headers: { bar: 'foo' },
                responseInterceptors: []
            });
        });

        it('should call http.put with correct parameters when put is called on member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 2);

            spyOn(http, 'put').andCallThrough();

            comment.put({ body: 'I am a new comment' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    data: {
                        result: 2
                    },
                    status: 200,
                    headers: {},
                    config: {}
                });
            });

            expect(http.put).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    body: 'I am a new comment'
                },
                {
                    headers: {},
                    responseInterceptors: [],
                    requestInterceptors: []
                }
            );
        });

        it('should call http.delete with correct parameters when delete is called on member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 2);

            spyOn(http, 'delete').andCallThrough();

            comment.delete({ foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response).toEqual({
                    data: {
                        result: 1
                    },
                    status: 200,
                    headers: {},
                    config: {}
                });
            });

            expect(http.delete).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    headers: { foo: 'bar' },
                    responseInterceptors: []
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
                responseInterceptors: []
            });
        });

        it('should call http.patch with correct parameters when patch is called on member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 2);

            spyOn(http, 'patch').andCallThrough();

            comment.patch({ body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
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
                    responseInterceptors: [],
                    requestInterceptors: []
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
                expect(entity().data.title).toBe('test');
                expect(entity().data.body).toBe('Hello, I am a test');
                expect(entity().data['published_at']).toBe('2015-01-03');

                entity().data.body = 'Overriden';
                entity().data['published_at'] = '2015-01-06';
                entity.save();
            });

            expect(http.get).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                params: {},
                headers: {},
                responseInterceptors: []
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
                    responseInterceptors: [],
                    requestInterceptors: []
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
                    responseInterceptors: [],
                    requestInterceptors: []
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
                expect(entity().data.title).toBe('test');
                expect(entity().data.body).toBe('Hello, I am a test');

                entity.remove()
            });

            expect(http.get).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                params: {},
                headers: {},
                responseInterceptors: []
            });

            expect(http.delete).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                headers: {},
                responseInterceptors: []
            });

            http.delete.reset();

            comment.get().then(function(entity) {
                // As we use a promesse mock, this is always called synchronously
                entity.remove({ foo: 'bar' });
            });

            expect(http.delete).toHaveBeenCalledWith('https://localhost:3000/v1/articles/3/comments/5', {
                headers: { foo: 'bar' },
                responseInterceptors: []
            });
        });

        it('should call http.get with correct parameters when get is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'get').andCallThrough();

            comments.get(1, { page: 1 }, { foo: 'bar' }).then(function(entity) {
                // As we use a promesse mock, this is always called synchronously
                expect(entity().data.id).toBe(1);
                expect(entity().data.title).toBe('test');
                expect(entity().data.body).toBe('Hello, I am a test');
            });

            expect(http.get).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/1',
                {
                    params: { page: 1 },
                    headers: { foo: 'bar' },
                    responseInterceptors: []
                }
            );
        });

        it('should call http.get with correct parameters when getAll is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'get').andCallThrough();

            comments.getAll({ page: 1 }, { foo: 'bar' }).then(function(entities) {
                // As we use a promesse mock, this is always called synchronously
                expect(entities[0]().data.id).toBe(1);
                expect(entities[0]().data.title).toBe('test');
                expect(entities[0]().data.body).toBe('Hello, I am a test');

                expect(entities[1]().data.id).toBe(2);
                expect(entities[1]().data.title).toBe('test2');
                expect(entities[1]().data.body).toBe('Hello, I am a test2');
            });

            expect(http.get).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments',
                {
                    params: { page: 1 },
                    headers: { foo: 'bar' },
                    responseInterceptors: []
                }
            );
        });

        it('should call http.post with correct parameters when post is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'post').andCallThrough();

            comments.post({ body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
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
                    responseInterceptors: [],
                    requestInterceptors: []
                }
            );
        });

        it('should call http.put with correct parameters when put is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'put').andCallThrough();

            comments.put(2, { body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
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
                    responseInterceptors: [],
                    requestInterceptors: []
                }
            );
        });

        it('should call http.delete with correct parameters when delete is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'delete').andCallThrough();

            comments.delete(2, { foo: 'bar' }).then(function(response) {
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
                    responseInterceptors: []
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
                responseInterceptors: []
            });
        });

        it('should call http.patch with correct parameters when patch is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(http, 'patch').andCallThrough();

            comments.patch(2, { body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
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
                    responseInterceptors: [],
                    requestInterceptors: []
                }
            );
        });

        it('should merge global headers with headers argument', function() {
            resource
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
                    responseInterceptors: []
                }
            );

            http.get.reset();

            comments.get(2, null, { foo2: 'bar' });

            expect(http.get).toHaveBeenCalledWith(
                'https://localhost:3000/v1/articles/3/comments/2',
                {
                    params: {},
                    headers: { foo2: 'bar' },
                    responseInterceptors: []
                }
            );

            comments()
                .headers({ foo3: 'bar3' })
                .responseInterceptors().push(function(res) {
                    res.title = 'Intercepted :)';

                    return res;
                });

            comments.get(1).then(function(comment) {
                expect(comment().data.title).toBe('Intercepted :)');

                // test inheritance pattern
                resource.one('articles', 1).get().then(function(article) {
                    expect(article().data.title).toBe('test');
                });

                http.get.reset();

                comment.one('authors', 1).get();

                expect(http.get).toHaveBeenCalledWith(
                    'https://localhost:3000/v1/articles/3/comments/1/authors/1',
                    {
                        params: {},
                        headers: { foo3: 'bar3' },
                        responseInterceptors: [jasmine.any(Function)]
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

            resource().responseInterceptors().push(interceptor1);

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
                        responseInterceptors: [interceptor1]
                    }
                });

                var transformedData = getArgs.config.responseInterceptors[0](JSON.stringify({
                    id: 1,
                    title: 'test',
                    body: 'Hello, I am a test',
                    published_at: '2015-01-03'
                }));

                expect(interceptor1).toHaveBeenCalledWith(JSON.stringify({
                    id: 1,
                    title: 'test',
                    body: 'Hello, I am a test',
                    published_at: '2015-01-03'
                }));

                expect(transformedData.title).toBe('Intercepted');
            });
        });
    });
})();
