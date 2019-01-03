"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var project = project || {};

project.utils = function () {
  return {
    init: function init() {
      var view = this;
      view.polyfills();
    },
    polyfills: function polyfills() {
      // Matches polyfill
      if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
              i = matches.length;

          while ((_readOnlyError("i"), --i) >= 0 && matches.item(i) !== this) {}

          return i > -1;
        };
      } // Includes polyfill


      if (!Array.prototype.includes) {
        Object.defineProperty(Array.prototype, 'includes', {
          enumerable: false,
          value: function value(obj) {
            var newArr = this.filter(function (el) {
              return el == obj;
            });
            return newArr.length > 0;
          }
        });
      }

      if (!String.prototype.includes) {
        String.prototype.includes = function (search, start) {
          typeof start !== 'number' && (start = 0);
          if (start + search.length > this.length) return false;else return this.indexOf(search, start) !== -1;
        };
      } // Nodelist forEach polyfill


      if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
          thisArg = thisArg || window;

          for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
          }
        };
      } // Closest polyfill


      if (!Element.prototype.closest) Element.prototype.closest = function (s) {
        var el = this,
            ancestor = this;
        if (!document.documentElement.contains(el)) return null;

        do {
          if (ancestor.matches(s)) return ancestor;
          ancestor = ancestor.parentElement;
        } while (ancestor !== null);

        return null;
      }; // Dataset polyfill

      if (!document.documentElement.dataset && (!Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'dataset') || !Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'dataset').get)) {
        var descriptor = {};
        descriptor.enumerable = true;

        descriptor.get = function get() {
          var element = this,
              map = {},
              attributes = this.attributes;

          function toUpperCase(n0) {
            return n0.charAt(1).toUpperCase();
          }

          function getter() {
            return this.value;
          }

          function setter(name, value) {
            if (typeof value !== 'undefined') this.setAttribute(name, value);else this.removeAttribute(name);
          }

          for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i]; // This test really should allow any XML Name without
            // colons (and non-uppercase for XHTML)

            if (attribute && attribute.name && /^data-\w[\w-]*$/.test(attribute.name)) {
              var name = attribute.name,
                  value = attribute.value; // Change to CamelCase

              var propName = name.substr(5).replace(/-./g, toUpperCase);
              Object.defineProperty(map, propName, {
                enumerable: descriptor.enumerable,
                get: getter.bind({
                  value: value || ''
                }),
                set: setter.bind(element, name)
              });
            }
          }

          return map;
        };

        Object.defineProperty(HTMLElement.prototype, 'dataset', descriptor);
      } // Append After Prototype


      Element.prototype.appendAfter = function (element) {
        var _this = this;

        NodeList.prototype.isPrototypeOf(element) ? element.forEach(function (element) {
          return element.parentNode.insertBefore(_this, element.nextSibling);
        }) : element.parentNode.insertBefore(this, element.nextSibling);
      }, false;
    },
    promisePolyfill: function promisePolyfill() {
      (function (global, factory) {
        (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define(factory) : factory();
      })(this, function () {
        'use strict'; // @this {Promise}

        function finallyConstructor(callback) {
          var constructor = this.constructor;
          return this.then(function (value) {
            return constructor.resolve(callback()).then(function () {
              return value;
            });
          }, function (reason) {
            return constructor.resolve(callback()).then(function () {
              return constructor.reject(reason);
            });
          });
        } // Store setTimeout reference so promise-polyfill will be unaffected by
        // other code modifying setTimeout (like sinon.useFakeTimers())


        var setTimeoutFunc = setTimeout;

        function noop() {} // Polyfill for Function.prototype.bind


        function bind(fn, thisArg) {
          return function () {
            fn.apply(thisArg, arguments);
          };
        } // @constructor
        // @param {Function} fn


        function Promise(fn) {
          if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
          if (typeof fn !== 'function') throw new TypeError('not a function'); // @type {!number}

          this._state = 0; // @type {!boolean}

          this._handled = false; // @type {Promise|undefined}

          this._value = undefined; // @type {!Array<!Function>}

          this._deferreds = [];
          doResolve(fn, this);
        }

        function handle(self, deferred) {
          while (self._state === 3) {
            self = self._value;
          }

          if (self._state === 0) {
            self._deferreds.push(deferred);

            return;
          }

          self._handled = true;

          Promise._immediateFn(function () {
            var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;

            if (cb === null) {
              (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
              return;
            }

            var ret;

            try {
              ret = cb(self._value);
            } catch (e) {
              reject(deferred.promise, e);
              return;
            }

            resolve(deferred.promise, ret);
          });
        }

        function resolve(self, newValue) {
          try {
            // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
            if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');

            if (newValue && (_typeof(newValue) === 'object' || typeof newValue === 'function')) {
              var then = newValue.then;

              if (newValue instanceof Promise) {
                self._state = 3;
                self._value = newValue;
                finale(self);
                return;
              } else if (typeof then === 'function') {
                doResolve(bind(then, newValue), self);
                return;
              }
            }

            self._state = 1;
            self._value = newValue;
            finale(self);
          } catch (e) {
            reject(self, e);
          }
        }

        function reject(self, newValue) {
          self._state = 2;
          self._value = newValue;
          finale(self);
        }

        function finale(self) {
          if (self._state === 2 && self._deferreds.length === 0) {
            Promise._immediateFn(function () {
              if (!self._handled) {
                Promise._unhandledRejectionFn(self._value);
              }
            });
          }

          for (var i = 0, len = self._deferreds.length; i < len; i++) {
            handle(self, self._deferreds[i]);
          }

          self._deferreds = null;
        } // @constructor


        function Handler(onFulfilled, onRejected, promise) {
          this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
          this.onRejected = typeof onRejected === 'function' ? onRejected : null;
          this.promise = promise;
        } // Take a potentially misbehaving resolver function and make sure
        // onFulfilled and onRejected are only called once.
        // Makes no guarantees about asynchrony.


        function doResolve(fn, self) {
          var done = false;

          try {
            fn(function (value) {
              if (done) return;
              done = true;
              resolve(self, value);
            }, function (reason) {
              if (done) return;
              done = true;
              reject(self, reason);
            });
          } catch (ex) {
            if (done) return;
            done = true;
            reject(self, ex);
          }
        }

        Promise.prototype['catch'] = function (onRejected) {
          return this.then(null, onRejected);
        };

        Promise.prototype.then = function (onFulfilled, onRejected) {
          // @ts-ignore
          var prom = new this.constructor(noop);
          handle(this, new Handler(onFulfilled, onRejected, prom));
          return prom;
        };

        Promise.prototype['finally'] = finallyConstructor;

        Promise.all = function (arr) {
          return new Promise(function (resolve, reject) {
            if (!arr || typeof arr.length === 'undefined') throw new TypeError('Promise.all accepts an array');
            var args = Array.prototype.slice.call(arr);
            if (args.length === 0) return resolve([]);
            var remaining = args.length;

            function res(i, val) {
              try {
                if (val && (_typeof(val) === 'object' || typeof val === 'function')) {
                  var then = val.then;

                  if (typeof then === 'function') {
                    then.call(val, function (val) {
                      res(i, val);
                    }, reject);
                    return;
                  }
                }

                args[i] = val;

                if (--remaining === 0) {
                  resolve(args);
                }
              } catch (ex) {
                reject(ex);
              }
            }

            for (var i = 0; i < args.length; i++) {
              res(i, args[i]);
            }
          });
        };

        Promise.resolve = function (value) {
          if (value && _typeof(value) === 'object' && value.constructor === Promise) {
            return value;
          }

          return new Promise(function (resolve) {
            resolve(value);
          });
        };

        Promise.reject = function (value) {
          return new Promise(function (resolve, reject) {
            reject(value);
          });
        };

        Promise.race = function (values) {
          return new Promise(function (resolve, reject) {
            for (var i = 0, len = values.length; i < len; i++) {
              values[i].then(resolve, reject);
            }
          });
        }; // Use polyfill for setImmediate for performance gains


        Promise._immediateFn = typeof setImmediate === 'function' && function (fn) {
          setImmediate(fn);
        } || function (fn) {
          setTimeoutFunc(fn, 0);
        };

        Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
          if (typeof console !== 'undefined' && console) {
            console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
          }
        }; // @suppress {undefinedVars}


        var globalNS = function () {
          // the only reliable means to get the global object is
          // `Function('return this')()`
          // However, this causes CSP violations in Chrome apps.
          if (typeof self !== 'undefined') {
            return self;
          }

          if (typeof window !== 'undefined') {
            return window;
          }

          if (typeof global !== 'undefined') {
            return global;
          }

          throw new Error('unable to locate global object');
        }();

        if (!('Promise' in globalNS)) {
          globalNS['Promise'] = Promise;
        } else if (!globalNS.Promise.prototype['finally']) {
          globalNS.Promise.prototype['finally'] = finallyConstructor;
        }
      });
    },
    fetchPolyfill: function fetchPolyfill() {
      (function (global, factory) {
        (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.WHATWGFetch = {});
      })(this, function (exports) {
        'use strict';

        var support = {
          searchParams: 'URLSearchParams' in self,
          iterable: 'Symbol' in self && 'iterator' in Symbol,
          blob: 'FileReader' in self && 'Blob' in self && function () {
            try {
              new Blob();
              return true;
            } catch (e) {
              return false;
            }
          }(),
          formData: 'FormData' in self,
          arrayBuffer: 'ArrayBuffer' in self
        };

        function isDataView(obj) {
          return obj && DataView.prototype.isPrototypeOf(obj);
        }

        if (support.arrayBuffer) {
          var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

          var isArrayBufferView = ArrayBuffer.isView || function (obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
          };
        }

        function normalizeName(name) {
          if (typeof name !== 'string') {
            name = String(name);
          }

          if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
            throw new TypeError('Invalid character in header field name');
          }

          return name.toLowerCase();
        }

        function normalizeValue(value) {
          if (typeof value !== 'string') {
            value = String(value);
          }

          return value;
        } // Build a destructive iterator for the value list


        function iteratorFor(items) {
          var iterator = {
            next: function next() {
              var value = items.shift();
              return {
                done: value === undefined,
                value: value
              };
            }
          };

          if (support.iterable) {
            iterator[Symbol.iterator] = function () {
              return iterator;
            };
          }

          return iterator;
        }

        function Headers(headers) {
          this.map = {};

          if (headers instanceof Headers) {
            headers.forEach(function (value, name) {
              this.append(name, value);
            }, this);
          } else if (Array.isArray(headers)) {
            headers.forEach(function (header) {
              this.append(header[0], header[1]);
            }, this);
          } else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function (name) {
              this.append(name, headers[name]);
            }, this);
          }
        }

        Headers.prototype.append = function (name, value) {
          name = normalizeName(name);
          value = normalizeValue(value);
          var oldValue = this.map[name];
          this.map[name] = oldValue ? oldValue + ', ' + value : value;
        };

        Headers.prototype['delete'] = function (name) {
          delete this.map[normalizeName(name)];
        };

        Headers.prototype.get = function (name) {
          name = normalizeName(name);
          return this.has(name) ? this.map[name] : null;
        };

        Headers.prototype.has = function (name) {
          return this.map.hasOwnProperty(normalizeName(name));
        };

        Headers.prototype.set = function (name, value) {
          this.map[normalizeName(name)] = normalizeValue(value);
        };

        Headers.prototype.forEach = function (callback, thisArg) {
          for (var name in this.map) {
            if (this.map.hasOwnProperty(name)) {
              callback.call(thisArg, this.map[name], name, this);
            }
          }
        };

        Headers.prototype.keys = function () {
          var items = [];
          this.forEach(function (value, name) {
            items.push(name);
          });
          return iteratorFor(items);
        };

        Headers.prototype.values = function () {
          var items = [];
          this.forEach(function (value) {
            items.push(value);
          });
          return iteratorFor(items);
        };

        Headers.prototype.entries = function () {
          var items = [];
          this.forEach(function (value, name) {
            items.push([name, value]);
          });
          return iteratorFor(items);
        };

        if (support.iterable) {
          Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
        }

        function consumed(body) {
          if (body.bodyUsed) {
            return Promise.reject(new TypeError('Already read'));
          }

          body.bodyUsed = true;
        }

        function fileReaderReady(reader) {
          return new Promise(function (resolve, reject) {
            reader.onload = function () {
              resolve(reader.result);
            };

            reader.onerror = function () {
              reject(reader.error);
            };
          });
        }

        function readBlobAsArrayBuffer(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsArrayBuffer(blob);
          return promise;
        }

        function readBlobAsText(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsText(blob);
          return promise;
        }

        function readArrayBufferAsText(buf) {
          var view = new Uint8Array(buf);
          var chars = new Array(view.length);

          for (var i = 0; i < view.length; i++) {
            chars[i] = String.fromCharCode(view[i]);
          }

          return chars.join('');
        }

        function bufferClone(buf) {
          if (buf.slice) {
            return buf.slice(0);
          } else {
            var view = new Uint8Array(buf.byteLength);
            view.set(new Uint8Array(buf));
            return view.buffer;
          }
        }

        function Body() {
          this.bodyUsed = false;

          this._initBody = function (body) {
            this._bodyInit = body;

            if (!body) {
              this._bodyText = '';
            } else if (typeof body === 'string') {
              this._bodyText = body;
            } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
              this._bodyBlob = body;
            } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
              this._bodyFormData = body;
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this._bodyText = body.toString();
            } else if (support.arrayBuffer && support.blob && isDataView(body)) {
              this._bodyArrayBuffer = bufferClone(body.buffer); // IE 10-11 can't handle a DataView body.

              this._bodyInit = new Blob([this._bodyArrayBuffer]);
            } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
              this._bodyArrayBuffer = bufferClone(body);
            } else {
              this._bodyText = body = Object.prototype.toString.call(body);
            }

            if (!this.headers.get('content-type')) {
              if (typeof body === 'string') {
                this.headers.set('content-type', 'text/plain;charset=UTF-8');
              } else if (this._bodyBlob && this._bodyBlob.type) {
                this.headers.set('content-type', this._bodyBlob.type);
              } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
              }
            }
          };

          if (support.blob) {
            this.blob = function () {
              var rejected = consumed(this);

              if (rejected) {
                return rejected;
              }

              if (this._bodyBlob) {
                return Promise.resolve(this._bodyBlob);
              } else if (this._bodyArrayBuffer) {
                return Promise.resolve(new Blob([this._bodyArrayBuffer]));
              } else if (this._bodyFormData) {
                throw new Error('could not read FormData body as blob');
              } else {
                return Promise.resolve(new Blob([this._bodyText]));
              }
            };

            this.arrayBuffer = function () {
              if (this._bodyArrayBuffer) {
                return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
              } else {
                return this.blob().then(readBlobAsArrayBuffer);
              }
            };
          }

          this.text = function () {
            var rejected = consumed(this);

            if (rejected) {
              return rejected;
            }

            if (this._bodyBlob) {
              return readBlobAsText(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
            } else if (this._bodyFormData) {
              throw new Error('could not read FormData body as text');
            } else {
              return Promise.resolve(this._bodyText);
            }
          };

          if (support.formData) {
            this.formData = function () {
              return this.text().then(decode);
            };
          }

          this.json = function () {
            return this.text().then(JSON.parse);
          };

          return this;
        } // HTTP methods whose capitalization should be normalized


        var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

        function normalizeMethod(method) {
          var upcased = method.toUpperCase();
          return methods.indexOf(upcased) > -1 ? upcased : method;
        }

        function Request(input, options) {
          options = options || {};
          var body = options.body;

          if (input instanceof Request) {
            if (input.bodyUsed) {
              throw new TypeError('Already read');
            }

            this.url = input.url;
            this.credentials = input.credentials;

            if (!options.headers) {
              this.headers = new Headers(input.headers);
            }

            this.method = input.method;
            this.mode = input.mode;
            this.signal = input.signal;

            if (!body && input._bodyInit != null) {
              body = input._bodyInit;
              input.bodyUsed = true;
            }
          } else {
            this.url = String(input);
          }

          this.credentials = options.credentials || this.credentials || 'same-origin';

          if (options.headers || !this.headers) {
            this.headers = new Headers(options.headers);
          }

          this.method = normalizeMethod(options.method || this.method || 'GET');
          this.mode = options.mode || this.mode || null;
          this.signal = options.signal || this.signal;
          this.referrer = null;

          if ((this.method === 'GET' || this.method === 'HEAD') && body) {
            throw new TypeError('Body not allowed for GET or HEAD requests');
          }

          this._initBody(body);
        }

        Request.prototype.clone = function () {
          return new Request(this, {
            body: this._bodyInit
          });
        };

        function decode(body) {
          var form = new FormData();
          body.trim().split('&').forEach(function (bytes) {
            if (bytes) {
              var split = bytes.split('=');
              var name = split.shift().replace(/\+/g, ' ');
              var value = split.join('=').replace(/\+/g, ' ');
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
          return form;
        }

        function parseHeaders(rawHeaders) {
          var headers = new Headers(); // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
          // https://tools.ietf.org/html/rfc7230#section-3.2

          var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
          preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
            var parts = line.split(':');
            var key = parts.shift().trim();

            if (key) {
              var value = parts.join(':').trim();
              headers.append(key, value);
            }
          });
          return headers;
        }

        Body.call(Request.prototype);

        function Response(bodyInit, options) {
          if (!options) {
            options = {};
          }

          this.type = 'default';
          this.status = options.status === undefined ? 200 : options.status;
          this.ok = this.status >= 200 && this.status < 300;
          this.statusText = 'statusText' in options ? options.statusText : 'OK';
          this.headers = new Headers(options.headers);
          this.url = options.url || '';

          this._initBody(bodyInit);
        }

        Body.call(Response.prototype);

        Response.prototype.clone = function () {
          return new Response(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
          });
        };

        Response.error = function () {
          var response = new Response(null, {
            status: 0,
            statusText: ''
          });
          response.type = 'error';
          return response;
        };

        var redirectStatuses = [301, 302, 303, 307, 308];

        Response.redirect = function (url, status) {
          if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError('Invalid status code');
          }

          return new Response(null, {
            status: status,
            headers: {
              location: url
            }
          });
        };

        exports.DOMException = self.DOMException;

        try {
          new exports.DOMException();
        } catch (err) {
          exports.DOMException = function (message, name) {
            this.message = message;
            this.name = name;
            var error = Error(message);
            this.stack = error.stack;
          };

          exports.DOMException.prototype = Object.create(Error.prototype);
          exports.DOMException.prototype.constructor = exports.DOMException;
        }

        function fetch(input, init) {
          return new Promise(function (resolve, reject) {
            var request = new Request(input, init);

            if (request.signal && request.signal.aborted) {
              return reject(new exports.DOMException('Aborted', 'AbortError'));
            }

            var xhr = new XMLHttpRequest();

            function abortXhr() {
              xhr.abort();
            }

            xhr.onload = function () {
              var options = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseHeaders(xhr.getAllResponseHeaders() || '')
              };
              options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
              var body = 'response' in xhr ? xhr.response : xhr.responseText;
              resolve(new Response(body, options));
            };

            xhr.onerror = function () {
              reject(new TypeError('Network request failed'));
            };

            xhr.ontimeout = function () {
              reject(new TypeError('Network request failed'));
            };

            xhr.onabort = function () {
              reject(new exports.DOMException('Aborted', 'AbortError'));
            };

            xhr.open(request.method, request.url, true);

            if (request.credentials === 'include') {
              xhr.withCredentials = true;
            } else if (request.credentials === 'omit') {
              xhr.withCredentials = false;
            }

            if ('responseType' in xhr && support.blob) {
              xhr.responseType = 'blob';
            }

            request.headers.forEach(function (value, name) {
              xhr.setRequestHeader(name, value);
            });

            if (request.signal) {
              request.signal.addEventListener('abort', abortXhr);

              xhr.onreadystatechange = function () {
                // DONE (success or failure)
                if (xhr.readyState === 4) {
                  request.signal.removeEventListener('abort', abortXhr);
                }
              };
            }

            xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
          });
        }

        fetch.polyfill = true;

        if (!self.fetch) {
          self.fetch = fetch;
          self.Headers = Headers;
          self.Request = Request;
          self.Response = Response;
        }

        exports.Headers = Headers;
        exports.Request = Request;
        exports.Response = Response;
        exports.fetch = fetch;
        Object.defineProperty(exports, '__esModule', {
          value: true
        });
      });
    },
    newElement: function newElement(tag, text, classes) {
      tag = document.createElement(tag);
      !text && (text = '');
      tag.innerHTML = text;
      if (!classes) return tag;
      typeof classes === 'string' ? tag.classList.add(classes) : classes.forEach(function (classes) {
        return tag.classList.add(classes);
      });
      return tag;
    },
    scrollPageTo: function scrollPageTo(to) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
      var extraDistance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var easeInOutQuad = function easeInOutQuad(currentTime, startValue, changeInValue, duration) {
        currentTime /= duration / 2;
        if (currentTime < 1) return changeInValue / 2 * currentTime * currentTime + startValue;
        currentTime--;
        return -changeInValue / 2 * (currentTime * (currentTime - 2) - 1) + startValue;
      };

      return new Promise(function (resolve, reject) {
        var element = document.scrollingElement || document.documentElement || document.body;
        typeof to === 'string' && (to = document.querySelector(to) || reject());
        typeof to !== 'number' && (to = to.getBoundingClientRect().top + element.scrollTop);
        var start = element.scrollTop,
            changeTo = to - start - extraDistance,
            currentTime = 0,
            increment = 20;

        var animateScroll = function animateScroll() {
          currentTime += increment;
          element.scrollTop = easeInOutQuad(currentTime, start, changeTo, duration);
          currentTime < duration ? setTimeout(animateScroll, increment) : resolve();
        };

        animateScroll();
      });
    },
    initHover3D: function initHover3D(container, inner) {
      // Setup
      // <div class="container">
      //     <div class="inner"></div>
      // </div>
      // .container {
      //     width: 500px;
      //     height: 500px;
      //     background: lightgreen;
      //     margin: auto auto 100px;
      //     position: relative;
      //     perspective: 40px;
      // }
      // .inner {
      //     width: 100%;
      //     height: 100%;
      //     background: rgb(42, 141, 173);
      //     box-shadow: $boxShadow;
      //     @include transition;
      //     perspective: 40px;
      // }
      // correr com project.utils().initHover3D(view.container, view.inner)
      var updateRate = 10;
      var centerX,
          centerY,
          x,
          y,
          counter = 0;

      var setOrigin = function setOrigin(element) {
        centerX = element.offsetWidth / 2 + element.offsetLeft;
        centerY = element.offsetHeight / 2 + element.offsetTop;
      };

      var updateTransform = function updateTransform(event) {
        event = event || window.event;
        x = event.clientX - centerX;
        y = -(event.clientY - centerY);
        inner.style.transform = "rotateX(".concat(y / inner.offsetHeight / 2, "deg) rotateY(").concat(x / inner.offsetWidth / 2, "deg)");
      };

      var isTimeToUpdate = function isTimeToUpdate() {
        return counter++ % updateRate === 0;
      }; // Allows to track the mouse position relatively to the center of the element


      setOrigin(container);
      event.type === 'mouseenter' && isTimeToUpdate() && updateTransform(event);
      event.type === 'mousemove' && updateTransform(event);
      event.type === 'mouseleave' && (inner.style = '');
      container.addEventListener('mouseenter', function (event) {
        return isTimeToUpdate() && updateTransform(event);
      });
      container.addEventListener('mousemove', function (event) {
        return updateTransform(event);
      });
      container.addEventListener('mouseleave', function () {
        return inner.style = '';
      });
    }
  };
};