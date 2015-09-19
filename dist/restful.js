(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["restful"] = factory();
	else
		root["restful"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!************************!*\
  !*** ./src/restful.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var debug = _interopRequire(__webpack_require__(/*! ./service/debug */ 3));
	
	var endpoint = _interopRequire(__webpack_require__(/*! ./model/endpoint */ 4));
	
	var fetch = _interopRequire(__webpack_require__(/*! ./http/fetch */ 7));
	
	var http = _interopRequire(__webpack_require__(/*! ./service/http */ 1));
	
	var member = __webpack_require__(/*! ./model/decorator */ 9).member;
	
	var scope = _interopRequire(__webpack_require__(/*! ./model/scope */ 10));
	
	module.exports = function (baseUrl) {
	    var httpBackend = arguments[1] === undefined ? fetch : arguments[1];
	
	    var rootScope = scope();
	    rootScope.assign("config", "entityIdentifier", "id");
	    rootScope.set("debug", false);
	    rootScope.set("url", baseUrl || "" + window.location.protocol + "//" + window.location.host);
	
	    var rootEndpoint = member(endpoint(http(httpBackend))(rootScope));
	
	    rootEndpoint.on("error", function (error, config) {
	        return rootScope.get("debug") && debug("error", error, config);
	    });
	    rootEndpoint.on("request", function (config) {
	        return rootScope.get("debug") && debug("request", null, config);
	    });
	    rootEndpoint.on("response", function (response, config) {
	        return rootScope.get("debug") && debug("response", response.body(false), config);
	    });
	
	    rootEndpoint.debug = function (enabled) {
	        return rootScope.set("debug", enabled);
	    };
	
	    return rootEndpoint;
	};

/***/ },
/* 1 */
/*!*****************************!*\
  !*** ./src/service/http.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var assign = _interopRequire(__webpack_require__(/*! object-assign */ 2));
	
	module.exports = function (httpBackend) {
	    return function (config) {
	        var requestInterceptors = config.requestInterceptors || [];
	        var responseInterceptors = config.responseInterceptors || [];
	        delete config.requestInterceptors;
	        delete config.responseInterceptors;
	
	        return requestInterceptors.reduce(function (promise, interceptor) {
	            return promise.then(function (currentConfig) {
	                return Promise.resolve().then(function () {
	                    return interceptor(currentConfig);
	                }).then(function (nextConfig) {
	                    return assign({}, currentConfig, nextConfig);
	                });
	            });
	        }, Promise.resolve(config)).then(function (transformedConfig) {
	            return httpBackend(transformedConfig).then(function (response) {
	                return responseInterceptors.reduce(function (promise, interceptor) {
	                    return promise.then(function (currentResponse) {
	                        return Promise.resolve().then(function () {
	                            return interceptor(currentResponse, transformedConfig);
	                        }).then(function (nextResponse) {
	                            return assign({}, currentResponse, nextResponse);
	                        });
	                    });
	                }, Promise.resolve(response));
	            });
	        });
	    };
	};

/***/ },
/* 2 */
/*!**********************************!*\
  !*** ./~/object-assign/index.js ***!
  \**********************************/
/***/ function(module, exports) {

	'use strict';
	
	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);
	
		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));
	
			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}
	
		return to;
	};


/***/ },
/* 3 */
/*!******************************!*\
  !*** ./src/service/debug.js ***!
  \******************************/
