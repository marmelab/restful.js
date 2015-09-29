# HTTP Backend

The HTTP service of restful.js relies on an HTTP backend which has responsibility of performing HTTP request.

It receives a config object in input and should return a Promise which will be resolved with either the well formatted response or rejected with a well formatted error.

## Input config

The input config looks like this:

```js
const config = {
    data: {
        // only if the request contains data
    },
    headers: {
        Authorization: 'Bearer AAAAA',
    },
    method: 'get',
    params: {
        page: 1,
    },
    url: '/url',
}
```

## Response

When a request succeed, the response returned when the Promise is resolved should look like this:

```js
const response = {
    data: {
        author: 'Mike Ross',
    },
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
    statusCode: 200,
};
```

## Error

If an error occurs you should append the response object on the error object. An error should like this:

```js
const error = new Error('Not found');
error.response = {
    data: null,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
    statusCode: 404,
};
```

You can check the two existing HTTP backend in [src/http](https://github.com/marmelab/restful.js/tree/master/src/http).
