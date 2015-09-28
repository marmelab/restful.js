# Upgrade to 0.9

For any change, refer to the README for more details.

## Initialization

Initialization of a restful object has changed.

## Native promise

The polyfill for native promise is no longer included in restful.js, you must include it on your own if needed.

## Targeting a custom url

All methods `customUrl`, `allUrl` and `oneUrl` are replaced by a `custom` method.

## Entities

The `remove` method of an entity is now named `delete`.

``` diff
- entity.remove()
+ entity.delete()
```

## HTTP methods

All HTTP methods have now normalized parameters in this order `data, params, headers`.
`data` depends on the method.
