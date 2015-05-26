# restful.js [![Build Status](https://travis-ci.org/marmelab/restful.js.svg?branch=master)](https://travis-ci.org/marmelab/restful.js)

A pure JS client for interacting with server-side RESTful resources. Think Restangular without Angular.

## Installation

It is available with bower or npm:

```
bower install restful.js
npm install restful.js
```

Include `restful.min.js` to the HTML, and the `restful` object is now available in the global scope:

```html
<script type="text/javascript" src="/path/to/bower_components/restful.js/dist/restful.min.js"></script>
```

Alternately, you can use [RequireJS](http://requirejs.org/) or [Browserify](http://browserify.org/) to avoid global scoping.

```js
var restful = require('restful.js');
```

## Usage

### Create a resource targeting your API

Start by defining the base endpoint for an API, for instance `http://api.example.com`.

```js
var api = restful('api.example.com');
```

You can add headers, port, custom protocol, or even a prefix (like a version number):

```javascript
var api = restful('api.example.com')
    .header('AuthToken', 'test') // set global header
    .prefixUrl('v1')
    .protocol('https')
    .port(8080);
// resource now targets `https://api.example.com:8080/v1`
```

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

In case you need to set a custom endpoint URL, you can use `oneUrl` or `allUrl` methods.

```js
var articleMember = api.oneUrl('articles', 'http://custom.url/article?id=1');  // http://custom.url/article?id=1
```

```js
var articlesCollection = api.allUrl('articles', 'http://custom.url/article/list');  // http://custom.url/article/list
```

#### Entities

Once you have collections and members endpoints, fetch them to get *entities*. Restful.js exposes `get()` and `getAll()` methods for fetching endpoints. Since these methods are asynchronous, they return a Promise ([based on the ES6 Promise specification](https://github.com/jakearchibald/es6-promise)) for response.

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
A response is made from the HTTP response fetched from the endpoint. It exposes `status()`, `headers()`, and `body()` methods. For a `GET` request, the `body` method will return one or a an array of entities. Therefore you can disable this hydration by calling `body(false)`.

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
    articleEntity.remove(); // will perform a DELETE request
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
* `entity.remove()`: Remove the entity by performing a DELETE request.
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

Restful.js uses an inheritance pattern when collections or members are chained. That means that when you configure a collection or a member, it will configure all the collection an members chained afterwards.

```js
// configure the api
api.header('AuthToken', 'test');

var articlesCollection = api.all('articles');
articlesCollection.get(1); // will send the `AuthToken` header
// You can configure articlesCollection, too
articlesCollection.header('foo', 'bar');
articlesCollection.one('comments', 1).get(); // will send both the AuthToken and foo headers
```

## API Reference

Restful.js exposes similar methods on collections, members and entities. The name are consistent, and the arguments depend on the context.

### Collection methods

* `getAll ( [ params [, headers ]] )`: Get a full collection. Returns a promise with an array of entities.
* `get ( id [, params [, headers ]] )`: Get a member in a collection. Returns a promise with an entity.
* `post ( data [, headers ] )`: Create a member in a collection. Returns a promise with the response.
* `put ( id, data [, headers ] )`: Update a member in a collection. Returns a promise with the response.
* `delete ( id [, headers ] )`: Delete a member in a collection. Returns a promise with the response.
* `patch ( id, data [, headers ] )`: Patch a member in a collection. Returns a promise with the response.
* `head ( id, [, headers ] )`: Perform a HEAD request on a member in a collection. Returns a promise with the response.
* `url ()`: Get the collection url.
* `addResponseInterceptor ( interceptor )`: Add a response interceptor.
* `addRequestInterceptor ( interceptor )`: Add a request interceptor.
* `header ( name, value )`: Add a header.

```js
// http://api.example.com/articles/1/comments/2/authors
var authorsCollection = api.one('articles', 1).one('comments', 2).all('authors');
authorsCollection.getAll().then(function(authorEntities) { /*  */ });
authorsCollection.get(1).then(function(authorEntity) { /*  */ });
```

### Member methods

* `get ( [ params [, headers ]] )`: Get a member. Returns a promise with an entity.
* `put ( data [, headers ] )`: Update a member. Returns a promise with the response.
* `delete ( [ headers ] )`: Delete a member. Returns a promise with the response.
* `patch ( data [, headers ] )`: Patch a member. Returns a promise with the response.
* `head ( [ headers ] )`: Perform a HEAD request on a member. Returns a promise with the response.
* `one ( name, id )`: Target a child member in a collection `name`.
* `all ( name )`: Target a child collection `name`.
* `url ()`: Get the member url.
* `addResponseInterceptor ( interceptor )`: Add a response interceptor.
* `addRequestInterceptor ( interceptor )`: Add a request interceptor.
* `header ( name, value )`: Add a header.

```js
// http://api.example.com/articles/1/comments/2
var commentMember = api.one('articles', 1).one('comments', 2);
commentMember.get().then(function(commentEntity) { /*  */ });
commentMember.delete().then(function(data) { /* */ });
```

### Interceptors

A response or request interceptor is a callback which looks like this:

```js
resource.addRequestInterceptor(function(data, headers, method, url) {
    // to edit the headers, just edit the headers object
    
    // You always must return the data object
    return data;
});
```

### Response methods

* `response.status()`: Get the HTTP status code of the response
* `response.headers()`: Get the HTTP headers of the response
* `response.body()`: Get the HTTP body of the response. If it is a `GET` request, it will hydrate some entities. To get the raw body call it with `false` as argument.

### Entity methods

* `entity.data()` : Get the JS object unserialized from the response body (which must be in JSON)
* `entity.one(name, id)`: Query a member child of the entity.
* `entity.all(name)`: Query a collection child of the entity.
* `entity.url()`: Get the entity url.
* `entity.id()`: Get the id of the entity.
* `entity.save ( [ headers ] )`: Update the member link to the entity. Returns a promise with the response.
* `entity.remove ( [ headers ] )`: Delete the member link to the entity. Returns a promise with the response.

```js
// http://api.example.com/articles/1/comments/2
var commentMember = api.one('articles', 1).one('comments', 2);
commentMember.get().then(function(commentEntity) {
    commentEntity.save();
    commentEntity.remove();
});
```

### Error Handling

To deal with errors, you must use the `catch` method on any of the returned promises:

```js
var commentMember = resource.one('articles', 1).one('comments', 2);
commentMember
    .get()
    .then(function(commentEntity) { /*  */ })
    .catch(function(err) {
        // deal with the error
    });
```

## Development

Install dependencies:

```sh
make install
```

### Build

To rebuild the minified JavaScript you must run: `make build`.

During development you can run `make watch` to trigger a build at each change.

### Tests

```sh
make test
```

## Contributing

All contributions are welcome and must pass the tests. If you add a new feature, please write tests for it.

## License

This application is available under the [MIT License](https://github.com/marmelab/restful.js/blob/master/LICENSE), courtesy of [marmelab](http://marmelab.com).