/***/ function(module, exports) {

	/* eslint-disable no-console */
	"use strict";
	
	module.exports = debug;
	
	function debug(type, data, config) {
	    var logger = type === "error" ? "error" : "log";
	
	    if (!console.groupCollapsed) {
	        if (data) {
	            return console[logger](type, config.method.toUpperCase(), config.url, data, config);
	        }
	
	        return console[logger](type, config.method.toUpperCase(), config.url, config);
	    }
	
	    if (data) {
	        console[logger](type, config.method.toUpperCase(), config.url, data);
	    } else {
	        console[logger](type, config.method.toUpperCase(), config.url);
	    }
	
	    console.groupCollapsed("config");
	    for (var i in config) {
	        // eslint-disable-line prefer-const
	        if (!config.hasOwnProperty(i)) {
	            continue;
	        }
	
	        console.log(i, config[i]);
	    }
	    console.groupEnd();
	}

/***/ },
/* 4 */
/*!*******************************!*\
  !*** ./src/model/endpoint.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var assign = _interopRequire(__webpack_require__(/*! object-assign */ 2));
	
	var responseFactory = _interopRequire(__webpack_require__(/*! ./response */ 5));
	
	module.exports = function (request) {
	    return function endpointFactory(scope) {
	        scope.on("error", function () {
	            return true;
	        }); // Add default error listener to prevent unwanted throw
	        var endpoint = {}; // Persist reference
	
	        function _generateRequestConfig(method, data, params, headers) {
	            var config = {
	                headers: assign({}, scope.get("headers"), headers || {}),
	                method: method,
	                params: params,
	                requestInterceptors: scope.get("requestInterceptors") || [],
	                responseInterceptors: scope.get("responseInterceptors") || [],
	                url: scope.get("url") };
	
	            if (data) {
	                if (!config.headers["Content-Type"]) {
	                    config.headers["Content-Type"] = "application/json;charset=UTF-8";
	                }
	
	                config.data = data;
	            }
	
	            scope.emit("request", assign({}, config));
	
	            return config;
	        }
	
	        function _onResponse(config, rawResponse) {
	            var response = responseFactory(rawResponse, endpoint, scope.get("config").entityIdentifier);
	            scope.emit("response", assign({}, response), assign({}, config));
	            return response;
	        }
	
	        function _onError(config, error) {
	            scope.emit("error", error, assign({}, config));
	            throw error;
	        }
	
	        function _httpMethodFactory(method) {
	            var expectData = arguments[1] === undefined ? true : arguments[1];
	
	            if (expectData) {
	                return function (data) {
	                    var params = arguments[1] === undefined ? null : arguments[1];
	                    var headers = arguments[2] === undefined ? null : arguments[2];
	
	                    var config = _generateRequestConfig(method, data, params, headers);
	                    return request(assign({}, config)).then(function (rawResponse) {
	                        return _onResponse(assign({}, config), rawResponse);
	                    }, function (rawResponse) {
	                        return _onError(assign({}, config), rawResponse);
	                    });
	                };
	            }
	
	            return function () {
	                var params = arguments[0] === undefined ? null : arguments[0];
	                var headers = arguments[1] === undefined ? null : arguments[1];
	
	                var config = _generateRequestConfig(method, null, params, headers);
	                return request(assign({}, config)).then(function (rawResponse) {
	                    return _onResponse(config, rawResponse);
	                }, function (error) {
	                    return _onError(config, error);
	                });
	            };
	        }
	
	        assign(endpoint, {
	            addRequestInterceptor: function (interceptor) {
	                return scope.push("requestInterceptors", interceptor);
	            },
	            addResponseInterceptor: function (interceptor) {
	                return scope.push("responseInterceptors", interceptor);
	            },
	            "delete": _httpMethodFactory("delete"),
	            identifier: function (newIdentifier) {
	                return scope.assign("config", "entityIdentifier", newIdentifier);
	            },
	            get: _httpMethodFactory("get", false),
	            head: _httpMethodFactory("head", false),
	            header: function (key, value) {
	                return scope.assign("headers", key, value);
	            },
	            headers: function () {
	                return scope.get("headers");
	            },
	            "new": function (url) {
	                var childScope = scope["new"]();
	                childScope.set("url", url);
	
	                return endpointFactory(childScope);
	            },
	            on: scope.on,
	            once: scope.once,
	            patch: _httpMethodFactory("patch"),
	            post: _httpMethodFactory("post"),
	            put: _httpMethodFactory("put"),
	            url: function () {
	                return scope.get("url");
	            } });
	
	        return endpoint;
	    };
	};

/***/ },
/* 5 */
/*!*******************************!*\
  !*** ./src/model/response.js ***!
  \*******************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var entity = _interopRequire(__webpack_require__(/*! ./entity */ 6));
	
	module.exports = function (response, endpoint) {
	    var url = endpoint.url();
	    var identifier = endpoint.identifier();
	
	    return {
	        status: function status() {
	            return response.statusCode;
	        },
	        body: function body() {
	            var hydrate = arguments[0] === undefined ? true : arguments[0];
	            var data = response.data;
	
	            if (!hydrate) {
	                return data;
	            }
	
	            if (Object.prototype.toString.call(data) === "[object Array]") {
	                return data.map(function (datum) {
	                    var id = datum[identifier];
	                    return entity(datum, endpoint["new"]("" + url + "/" + id));
	                });
	            }
	
	            return entity(data, endpoint);
	        },
	        headers: function headers() {
	            return response.headers;
	        } };
	};

