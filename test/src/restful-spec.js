/*global spyOn */

import restful from 'restful';


describe('restful', () => {
    let httpBackend;
    let http;
    let resource;

    beforeEach(() => {
        httpBackend = {
            get: (config) => {
                if (config.url.substr(config.url.length - 1) !== 's') {
                    return Promise.resolve({
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
                    return Promise.resolve({
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

            'custom-get': function(config) {
                return this.get(config);
            },

            put: (config) => {
                return Promise.resolve({
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

            delete: (config) => {
                return Promise.resolve({
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

            post: (config) => {
                return Promise.resolve({
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

            patch: (config) => {
                return Promise.resolve({
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

            head: (config) => {
                return Promise.resolve({
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

        resource()._http(resource()._http().setBackend( (config) => {
            return httpBackend[config.method](config);
        }));
    });

    it('should provide a configured resource', () => {
        expect(resource.baseUrl()).toBe('localhost');
        expect(resource.port()).toBe(3000);
        expect(resource.prefixUrl()).toBe('v1');
        expect(resource.protocol()).toBe('https');

        expect(resource.url()).toBe('https://localhost:3000/v1');
    });

    it('should provide a configured collection when resource.all is called', () => {
        let articles = resource.all('articles');

        expect(articles.url()).toBe('https://localhost:3000/v1/articles');
        expect(articles()._parent()).toBe(resource());
    });

    it('should provide a configured collection/member when calls are chained', () => {
        let article = resource.one('articles', 3),
            comment = article.one('comments', 5);

        expect(comment.url()).toBe('https://localhost:3000/v1/articles/3/comments/5');
        expect(comment()._parent()).toBe(article());

        let comments = article.all('comments');

        expect(comments.url()).toBe('https://localhost:3000/v1/articles/3/comments');
    });

    it('should call http.get with correct parameters when get is called on a member', (done) => {
        let article = resource.one('articles', 3),
            comment = article.one('comments', 5);

        spyOn(httpBackend, 'get').and.callThrough();

        comment.get()
            .then((response) => {
                let entity = response.body();

                expect(entity.data().title).toBe('test');
                expect(entity.data().body).toBe('Hello, I am a test');
                expect(httpBackend.get).toHaveBeenCalledWith({
                    method: 'get',
                    url: 'https://localhost:3000/v1/articles/3/comments/5',
                    params: null,
                    headers: {},
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });

                httpBackend.get.calls.reset();

                return comment.get({ test: 'test3' }, { bar: 'foo' });
            })
            .then((response) => {
                let entity = response.body();

                expect(entity.data().title).toBe('test');
                expect(entity.data().body).toBe('Hello, I am a test');

                expect(httpBackend.get).toHaveBeenCalledWith({
                    method: 'get',
                    url: 'https://localhost:3000/v1/articles/3/comments/5',
                    params: { test: 'test3' },
                    headers: { bar: 'foo' },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call http.put with correct parameters when put is called on member', (done) => {
        let article = resource.one('articles', 3),
            comment = article.one('comments', 2);

        spyOn(httpBackend, 'put').and.callThrough();

        comment.put({ body: 'I am a new comment' })
            .then((response) => {
                expect(response()).toEqual({
                    data: {
                        result: 2
                    },
                    status: 200,
                    headers: {},
                    config: {}
                });

                expect(httpBackend.put).toHaveBeenCalledWith({
                    method: 'put',
                    url: 'https://localhost:3000/v1/articles/3/comments/2',
                    params: null,
                    data: {
                        body: 'I am a new comment'
                    },
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call http.delete with correct parameters when delete is called on member', (done) => {
        let article = resource.one('articles', 3),
            comment = article.one('comments', 2);

        spyOn(httpBackend, 'delete').and.callThrough();

        comment.delete(null, { foo: 'bar' })
            .then((response) => {
                expect(response()).toEqual({
                    data: {
                        result: 1
                    },
                    status: 200,
                    headers: {},
                    config: {}
                });

                expect(httpBackend.delete).toHaveBeenCalledWith({
                    method: 'delete',
                    url: 'https://localhost:3000/v1/articles/3/comments/2',
                    params: null,
                    headers: { foo: 'bar' },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call http.head with correct parameters when head is called on a member', (done) => {
        let article = resource.one('articles', 3),
            comment = article.one('comments', 5);

        spyOn(httpBackend, 'head').and.callThrough();

        comment.head({ bar: 'foo' })
            .then((response) => {

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

                expect(httpBackend.head).toHaveBeenCalledWith({
                    method: 'head',
                    url: 'https://localhost:3000/v1/articles/3/comments/5',
                    params: null,
                    headers: { bar: 'foo' },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call http.patch with correct parameters when patch is called on member', (done) => {
        let article = resource.one('articles', 3),
            comment = article.one('comments', 2);

        spyOn(httpBackend, 'patch').and.callThrough();

        comment.patch({ body: 'I am a new comment' }, { foo: 'bar' })
            .then((response) => {

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

                expect(httpBackend.patch).toHaveBeenCalledWith({
                    method: 'patch',
                    url: 'https://localhost:3000/v1/articles/3/comments/2',
                    params: null,
                    data: {
                        body: 'I am a new comment'
                    },
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        foo: 'bar'
                    },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call http.put with correct parameters when save is called on an entity', (done) => {
        let articles = resource.one('articles', 3),
            comment = articles.one('comments', 5);

        spyOn(httpBackend, 'get').and.callThrough();
        spyOn(httpBackend, 'put').and.callThrough();

        comment.get()
            .then((response) => {
                let entity = response.body();


                expect(entity.data().title).toBe('test');
                expect(entity.data().body).toBe('Hello, I am a test');
                expect(entity.data().published_at).toBe('2015-01-03');

                entity.data().body = 'Overriden';
                entity.data().published_at = '2015-01-06';

                entity.save();

                expect(httpBackend.get).toHaveBeenCalledWith({
                    method: 'get',
                    url: 'https://localhost:3000/v1/articles/3/comments/5',
                    params: null,
                    headers: {},
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });

                expect(httpBackend.put).toHaveBeenCalledWith({
                    method: 'put',
                    url: 'https://localhost:3000/v1/articles/3/comments/5',
                    params: null,
                    data: {
                        id: 1,
                        title: 'test',
                        body: 'Overriden',
                        published_at: '2015-01-06'
                    },
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                });

                httpBackend.put.calls.reset();

                return comment.get();
            })
            .then((response) => {
                let entity = response.body();


                entity.save({ foo: 'bar' });

                expect(httpBackend.put).toHaveBeenCalledWith({
                    method: 'put',
                    url: 'https://localhost:3000/v1/articles/3/comments/5',
                    params: null,
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
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call http.delete with correct parameters when remove is called on an entity', (done) => {
        let article = resource.one('articles', 3);
        let comment = article.one('comments', 5);

        spyOn(httpBackend, 'get').and.callThrough();
        spyOn(httpBackend, 'delete').and.callThrough();

        comment.get()
            .then((response) => {
                let entity = response.body();


                expect(entity.data().title).toBe('test');
                expect(entity.data().body).toBe('Hello, I am a test');

                entity.remove();

                expect(httpBackend.get).toHaveBeenCalledWith({
                    method: 'get',
                    url: 'https://localhost:3000/v1/articles/3/comments/5',
                    params: null,
                    headers: {},
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });

                expect(httpBackend.delete).toHaveBeenCalledWith({
                    method: 'delete',
                    url: 'https://localhost:3000/v1/articles/3/comments/5',
                    params: null,
                    headers: {},
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });

                httpBackend.delete.calls.reset();
                return comment.get();
            })
            .then((response) => {
                let entity = response.body();


                entity.remove({ foo: 'bar' });

                expect(httpBackend.delete).toHaveBeenCalledWith({
                    method: 'delete',
                    url: 'https://localhost:3000/v1/articles/3/comments/5',
                    params: null,
                    headers: { foo: 'bar' },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call http.get with correct parameters when get is called on collection', (done) => {
        let article = resource.one('articles', 3),
            comments = article.all('comments');

        spyOn(httpBackend, 'get').and.callThrough();

        comments.get(1, { page: 1 }, { foo: 'bar' })
            .then((response) => {
                let entity = response.body();


                expect(entity.data().id).toBe(1);
                expect(entity.data().title).toBe('test');
                expect(entity.data().body).toBe('Hello, I am a test');

                expect(httpBackend.get).toHaveBeenCalledWith({
                    method: 'get',
                    url: 'https://localhost:3000/v1/articles/3/comments/1',
                    params: { page: 1 },
                    headers: { foo: 'bar' },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call http.get with correct parameters when getAll is called on collection', (done) => {
        let article = resource.one('articles', 3),
            comments = article.all('comments');

        spyOn(httpBackend, 'get').and.callThrough();

        comments.getAll({ page: 1 }, { foo: 'bar' })
            .then((response) => {
                let entities = response.body();

                expect(entities[0].data().id).toBe(1);
                expect(entities[0].data().title).toBe('test');
                expect(entities[0].data().body).toBe('Hello, I am a test');

                expect(entities[1].data().id).toBe(2);
                expect(entities[1].data().title).toBe('test2');
                expect(entities[1].data().body).toBe('Hello, I am a test2');

                expect(httpBackend.get).toHaveBeenCalledWith({
                    method: 'get',
                    url: 'https://localhost:3000/v1/articles/3/comments',
                    params: { page: 1 },
                    headers: { foo: 'bar' },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call http.post with correct parameters when post is called on collection', (done) => {
        let article = resource.one('articles', 3),
            comments = article.all('comments');

        spyOn(httpBackend, 'post').and.callThrough();

        comments.post({ body: 'I am a new comment' }, { foo: 'bar' })
            .then((response) => {
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

                expect(httpBackend.post).toHaveBeenCalledWith({
                    method: 'post',
                    url: 'https://localhost:3000/v1/articles/3/comments',
                    params: null,
                    data: {
                        body: 'I am a new comment'
                    },
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        foo: 'bar'
                    },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call http.put with correct parameters when put is called on collection', (done) => {
        let article = resource.one('articles', 3),
            comments = article.all('comments');

        spyOn(httpBackend, 'put').and.callThrough();

        comments.put(2, { body: 'I am a new comment' }, { foo: 'bar' })
            .then((response) => {
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

                expect(httpBackend.put).toHaveBeenCalledWith({
                    method: 'put',
                    url: 'https://localhost:3000/v1/articles/3/comments/2',
                    params: null,
                    data: {
                        body: 'I am a new comment'
                    },
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        foo: 'bar'
                    },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                });
        })
        .then(done);
    });

    it('should call http.delete with correct parameters when delete is called on collection', (done) => {
        let article = resource.one('articles', 3),
            comments = article.all('comments');

        spyOn(httpBackend, 'delete').and.callThrough();

        comments.delete(2, null, { foo: 'bar' })
            .then((response) => {
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

                expect(httpBackend.delete).toHaveBeenCalledWith({
                    method: 'delete',
                    url: 'https://localhost:3000/v1/articles/3/comments/2',
                    params: null,
                    headers: { foo: 'bar' },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call http.head with correct parameters when head is called on a collection', (done) => {
        let article = resource.one('articles', 3),
            comments = article.all('comments');

        spyOn(httpBackend, 'head').and.callThrough();

        comments.head(5, { bar: 'foo' })
            .then((response) => {
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

                expect(httpBackend.head).toHaveBeenCalledWith({
                    method: 'head',
                    url: 'https://localhost:3000/v1/articles/3/comments/5',
                    params: null,
                    headers: { bar: 'foo' },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call http.patch with correct parameters when patch is called on collection', (done) => {
        let article = resource.one('articles', 3),
            comments = article.all('comments');

        spyOn(httpBackend, 'patch').and.callThrough();

        comments.patch(2, { body: 'I am a new comment' }, { foo: 'bar' })
            .then((response) => {
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

                expect(httpBackend.patch).toHaveBeenCalledWith({
                    method: 'patch',
                    url: 'https://localhost:3000/v1/articles/3/comments/2',
                    params: null,
                    data: {
                        body: 'I am a new comment'
                    },
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        foo: 'bar'
                    },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)],
                    transformRequest: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should merge global headers with headers argument', (done) => {
        let article = resource.one('articles', 3),
            comments = article.all('comments');

        // we define headers after calling one and all to ensure the propagation of configuration
        resource.header('foo2', 'bar2');

        spyOn(httpBackend, 'get').and.callThrough();

        comments.get(2, null, { foo: 'bar' })
            .then(() => {
                expect(httpBackend.get).toHaveBeenCalledWith({
                    method: 'get',
                    url: 'https://localhost:3000/v1/articles/3/comments/2',
                    params: null,
                    headers: { foo2: 'bar2', foo: 'bar' },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });

                httpBackend.get.calls.reset();

                return comments.get(2, null, { foo2: 'bar' });
            })
            .then(() => {
                expect(httpBackend.get).toHaveBeenCalledWith({
                    method: 'get',
                    url: 'https://localhost:3000/v1/articles/3/comments/2',
                    params: null,
                    headers: { foo2: 'bar' },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });

                comments
                    .header('foo3', 'bar3')
                    .addResponseInterceptor((res) => {
                        res.title = 'Intercepted :)';

                        return res;
                    });

                return comments.get(1);
            })
            .then((response) => {
                let comment = response.body();

                expect(comment.data().title).toBe('Intercepted :)');

                // test inheritance pattern
                resource.one('articles', 1).get().then((response) => {
                    let article = response.body();

                    expect(article.data().title).toBe('test');
                });

                httpBackend.get.calls.reset();

                return comment.one('authors', 1).get();
            })
            .then(() => {
                expect(httpBackend.get).toHaveBeenCalledWith({
                    method: 'get',
                    url: 'https://localhost:3000/v1/articles/3/comments/1/authors/1',
                    params: null,
                    headers: { foo3: 'bar3', foo2: 'bar2' },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call response interceptors on get response', (done) => {
        let interceptor1 = jasmine.createSpy('interceptor1').and.returnValue({
            id: 1,
            title: 'Intercepted',
            body: 'Hello, I am a test',
            published_at: '2015-01-03'
        });

        resource.addResponseInterceptor(interceptor1);

        spyOn(httpBackend, 'get').and.returnValue(Promise.resolve({
            status: 200,
            data: {
                id: 1,
                title: 'test',
                body: 'Hello, I am a test',
                published_at: '2015-01-03',
            },
        }));

        resource.one('articles', 1).get()
            .then((response) => {
                let article = response.body();

                expect(httpBackend.get).toHaveBeenCalledWith({
                    method: 'get',
                    url: 'https://localhost:3000/v1/articles/1',
                    params : null,
                    headers: {},
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)],
                });

                let transformedData = httpBackend.get.calls.argsFor(0)[0].transformResponse[0](JSON.stringify({
                    id: 1,
                    title: 'test',
                    body: 'Hello, I am a test',
                    published_at: '2015-01-03'
                }));

                expect(interceptor1).toHaveBeenCalledWith(
                    {
                        id: 1,
                        title: 'test',
                        body: 'Hello, I am a test',
                        published_at: '2015-01-03'
                    },
                    undefined,
                    'get',
                    'https://localhost:3000/v1/articles/1'
                );
                expect(transformedData.title).toBe('Intercepted');
            })
            .then(done)
            .catch((e) => fail(e.message || e()));
    });

    it('should correctly chain callback in restful object', () => {
        expect(resource.header('foo', 'bar')).toBe(resource);
        expect(resource.header('foo', 'bar').prefixUrl('v1')).toBe(resource);

        let articlesCollection = resource.header('foo', 'bar').prefixUrl('v1').all('articles');

        expect(articlesCollection.header('foo1', 'bar1')).toBe(articlesCollection);

        expect(articlesCollection.header('foo2', 'bar2')
            .addResponseInterceptor(jasmine.createSpy('interceptor'))).toBe(articlesCollection);

        let commentsMember = resource.one('articles', 2).one('comments', 1);

        expect(commentsMember.header('foo3', 'bar3')).toBe(commentsMember);

        expect(commentsMember.header('foo4', 'bar4')
            .addResponseInterceptor(jasmine.createSpy('interceptor'))).toBe(commentsMember);
    });

    it('should allow custom url in restful object', () => {
        let article = resource.oneUrl('articles', 'http://custom.url/article/1');

        expect(article.url()).toBe('http://custom.url/article/1');

        let articles = resource.allUrl('articles', 'http://custom.url/articles');

        expect(articles.url()).toBe('http://custom.url/articles');

        let comment = article.one('comment', 1);

        expect(comment.url()).toBe('http://custom.url/article/1/comment/1');

        let post = comment.oneUrl('comment', 'http://custom.url/post?article=1&comment=1');

        expect(post.url()).toBe('http://custom.url/post?article=1&comment=1');
    });

    it('should call http.get with correct url when get is called on collection', (done) => {
        let article = resource.one('articles', 3),
            comments = article.allUrl('comments', 'http://custom.url/comment');

        spyOn(httpBackend, 'get').and.callThrough();

        comments.get(1, { page: 1 }, { foo: 'bar' })
            .then((response) => {
                let entity = response.body();

                expect(entity.data().id).toBe(1);
                expect(entity.data().title).toBe('test');
                expect(entity.data().body).toBe('Hello, I am a test');

                expect(httpBackend.get).toHaveBeenCalledWith({
                    method: 'get',
                    url: 'http://custom.url/comment/1',
                    params: { page: 1 },
                    headers: { foo: 'bar' },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call full request interceptors on collection getAll request', (done) => {
        resource.addFullRequestInterceptor( (params, headers, data, method) => {
            params._end = params.page * 20;
            params._start = params._end - 20;
            delete params.page;

            headers.custom = 'mine';

            return {
                method: 'custom-get',
                params: params,
                headers: headers
            };
        });
        let articles = resource.all('articles');

        spyOn(httpBackend, 'get').and.callThrough();

        articles.getAll({ page: 1 }, { foo: 'bar' })
            .then(() => {
                expect(httpBackend.get).toHaveBeenCalledWith({
                    method: 'custom-get',
                    url: 'https://localhost:3000/v1/articles',
                    params: { _start: 0, _end: 20 },
                    headers: { foo: 'bar', custom: 'mine' },
                    fullResponseInterceptors: [],
                    transformResponse: [jasmine.any(Function)]
                });
            })
            .then(done);

    });

    it('should call full response interceptors on collection getAll response', (done) => {
        let interceptor =  (data, headers) => {
            headers['X-FROM'] = 'my_interceptor';

            data[0].title = 'Intercepted :)';

            return {
                data: data,
                headers: headers
            };
        };
        resource.addFullResponseInterceptor(interceptor);
        let articles = resource.all('articles');

        spyOn(httpBackend, 'get').and.callThrough();

        articles.getAll({ page: 1 }, { foo: 'bar' })
            .then((response) => {
                let entities = response.body();

                expect(entities[0].data().body).toBe('Hello, I am a test');
                expect(entities[0].data().title).toBe('Intercepted :)');
                expect(entities[1].data().body).toBe('Hello, I am a test2');

                expect(response.headers()['X-FROM']).toBe('my_interceptor');

                expect(httpBackend.get).toHaveBeenCalledWith({
                    method: 'get',
                    url: 'https://localhost:3000/v1/articles',
                    params: { page: 1 },
                    headers: { foo: 'bar' },
                    fullResponseInterceptors: [interceptor],
                    transformResponse: [jasmine.any(Function)]
                });
            })
            .then(done);
    });

    it('should call delete not only with header but even with data when deleting one entity', function() {
        var articles = resource.oneUrl('articles', 'https://localhost:3000/v1/articles');
        spyOn(httpBackend, 'delete').and.callThrough();

        articles.delete([1,2]);

        expect(httpBackend.delete).toHaveBeenCalledWith({
            method: 'delete',
            url: 'https://localhost:3000/v1/articles',
            params: null,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            data: [1,2],
            requestInterceptors: [],
            fullResponseInterceptors: [],
            transformResponse: [jasmine.any(Function)]
        });
    });

    it('should call delete not only with header but even with data when deleting a collection entity', function() {
        var articles = resource.allUrl('articles', 'https://localhost:3000/v1/articles');
        spyOn(httpBackend, 'delete').and.callThrough();

        articles.delete(1, { key: 'value' });

        expect(httpBackend.delete).toHaveBeenCalledWith({
            method: 'delete',
            url: 'https://localhost:3000/v1/articles/1',
            params: null,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            data: { key: 'value' },
            requestInterceptors: [],
            fullResponseInterceptors: [],
            transformResponse: [jasmine.any(Function)]
        });
    });
});
