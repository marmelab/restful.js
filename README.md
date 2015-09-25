# restful.js [![Build Status](https://travis-ci.org/marmelab/restful.js.svg?branch=master)](https://travis-ci.org/marmelab/restful.js)

A pure JS client for interacting with server-side RESTful resources. Think Restangular without Angular.

## Installation

It is available with bower or npm:

```
bower install restful.js
npm install restful.js
```

Include `restful.min.js` to the HTML, and the `restful` object is now available in the global scope:

Standalone version:
```html
<script type="text/javascript" src="/path/to/bower_components/restful.js/dist/restful.min.js"></script>
```

Pre built with fetch version:
```html
<script type="text/javascript" src="/path/to/bower_components/restful.js/dist/restful.fetch.min.js"></script>
```

Alternately, you can use a module loader like [webpack](http://webpack.github.io/).

```js
import restful from 'restful.js';
```

## Usage

### Create a resource targeting your API

Restful.js needs an http backend in order to perform queries. Two http backend are currently available:
* [fetch](https://github.com/github/fetch): For using restful.js in a browser.
* [request](https://github.com/request/request): For using restful.js in a browser.

There are defined as optional dependencies and therefore you must install them with npm if you need them.

Start by defining the base endpoint for an API, for instance `http://api.example.com` with the good http backend.

For a browser build :
```js
import whatwg-fetch;
import restful, { fetchBackend } from 'restful.js';

const api = restful('http://api.example.com', fetchBackend(fetch));
```

For a node build :
```js
import request from 'request';
import restful, { requestBackend } from 'restful.js';

const api = restful('http://api.example.com', requestBackend(request));
```

For those who prefers a ready-to-go version, pre built version of restful.js with fetch are available into the `dist` folder.

### Collections and Members endpoints

A *collection* is an API endpoint for a list of entities, for instance `http://api.example.com/articles`. Create it using the `all(name)` syntax:

```js
var articlesCollection = api.all('articles');  // http://api.example.com/articles
```

`articlesCollection` is just the description of the collection, the API wasn't fetched yet.

A *member* is an API endpoint for a single entity, for instance `http://api.example.com/articles/1`. Create it using the `one(name, id)` syntax:

```js
var articleMember = api.one('articles', 1);  // http://api.example.com/articles/1
```

Just like above, `articleMember` is a description, not an entity.

You can chain `one()` and `all()` to target the required collection or member:

```js
var articleMember = api.one('articles', 1);  // http://api.example.com/articles/1
var commentsCollection = articleMember.all('comments');  // http://api.example.com/articles/1/comments
```

#### Custom endpoint URL

In case you need to set a custom endpoint URL, you can use `custom` methods.

```js
const articleCustom = api.custom('articles/beta');  // http://api.example.com/articles/beta

// you can add an absolute url
const articleCustom = api.custom('http://custom.url/articles/beta', false);  // http://custom.url/articles/beta
```

A custom endpoint acts like a member, and therefore you can use `one` and `all` to chain other endpoint with it.

#### Entities

Once you have collections and members endpoints, fetch them to get *entities*. Restful.js exposes `get()` and `getAll()` methods for fetching endpoints. Since these methods are asynchronous, they return a native Promise for response.

If your application does not support native Promise, you can use a [polyfill](https://github.com/jakearchibald/es6-promise).

```js
var articleMember = api.one('articles', 1);  // http://api.example.com/articles/1
articleMember.get().then(function(response) {
    var articleEntity = response.body();

    var article = articleEntity.data();
    console.log(article.title); // hello, world!
});

var commentsCollection = articleMember.all('comments');  // http://api.example.com/articles/1/comments
commentsCollection.getAll().then(function(response) {
    var commentEntities = response.body();

    commentEntities.forEach(function(commentEntity) {
        var comment = commentEntity.data();
        console.log(comment.body);
    })
});
```

*Tip*: You can describe a member based on a collection *and* trigger the API fetch at the same time by calling `get(id)`:

```js
// fetch http://api.example.com/articles/1/comments/4
var articleMember = api.one('articles', 1);
var commentMember = articleMember.one('comments', 4);
commentMember.get().then(function(response) {
    //
});
// equivalent to
var commentsCollection = articleMember.all('comments');
commentsCollection.get(4).then(function(response) {
    //
});
```

### Response
A response is made from the HTTP response fetched from the endpoint. It exposes `statusCode()`, `headers()`, and `body()` methods. For a `GET` request, the `body` method will return one or a an array of entities. Therefore you can disable this hydration by calling `body(false)`.

### Entity Data

An entity is made from the HTTP response data fetched from the endpoint. It exposes a `data()` method:

```js
var articleCollection = api.all('articles');  // http://api.example.com/articles

// http://api.example.com/articles/1
api.one('articles', 1).get().then(function(response) {
    var articleEntity = response.body();

    // if the server response was { id: 1, title: 'test', body: 'hello' }
    var article = articleEntity.data();
    article.title; // returns `test`
    article.body; // returns `hello`
    // You can also edit it
    article.title = 'test2';
    // Finally you can easily update it or delete it
    articleEntity.save(); // will perform a PUT request
    articleEntity.delete(); // will perform a DELETE request
}, function(response) {
    // The reponse code is not >= 200 and < 400
    throw new Error('Invalid response');
});
```

You can also use the entity to continue exploring the API. Entities expose several other methods to chain calls:

* `entity.one(name, id)`: Query a member child of the entity.
* `entity.all(name)`: Query a collection child of the entity.
* `entity.url()`: Get the entity url.
* `entity.save()`: Save the entity modifications by performing a POST request.
* `entity.delete()`: Remove the entity by performing a DELETE request.
* `entity.id()`: Get the id of the entity.

```js
var articleMember = api.one('articles', 1);  // http://api.example.com/articles/1
var commentMember = articleMember.one('comments', 3);  // http://api.example.com/articles/1/comments/3
commentMember.get()
    .then(function(response) {
        var commentEntity = response.body();

        // You can also call `all` and `one` on an entity
        return comment.all('authors').getAll(); // http://api.example.com/articles/1/comments/3/authors
    }).then(function(response) {
        var authorEntities = response.body();

        authorEntities.forEach(function(authorEntity) {
            var author = authorEntity.data();
            console.log(author.name);
        });
    });
```

`entity.id()` will get the id from its data regarding of the `identifier` of its endpoint. If you are using another name than `id` you can modify it by calling `identifier()` on the endpoint.

```js
const articleCollection = api.all('articles');  // http://api.example.com/articles
articleCollection.identifier('_id'); // We use _id as id field

const articleMember = api.one('articles', 1);  // http://api.example.com/articles/1
articleMember.identifier('_id'); // We use _id as id field
```

Restful.js uses an inheritance pattern when collections or members are chained. That means that when you configure a collection or a member, it will configure all the collection an members chained afterwards.

```js
// configure the api
api.header('AuthToken', 'test');
api.identifier('_id');

var articlesCollection = api.all('articles');
articlesCollection.get(1); // will send the `AuthToken` header
// You can configure articlesCollection, too
articlesCollection.header('foo', 'bar');
articlesCollection.one('comments', 1).get(); // will send both the AuthToken and foo headers
```

## API Reference

Restful.js exposes similar methods on collections, members and entities. The name are consistent, and the arguments depend on the context.

### Collection methods

* `addErrorInterceptor ( interceptor )`: Add an error interceptor. You can alter the whole error.
* `addRequestInterceptor ( interceptor )`: Add a request interceptor. You can alter the whole request.
* `addResponseInterceptor ( interceptor )`: Add a response interceptor. You can alter the whole response.
* `custom ( name [, isRelative = true ] )`: Target a child member with a custom url.
* `delete ( id, [, data, [, params [, headers ]]] )`: Delete a member in a collection. Returns a promise with the response.
* `getAll ( [ params [, headers ]] )`: Get a full collection. Returns a promise with an array of entities.
* `get ( id, [, params [, headers ]] )`: Get a member in a collection. Returns a promise with an entity.
* `head ( id, [, params [, headers ]] )`: Perform a HEAD request on a member in a collection. Returns a promise with the response.
* `header ( name, value )`: Add a header.
* `headers ()`: Get all headers added to the collection.
* `on (event, listener)`: Add an event listener on the collection.
* `once (event, listener)`: Add an event listener on the collection which will be triggered only once.
* `patch ( id, [, data, [, params [, headers ]]] )`: Patch a member in a collection. Returns a promise with the response.
* `post ( [, data, [, params [, headers ]]] )`: Create a member in a collection. Returns a promise with the response.
* `put ( id, [, data, [, params [, headers ]]] )`: Update a member in a collection. Returns a promise with the response.
* `url ()`: Get the collection url.

```js
// http://api.example.com/articles/1/comments/2/authors
const authorsCollection = api.one('articles', 1).one('comments', 2).all('authors');
authorsCollection.getAll().then(function(authorEntities) { /*  */ });
authorsCollection.get(1).then(function(authorEntity) { /*  */ });
```

### Member methods

* `addErrorInterceptor ( interceptor )`: Add an error interceptor. You can alter the whole error.
* `addRequestInterceptor ( interceptor )`: Add a request interceptor. You can alter the whole request.
* `addResponseInterceptor ( interceptor )`: Add a response interceptor. You can alter the whole response.
* `all ( name )`: Target a child collection `name`.
* `custom ( name [, isRelative = true ] )`: Target a child member with a custom url.
* `delete ( [, data, [, params [, headers ]]] )`: Delete a member. Returns a promise with the response.
* `get ( [, params [, headers ]] )`: Get a member. Returns a promise with an entity.
* `head ( [, params [, headers ]] )`: Perform a HEAD request on a member. Returns a promise with the response.
* `header ( name, value )`: Add a header.
* `headers ()`: Get all headers added to the member.
* `on (event, listener)`: Add an event listener on the member.
* `once (event, listener)`: Add an event listener on the member which will be triggered only once.
* `one ( name, id )`: Target a child member in a collection `name`.
* `patch ( [, data, [, params [, headers ]]] )`: Patch a member. Returns a promise with the response.
* `post ( [, data, [, params [, headers ]]] )`: Create a member. Returns a promise with the response.
* `put ( [, data, [, params [, headers ]]] )`: Update a member. Returns a promise with the response.
* `url ()`: Get the member url.

```js
// http://api.example.com/articles/1/comments/2
const commentMember = api.one('articles', 1).one('comments', 2);
commentMember.get().then(function(commentEntity) { /*  */ });
commentMember.delete().then(function(data) { /* */ });
```

### Interceptors

An error, response or request interceptor is a callback which looks like this:

```js
resource.addRequestInterceptor(function(config) {
    const { data, headers, method, params, url } = config;
    // all args had been modified
    return {
        data,
        params,
        headers,
        method,
        url,
    };

    // just return modified arguments
    return {
        data,
        headers,
    };
});

resource.addResponseInterceptor(function(response, config) {
    const { data, headers, statusCode } = response;
    // all args had been modified
    return {
        data,
        headers,
        statusCode
    };

    // just return modified arguments
    return {
        data,
        headers,
    };
});

resource.addErrorInterceptor(function(error, config) {
    const { message, response } = error;
    // all args had been modified
    return {
        message,
        response,
    };

    // just return modified arguments
    return {
        message,
    };
});
```

### Response methods

* `body ()`: Get the HTTP body of the response. If it is a `GET` request, it will hydrate some entities. To get the raw body call it with `false` as argument.
* `headers ()`: Get the HTTP headers of the response.
* `statusCode ()`: Get the HTTP status code of the response.

### Entity methods

* `all ( name )`: Query a collection child of the entity.
* `custom ( name [, isRelative = true ] )`: Target a child member with a custom url.
* `data ()` : Get the JS object unserialized from the response body (which must be in JSON)
* `id ()`: Get the id of the entity.
* `one ( name, id )`: Query a member child of the entity.
* `delete ( [, data, [, params [, headers ]]] )`: Delete the member link to the entity. Returns a promise with the response.
* `save ( [, data, [, params [, headers ]]] )`: Update the member link to the entity. Returns a promise with the response.
* `url ()`: Get the entity url.

```js
// http://api.example.com/articles/1/comments/2
const commentMember = api.one('articles', 1).one('comments', 2);
commentMember.get().then(function(commentEntity) {
    commentEntity.save();
    commentEntity.remove();
});
```

### Error Handling

To deal with errors, you can either use error interceptors, error callbacks on promise or error events.

```js
const commentMember = resource.one('articles', 1).one('comments', 2);
commentMember
    .get()
    .then(function(commentEntity) { /*  */ })
    .catch(function(err) {
        // deal with the error
    });

commentMember.on('error', function(error, config) {
    // deal with the error
});
```

### Events

Any endpoint (collection or member) is an event emitter. It emits `request`, `response` and `error` events. When it emits an event, it is propagated to all its parents. This way you can listen to all errors, requests and response on your restful instance by listening on your root endpoint.

```js
api.on('error', function(error, config) {
    // deal with the error
});

api.on('request', function(config) {
    // deal with the request
});

api.on('response', function(config) {
    // deal with the response
});
```

You can also use `once` method to add a one shot event listener.

## Development

Install dependencies:

```sh
make install
```

### Build

To rebuild the minified JavaScript you must run: `make build`.

During development you can run `make watch` to trigger a build at each change.

### Production build

To build for production (minified files) you must run: `NODE_ENV=production make build`.

### Tests

```sh
make test
```

## Contributing

All contributions are welcome and must pass the tests. If you add a new feature, please write tests for it.

## License

This application is available under the [MIT License](https://github.com/marmelab/restful.js/blob/master/LICENSE), courtesy of [marmelab](http://marmelab.com).