/***/ },
/* 6 */
/*!*****************************!*\
  !*** ./src/model/entity.js ***!
  \*****************************/
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (data, endpoint, identifier) {
	    return {
	        all: endpoint.all,
	        custom: endpoint.custom,
	        data: (function (_data) {
	            var _dataWrapper = function data() {
	                return _data.apply(this, arguments);
	            };
	
	            _dataWrapper.toString = function () {
	                return _data.toString();
	            };
	
	            return _dataWrapper;
	        })(function () {
	            return data;
	        }),
	        "delete": function _delete() {
	            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                args[_key] = arguments[_key];
	            }
	
	            return endpoint["delete"].apply(endpoint, args);
	        },
	        id: function id() {
	            return data[identifier];
	        },
	        one: endpoint.one,
	        save: function save() {
	            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                args[_key] = arguments[_key];
	            }
	
	            return endpoint.put.apply(endpoint, [data].concat(args));
	        },
	        url: endpoint.url };
	};

/***/ },
/* 7 */
/*!***************************!*\
  !*** ./src/http/fetch.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(/*! whatwg-fetch */ 8);
	
	function checkStatus(response) {
	    if (response.status >= 200 && response.status < 300) {
	        return response;
	    }
	
	    var error = new Error(response.statusText);
	    error.response = response;
	    throw error;
	}
	
	function parseJSON(response) {
	    return response.json().then(function (json) {
	        return {
	            data: json,
	            statusCode: response.status };
	    });
	}
	
	module.exports = function (config) {
	    var url = config.url;
	    delete config.url;
	
	    if (config.data) {
	        config.body = /application\/json/.test(config.headers["Content-Type"]) ? JSON.stringify(config.data) : config.data;
	        delete config.data;
	    }
	
	    return fetch(url, config).then(checkStatus).then(parseJSON);
	};

/***/ },
/* 8 */
/*!*********************************!*\
  !*** ./~/whatwg-fetch/fetch.js ***!
  \*********************************/
/***/ function(module, exports) {

	(function() {
	  'use strict';
	
	  if (self.fetch) {
	    return
	  }
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = name.toString();
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = value.toString();
	    }
	    return value
	  }
	
	  function Headers(headers) {
	    this.map = {}
	
	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }
	
	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }
	
	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }
	
	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }
	
	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }
	
	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }
	
	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }
	
	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }
	
	  var support = {
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self
	  }
	
	  function Body() {
	    this.bodyUsed = false
	
	
	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (!body) {
	        this._bodyText = ''
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	    }
	
	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }
	
	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }
	
	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }
	
	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }
	
	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }
	
	    return this
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }
	
	  function Request(url, options) {
	    options = options || {}
	    this.url = url
	
	    this.credentials = options.credentials || 'omit'
	    this.headers = new Headers(options.headers)
	    this.method = normalizeMethod(options.method || 'GET')
	    this.mode = options.mode || null
	    this.referrer = null
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(options.body)
	  }
	
	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }
	
	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }
	
	  Body.call(Request.prototype)
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }
	
	    this._initBody(bodyInit)
	    this.type = 'default'
	    this.url = null
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	  }
	
	  Body.call(Response.prototype)
	
	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;
	
	  self.fetch = function(input, init) {
	    // TODO: Request constructor should accept input, init
	    var request
	    if (Request.prototype.isPrototypeOf(input) && !init) {
	      request = input
	    } else {
	      request = new Request(input, init)
	    }
	
	    return new Promise(function(resolve, reject) {
	      var xhr = new XMLHttpRequest()
	
	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }
	
	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }
	
	        return;
	      }
	
	      xhr.onload = function() {
	        var status = (xhr.status === 1223) ? 204 : xhr.status
	        if (status < 100 || status > 599) {
	          reject(new TypeError('Network request failed'))
	          return
	        }
	        var options = {
	          status: status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options))
	      }
	
	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.open(request.method, request.url, true)
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }
	
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})();


