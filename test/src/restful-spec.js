/*global describe,it,expect,beforeEach,jasmine*/

(function() {
    'use strict';

    var httpBackend,
        http,
        resource;

    function q(result) {
        return new Promise(function(resolve, reject) {
            resolve(result);
        });
    };

    describe('restful', function() {
        beforeEach(function() {
            httpBackend = {
                get: function(config) {

                    if (config.url.substr(config.url.length - 1) !== 's') {
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

                put: function(config) {
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

                delete: function(config) {
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

                post: function(config) {
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

                patch: function(config) {
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

                head: function(config) {
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
                .protocol('https');

            http = {
                request: function(method, config) {
                    return httpBackend[method](config);
                }
            };

            resource()._http(http);
        });

        it('should provide a configured resource', function() {
            expect(resource.baseUrl()).toBe('localhost');
            expect(resource.port()).toBe(3000);
            expect(resource.prefixUrl()).toBe('v1');
            expect(resource.protocol()).toBe('https');
            expect(resource()()).toBe(http);

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

            spyOn(httpBackend, 'get').andCallThrough();

            comment.get().then(function(response) {
                var entity = response.body();

                // As we use a promesse mock, this is always called synchronously
                expect(entity.data().title).toBe('test');
                expect(entity.data().body).toBe('Hello, I am a test');
            });

            expect(httpBackend.get).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/5',
                params: {},
                headers: {},
                responseInterceptors: []
            });

            httpBackend.get.reset();

            comment.get({ test: 'test3' }, { bar: 'foo' }).then(function(response) {
                var entity = response.body();

                // As we use a promesse mock, this is always called synchronously
                expect(entity.data().title).toBe('test');
                expect(entity.data().body).toBe('Hello, I am a test');
            });

            expect(httpBackend.get).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/5',
                params: { test: 'test3' },
                headers: { bar: 'foo' },
                responseInterceptors: []
            });
        });

        it('should call http.put with correct parameters when put is called on member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 2);

            spyOn(httpBackend, 'put').andCallThrough();

            comment.put({ body: 'I am a new comment' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response()).toEqual({
                    data: {
                        result: 2
                    },
                    status: 200,
                    headers: {},
                    config: {}
                });
            });

            expect(httpBackend.put).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/2',
                params: {},
                data: {
                    body: 'I am a new comment'
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                responseInterceptors: [],
                requestInterceptors: []
            });
        });

        it('should call http.delete with correct parameters when delete is called on member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 2);

            spyOn(httpBackend, 'delete').andCallThrough();

            comment.delete({ foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response()).toEqual({
                    data: {
                        result: 1
                    },
                    status: 200,
                    headers: {},
                    config: {}
                });
            });

            expect(httpBackend.delete).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/2',
                params: {},
                headers: { foo: 'bar' },
                responseInterceptors: []
            });
        });

        it('should call http.head with correct parameters when head is called on a member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 5);

            spyOn(httpBackend, 'head').andCallThrough();

            comment.head({ bar: 'foo' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response()).toEqual({
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

            expect(httpBackend.head).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/5',
                params: {},
                headers: { bar: 'foo' },
                responseInterceptors: []
            });
        });

        it('should call http.patch with correct parameters when patch is called on member', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 2);

            spyOn(httpBackend, 'patch').andCallThrough();

            comment.patch({ body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response()).toEqual({
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

            expect(httpBackend.patch).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/2',
                params: {},
                data: {
                    body: 'I am a new comment'
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    foo: 'bar'
                },
                responseInterceptors: [],
                requestInterceptors: []
            });
        });

        it('should call http.put with correct parameters when save is called on an entity', function() {
            var articles = resource.one('articles', 3),
                comment = articles.one('comments', 5);

            spyOn(httpBackend, 'get').andCallThrough();
            spyOn(httpBackend, 'put').andCallThrough();

            comment.get().then(function(response) {
                var entity = response.body();

                // As we use a promesse mock, this is always called synchronously
                expect(entity.data().title).toBe('test');
                expect(entity.data().body).toBe('Hello, I am a test');
                expect(entity.data()['published_at']).toBe('2015-01-03');

                entity.data().body = 'Overriden';
                entity.data()['published_at'] = '2015-01-06';

                entity.save();
            });

            expect(httpBackend.get).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/5',
                params: {},
                headers: {},
                responseInterceptors: []
            });

            expect(httpBackend.put).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/5',
                params: {},
                data: {
                    id: 1,
                    title: 'test',
                    body: 'Overriden',
                    published_at: '2015-01-06'
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                responseInterceptors: [],
                requestInterceptors: []
            });

            httpBackend.put.reset();

            comment.get().then(function(response) {
                var entity = response.body();

                // As we use a promesse mock, this is always called synchronously
                entity.save({ foo: 'bar' });
            });

            expect(httpBackend.put).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/5',
                params: {},
                data: {
                    id: 1,
                    title: 'test',
                    body: 'Hello, I am a test',
                    published_at: '2015-01-03'
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    foo: 'bar'
                },
                responseInterceptors: [],
                requestInterceptors: []
            });
        });

        it('should call http.delete with correct parameters when remove is called on an entity', function() {
            var article = resource.one('articles', 3),
                comment = article.one('comments', 5);

            spyOn(httpBackend, 'get').andCallThrough();
            spyOn(httpBackend, 'delete').andCallThrough();

            comment.get().then(function(response) {
                var entity = response.body();

                // As we use a promesse mock, this is always called synchronously
                expect(entity.data().title).toBe('test');
                expect(entity.data().body).toBe('Hello, I am a test');

                entity.remove()
            });

            expect(httpBackend.get).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/5',
                params: {},
                headers: {},
                responseInterceptors: []
            });

            expect(httpBackend.delete).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/5',
                params: {},
                headers: {},
                responseInterceptors: []
            });

            httpBackend.delete.reset();

            comment.get().then(function(response) {
                var entity = response.body();

                // As we use a promesse mock, this is always called synchronously
                entity.remove({ foo: 'bar' });
            });

            expect(httpBackend.delete).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/5',
                params: {},
                headers: { foo: 'bar' },
                responseInterceptors: []
            });
        });

        it('should call http.get with correct parameters when get is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(httpBackend, 'get').andCallThrough();

            comments.get(1, { page: 1 }, { foo: 'bar' }).then(function(response) {
                var entity = response.body();

                // As we use a promesse mock, this is always called synchronously
                expect(entity.data().id).toBe(1);
                expect(entity.data().title).toBe('test');
                expect(entity.data().body).toBe('Hello, I am a test');
            });

            expect(httpBackend.get).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/1',
                params: { page: 1 },
                headers: { foo: 'bar' },
                responseInterceptors: []
            });
        });

        it('should call http.get with correct parameters when getAll is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(httpBackend, 'get').andCallThrough();

            comments.getAll({ page: 1 }, { foo: 'bar' }).then(function(response) {
                var entities = response.body();

                // As we use a promesse mock, this is always called synchronously
                expect(entities[0].data().id).toBe(1);
                expect(entities[0].data().title).toBe('test');
                expect(entities[0].data().body).toBe('Hello, I am a test');

                expect(entities[1].data().id).toBe(2);
                expect(entities[1].data().title).toBe('test2');
                expect(entities[1].data().body).toBe('Hello, I am a test2');
            });

            expect(httpBackend.get).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments',
                params: { page: 1 },
                headers: { foo: 'bar' },
                responseInterceptors: []
            });
        });

        it('should call http.post with correct parameters when post is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(httpBackend, 'post').andCallThrough();

            comments.post({ body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response()).toEqual({
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

            expect(httpBackend.post).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments',
                params: {},
                data: {
                    body: 'I am a new comment'
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    foo: 'bar'
                },
                responseInterceptors: [],
                requestInterceptors: []
            });
        });

        it('should call http.put with correct parameters when put is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(httpBackend, 'put').andCallThrough();

            comments.put(2, { body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response()).toEqual({
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

            expect(httpBackend.put).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/2',
                params: {},
                data: {
                    body: 'I am a new comment'
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    foo: 'bar'
                },
                responseInterceptors: [],
                requestInterceptors: []
            });
        });

        it('should call http.delete with correct parameters when delete is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(httpBackend, 'delete').andCallThrough();

            comments.delete(2, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response()).toEqual({
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

            expect(httpBackend.delete).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/2',
                params: {},
                headers: { foo: 'bar' },
                responseInterceptors: []
            });
        });

        it('should call http.head with correct parameters when head is called on a collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(httpBackend, 'head').andCallThrough();

            comments.head(5, { bar: 'foo' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response()).toEqual({
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

            expect(httpBackend.head).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/5',
                params: {},
                headers: { bar: 'foo' },
                responseInterceptors: []
            });
        });

        it('should call http.patch with correct parameters when patch is called on collection', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            spyOn(httpBackend, 'patch').andCallThrough();

            comments.patch(2, { body: 'I am a new comment' }, { foo: 'bar' }).then(function(response) {
                // As we use a promesse mock, this is always called synchronously
                expect(response()).toEqual({
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

            expect(httpBackend.patch).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/2',
                params: {},
                data: {
                    body: 'I am a new comment'
                },
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    foo: 'bar'
                },
                responseInterceptors: [],
                requestInterceptors: []
            });
        });

        it('should merge global headers with headers argument', function() {
            var article = resource.one('articles', 3),
                comments = article.all('comments');

            // we define headers after calling one and all to ensure the propagation of configuration
            resource.header('foo2', 'bar2');

            spyOn(httpBackend, 'get').andCallThrough();

            comments.get(2, null, { foo: 'bar' });

            expect(httpBackend.get).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/2',
                params: {},
                headers: { foo2: 'bar2', foo: 'bar' },
                responseInterceptors: []
            });

            httpBackend.get.reset();

            comments.get(2, null, { foo2: 'bar' });

            expect(httpBackend.get).toHaveBeenCalledWith({
                url: 'https://localhost:3000/v1/articles/3/comments/2',
                params: {},
                headers: { foo2: 'bar' },
                responseInterceptors: []
            });

            comments
                .header('foo3', 'bar3')
                .addResponseInterceptor(function(res) {
                    res.title = 'Intercepted :)';

                    return res;
                });

            comments.get(1).then(function(response) {
                var comment = response.body();

                expect(comment.data().title).toBe('Intercepted :)');

                // test inheritance pattern
                resource.one('articles', 1).get().then(function(response) {
                    var article = response.body();

                    expect(article.data().title).toBe('test');
                });

                httpBackend.get.reset();

                comment.one('authors', 1).get();

                expect(httpBackend.get).toHaveBeenCalledWith({
                    url: 'https://localhost:3000/v1/articles/3/comments/1/authors/1',
                    params: {},
                    headers: { foo3: 'bar3', foo2: 'bar2' },
                    responseInterceptors: [jasmine.any(Function)]
                });
            });
        });

        it('should call response interceptors on get response', function() {
            var interceptor1 = jasmine.createSpy('interceptor1').andReturn({
                id: 1,
                title: 'Intercepted',
                body: 'Hello, I am a test',
                published_at: '2015-01-03'
            });

            resource.addResponseInterceptor(interceptor1);

            var getArgs;

            spyOn(httpBackend, 'get').andCallFake(function(config) {
                getArgs = config;

                return q({
                    data: {
                        id: 1,
                        title: 'test',
                        body: 'Hello, I am a test',
                        published_at: '2015-01-03'
                    }
                });
            });

            resource.one('articles', 1).get().then(function(response) {
                var article = response.body();

                expect(getArgs).toEqual({
                    url: 'https://localhost:3000/v1/articles/1',
                    params : {},
                    headers: {},
                    responseInterceptors: [interceptor1]
                });

                var transformedData = getArgs.responseInterceptors[0](JSON.stringify({
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

        it('should correctly chain callback in restful object', function() {
            expect(resource.header('foo', 'bar')).toBe(resource);
            expect(resource.header('foo', 'bar').prefixUrl('v1')).toBe(resource);

            var articlesCollection = resource.header('foo', 'bar').prefixUrl('v1').all('articles');

            expect(articlesCollection.header('foo1', 'bar1')).toBe(articlesCollection);

            expect(articlesCollection.header('foo2', 'bar2')
                .addResponseInterceptor(jasmine.createSpy('interceptor'))).toBe(articlesCollection);

            var commentsMember = resource.one('articles', 2).one('comments', 1);

            expect(commentsMember.header('foo3', 'bar3')).toBe(commentsMember);

            expect(commentsMember.header('foo4', 'bar4')
                .addResponseInterceptor(jasmine.createSpy('interceptor'))).toBe(commentsMember);
        });
    });
})();
