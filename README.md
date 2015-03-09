# restful.js

A pure JS client for interacting with server-side RESTful resources. Think Restangular without Angular.

## Installation

It is available with bower or npm:

```
bower install restful.js
npm install restful.js
```

Then add the retrieved files to your HTML layout:

```html
<script type="text/javascript" src="/path/to/bower_components/restful.js/dist/restful.min.js"></script>
```

You can also use it with [RequireJS](http://requirejs.org/) as an AMD module or with [Browserify](http://browserify.org/).

## Usage

### Create a resource targeting your API

```javascript
var resource = restful('api.example.com');

// You can also provide a port
var resource = restful('api.example.com', 8080);
```

If you wish to add a prefix to all calls like a version you can configure it:
```javascript
var resource = restful('api.example.com')
    .header('AuthToken', 'test') // set global headers
    .prefixUrl('v1')
    .protocol('https')
    .port(8080);

// resource now targets `https://api.example.com:8080/v1`
```

### Query collections and members

* **one ( name, id )**: Target a member in a collection `name`.
* **all ( name )**: Target a collection `name`.

You can chain them to target the wanted collection or member:

```javascript
var article = resource.one('articles', 1);  // https://api.example.com:8080/v1/articles/1
var comments = article.all('comments');  // https://api.example.com:8080/v1/articles/1/comments

// https://api.example.com:8080/v1/articles/1/comments/3
comments.get(3).then(function(comment) {
    // You can also call `all` and `one` on an entity
    return comment.all('authors'); // https://api.example.com:8080/v1/articles/1/comments/3/authors
});
```

#### Entities

When you retrieve a collection or a member from your API, you get an **entity**. An entity exposes you several method to chain calls on it:

* **entity.one( name, id )**: Query a member child of the entity.
* **entity.all( name )**: Query a collection child of the entity.
* **entity.url()**: Get the entity url.
* **entity.save()**: Save the entity modifications by performing a POST request.
* **entity.remove()**: Remove the entity by performing a DELETE request.
* **entity.id()**: Get the id of the entity.

To access to the data of the entity, execute it. It will return the response and the entity will be under the `data` key.

```javascript
var articles = resource.all('articles');  // https://api.example.com:8080/v1/articles

// https://api.example.com:8080/v1/articles/1
articles.get(1).then(function(article) {
    // article is an entity
    // that means, that if the server response was { id: 1, title: 'test', body: 'hello' }
    // you can do the following

    var data = article().data;
    data.title; // returns `test`
    data.body; // returns `hello`

    // You can also edit it
    data.title = 'test2';

    // Finally you can easily update it or delete it
    article.save(); // will perform a PUT request
    article.remove(); // will perform a DELETE request
});

// You could also do:
var article = resource.one('articles', 1);  // https://api.example.com:8080/v1/articles/1

// https://api.example.com:8080/v1/articles/1
article.get();
```

You can chain them to target the wanted collection or member:

```javascript
var article = resource.one('articles', 1);  // https://api.example.com:8080/v1/articles/1
var comments = article.all('comments');  // https://api.example.com:8080/v1/articles/1/comments

// https://api.example.com:8080/v1/articles/1/comments/3
comments.get(3).then(function(comment) {
    // You can also call `all` and `one` on an entity
    return comment.all('authors').getAll(); // https://api.example.com:8080/v1/articles/1/comments/3/authors
});
```

An inheritance pattern is used when collections or members are chained. That means when you configure a collection or a member it will configure it and all its children.

```javascript
// we configure it
resource.header('AuthToken', 'test');

var articles = resource.all('articles');
articles.get(); // will received the `AuthToken` header

// we can configure it too. It will have both the AuthToken and foo headers
articles.header('foo', 'bar');

articles
    .one('comments', 1) // will received `foo` header
    .get();
```

## Methods description

There are methods to deal with collections, members and entities. The name are consistent and the arguments depend on the context.

### Collection methods

* **getAll ( [ params [, headers ]] )**: Get a full collection. Returns a promise with an array of entities.
* **get ( id [, params [, headers ]] )**: Get a member in a collection. Returns a promise with an entity.
* **post ( data [, headers ] )**: Create a member in a collection. Returns a promise with the response.
* **put ( id, data [, headers ] )**: Update a member in a collection. Returns a promise with the response.
* **delete ( id [, headers ] )**: Delete a member in a collection. Returns a promise with the response.
* **patch ( id, data [, headers ] )**: Patch a member in a collection. Returns a promise with the response.
* **head ( id, [, headers ] )**: Perform a HEAD request on a member in a collection. Returns a promise with the response.
* **url ()**: Get the collection url.
* **addResponseInterceptor ( interceptor )**: Add a response interceptor.
* **addRequestInterceptor ( interceptor )**: Add a request interceptor.
* **header ( name, value )**: Add a header.

```javascript
var authorsResource = resource.one('articles', 1).one('comments', 2).all('authors');

authorsResource.getAll().then(function(authors) {

});

authorsResource.get(1).then(function(author) {

});
```

### Member methods

* **get ( [ params [, headers ]] )**: Get a member. Returns a promise with an entity.
* **put ( data [, headers ] )**: Update a member. Returns a promise with the response.
* **delete ( [ headers ] )**: Delete a member. Returns a promise with the response.
* **patch ( data [, headers ] )**: Patch a member. Returns a promise with the response.
* **head ( [ headers ] )**: Perform a HEAD request on a member. Returns a promise with the response.
* **one ( name, id )**: Target a child member in a collection `name`.
* **all ( name )**: Target a child collection `name`.
* **url ()**: Get the member url.
* **addResponseInterceptor ( interceptor )**: Add a response interceptor.
* **addRequestInterceptor ( interceptor )**: Add a request interceptor.
* **header ( name, value )**: Add a header.

```javascript
var commentResource = resource.one('articles', 1).one('comments', 2);

commentResource.get().then(function(comment) {

});

commentResource.delete().then(function(data) {

});
```

### Interceptors

A response or request interceptor is a callback which looks like this:

```javascript
resource.addRequestInterceptor(function(data, headers, method, url) {
    // to edit the headers, just edit the headers object
    
    // You always must return the data object
    return data;
});
```

### Entity methods

* **entity.save ( [ headers ] )**: Update the member link to the entity. Returns a promise with the data of the response.
* **entity.remove ( [ headers ] )**: Delete the member link to the entity. Returns a promise with the data of the response.

```javascript
var commentResource = resource.one('articles', 1).one('comments', 2);

commentResource.get().then(function(comment) {
    comment.save();
    comment.remove();
});
```

### Catch errors

To deals with errors you must use the `catch` method:

```javascript
var commentResource = resource.one('articles', 1).one('comments', 2);

commentResource
    .get()
    .then(function(comment) {

    })
    .catch(function(err) {

    });
```

## Development

Install dependencies:

```
make install
```

### Build

To rebuild the minified JavaScript you must run: `make build`.

During development you can run `make watch` to trigger a build at each change.

### Tests

```
make test
```

## Contributing

All contributions are welcome and must pass the tests. If you add a new feature, please write tests for it.

## License

This application is available under the [MIT License](https://github.com/marmelab/restful.js/blob/master/LICENSE), courtesy of [marmelab](http://marmelab.com).