/***/ },
/* 9 */
/*!********************************!*\
  !*** ./src/model/decorator.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	exports.custom = custom;
	exports.collection = collection;
	exports.member = member;
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var assign = _interopRequire(__webpack_require__(/*! object-assign */ 2));
	
	function custom(endpoint) {
	    return function (name) {
	        var relative = arguments[1] === undefined ? true : arguments[1];
	
	        if (relative) {
	            return member(endpoint["new"]("" + endpoint.url() + "/" + name)); // eslint-disable-line no-use-before-define
	        }
	
	        return member(endpoint["new"](name)); // eslint-disable-line no-use-before-define
	    };
	}
	
	function collection(endpoint) {
	    function _bindHttpMethod(method) {
	        return function () {
	            var _endpoint$new;
	
	            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                args[_key] = arguments[_key];
	            }
	
	            var id = args.shift();
	            return (_endpoint$new = endpoint["new"]("" + endpoint.url() + "/" + id))[method].apply(_endpoint$new, args);
	        };
	    }
	
	    return assign(endpoint, {
	        custom: custom(endpoint),
	        "delete": _bindHttpMethod("delete"),
	        getAll: endpoint.get,
	        get: _bindHttpMethod("get"),
	        head: _bindHttpMethod("head"),
	        one: function (name, id) {
	            return member(endpoint["new"]("" + endpoint.url() + "/" + name + "/" + id));
	        }, // eslint-disable-line no-use-before-define
	        patch: _bindHttpMethod("patch"),
	        post: _bindHttpMethod("post"),
	        put: _bindHttpMethod("put") });
	}
	
	function member(endpoint) {
	    return assign(endpoint, {
	        all: function (name) {
	            return collection(endpoint["new"]("" + endpoint.url() + "/" + name));
	        },
	        custom: custom(endpoint),
	        one: function (name, id) {
	            return member(endpoint["new"]("" + endpoint.url() + "/" + name + "/" + id));
	        } });
	}

/***/ },
/* 10 */
/*!****************************!*\
  !*** ./src/model/scope.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	module.exports = scopeFactory;
	
	var assign = _interopRequire(__webpack_require__(/*! object-assign */ 2));
	
	var EventEmitter = __webpack_require__(/*! events */ 11).EventEmitter;
	
	function scopeFactory(parentScope) {
	    var _data = {};
	    var _emitter = new EventEmitter();
	
	    var scope = {
	        assign: function assign(key, subKey, value) {
	            if (!scope.has(key)) {
	                scope.set(key, {});
	            }
	
	            _data[key][subKey] = value;
	            return scope;
	        },
	        emit: function emit() {
	            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                args[_key] = arguments[_key];
	            }
	
	            _emitter.emit.apply(_emitter, args);
	
	            if (parentScope) {
	                parentScope.emit.apply(parentScope, args);
	            }
	        },
	        get: function get(key) {
	            var datum = _data[key];
	
	            if (scope.has(key) && typeof datum !== "object" || !parentScope) {
	                return datum;
	            } else if (!scope.has(key) && parentScope) {
	                return parentScope.get(key);
	            }
	
	            var parentDatum = parentScope.get(key);
	
	            if (datum.length === undefined) {
	                return assign({}, parentDatum, datum);
	            }
	
	            return (parentDatum || []).concat(datum);
	        },
	        has: function has(key) {
	            return _data.hasOwnProperty(key);
	        },
	        "new": function _new() {
	            return scopeFactory(scope);
	        },
	        on: _emitter.on.bind(_emitter),
	        once: _emitter.once.bind(_emitter),
	        push: function push(key, value) {
	            if (!scope.has(key)) {
	                scope.set(key, []);
	            }
	
	            _data[key].push(value);
	            return scope;
	        },
	        set: function set(key, value) {
	            _data[key] = value;
	            return scope;
	        } };
	
	    return scope;
	}

/***/ },
/* 11 */
/*!************************************************!*\
  !*** ./~/node-libs-browser/~/events/events.js ***!
  \************************************************/
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        len = arguments.length;
	        args = new Array(len - 1);
	        for (i = 1; i < len; i++)
	          args[i - 1] = arguments[i];
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    len = arguments.length;
	    args = new Array(len - 1);
	    for (i = 1; i < len; i++)
	      args[i - 1] = arguments[i];
	
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    var m;
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  var ret;
	  if (!emitter._events || !emitter._events[type])
	    ret = 0;
	  else if (isFunction(emitter._events[type]))
	    ret = 1;
	  else
	    ret = emitter._events[type].length;
	  return ret;
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ }
/******/ ])
});
;
//# sourceMappingURL=restful.js.map