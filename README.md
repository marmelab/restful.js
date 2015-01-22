# restful.js

A pure JS client for interacting with server-side RESTful resources. Think Restangular without Angular.

## Installation

It is available with bower:

```
bower install restful.js
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
    .config()
    .prefixUrl('v1')
    .protocol('https')
    .port(8080)
    .end(); // end returns the configured object, resource in our case

// resource now targets `https://api.example.com:8080/v1`
```

### Query collections and members

To get a collection you must use the `all` method on your resource or already existing member. Therefore you can use `get`, `put`, `post`, `delete` on it to make requests on your API:

```javascript
var articles = resource.all('articles');  // https://api.example.com:8080/v1/articles

// https://api.example.com:8080/v1/articles/1
articles.get(1).then(function(article) {
    // article is an entity
    // that means, that if the server response was { id: 1, title: 'test', body: 'hello' }
    // you can do the following

    article.title(); // returns `test`
    article.body(); // returns `hello`

    // You can also edit it
    article.title('test2');

    // Finally you can easily update it or delete it
    article.save(); // will perform a PUT request
    article.remove(); // will perform a DELETE request
});
```

You can also use the `one` method to directly get a member:

```javascript
var articles = resource.one('articles', 1);  // https://api.example.com:8080/v1/articles/1

// https://api.example.com:8080/v1/articles/1
articles.get().then(function(article) {
    // article is an entity
    // that means, that if the server response was { id: 1, title: 'test', body: 'hello' }
    // you can do the following

    article.title(); // returns `test`
    article.body(); // returns `hello`

    // You can also edit it
    article.title('test2');

    // Finally you can easily update it or delete it
    article.save(); // will perform a PUT request
    article.remove(); // will perform a DELETE request
});
```

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

## Methods description

There are methods to deal with collections, members and entities. The name are consistent and the arguments depend on the context.

### Global methods

* **one(name, id)**: Target a member in a collection `name`.
* **all(name)**: Target a collection `name`.
* **requestInterceptor(callback)**: Add a request interceptor.
* **responseInterceptor(callback)**: Add a response interceptor

```javascript
resource.one('articles', 1).one('comments', 2).all('authors');
```

```javascript
resource.responseInterceptor(function(res) {
    res.title = 'Intercepted';

    return res;
})
```

### Collection methods

* **getAll([params [, headers]])**: Get a full collection. Returns a promise with an array of entities.
* **rawGetAll([params [, headers]])**: Get a full collection. Returns a promise with an array of raw responses
* **get(id [, params [, headers]])**: Get a member in a collection. Returns a promise with an entity.
* **rawGet(id [, params [, headers]])**: Get a member in a collection. Returns a promise with a raw response.
* **post(data [, headers])**: Create a member in a collection. Returns a promise with the data of the response.
* **rawPost(data [, headers])**: Create a member in a collection. Returns a promise with a raw response.
* **put(id, data [, headers])**: Update a member in a collection. Returns a promise with the data of the response.
* **rawPut(id, data [, headers])**: Update a member in a collection. Returns a promise with a raw response.
* **delete(id [, headers])**: Delete a member in a collection. Returns a promise with the data of the response.
* **rawDelete(id [, headers])**: Delete a member in a collection. Returns a promise with a raw response.

```javascript
var authorsResource = resource.one('articles', 1).one('comments', 2).all('authors');

authorsResource.getAll().then(function(authors) {

});

authorsResource.get(1).then(function(author) {

});
```

### Member methods

* **get([params [, headers]])**: Get a member. Returns a promise with an entity.
* **rawGet([params [, headers]])**: Get a member. Returns a promise with a raw response.
* **put(data [, headers])**: Update a member. Returns a promise with the data of the response.
* **rawPut(data [, headers])**: Update a member. Returns a promise with a raw response.
* **delete([headers])**: Delete a member. Returns a promise with the data of the response.
* **rawDelete([headers])**: Delete a member. Returns a promise with a raw response.

```javascript
var commentResource = resource.one('articles', 1).one('comments', 2);

commentResource.get().then(function(comment) {

});

commentResource.delete().then(function(data) {

});
```

### Entity methods

* **entity.save([headers])**: Update the member link to the entity. Returns a promise with the data of the response.
* **entity.remove([headers])**: Delete the member link to the entity. Returns a promise with the data of the response.

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
