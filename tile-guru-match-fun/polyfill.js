/**
 * Created by andrey on 15.06.2022.
 */

if (!Object.assign) {
    Object.assign = function (target) {
        for (var i = 1; i < arguments.length; i++) {
            for (var t in arguments[i]) {
                target[t] = arguments[i][t];
            }
        }

        return target;
    }
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    }
}

// https://github.com/tc39/proposal-relative-indexing-method
if (Array.prototype.at === undefined) {
    [Array, String].forEach(function (C) {
        Object.defineProperty(C.prototype, "at",
            {
                writable: true,
                enumerable: false,
                configurable: true,
                value:  function at(n) {
                    // ToInteger() abstract op
                    n = (n < 0 ? Math.ceil(n) : Math.floor(n)) || 0;
                    // Allow negative indexing from the end
                    if (n < 0) n += this.length;
                    // OOB access is guaranteed to return undefined
                    if (n < 0 || n >= this.length) return undefined;
                    return this[n];
                }
            });
    })
}

// Array.prototype.find polyfill from https://tc39.github.io/ecma262/#sec-array.prototype.find
if (Array.prototype.find === undefined) {
    Object.defineProperty(Array.prototype, "find", {
        value: function (predicate) {
            if (this == null) {
                throw TypeError("\"this\" is null or not defined"); 
            }

            var o = Object(this);
            var len = o.length >>> 0;

            if (typeof predicate !== "function") {
                throw TypeError("predicate must be a function");
            }
            var thisArg = arguments[1];
            var k = 0;
            while (k < len) {
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                k++;
            }
            return undefined;
        },
        configurable: true,
        writable: true
    });
}

if (Array.prototype.flat === undefined) {
    Object.defineProperty(Array.prototype, 'flat', {
        value: function flat () {
            var depth = isNaN(arguments[0]) ? 1 : Number(arguments[0]);

            return depth ? Array.prototype.reduce.call(this, function (acc, cur) {
                if (Array.isArray(cur)) {
                    acc.push.apply(acc, flat.call(cur, depth - 1));
                } else {
                    acc.push(cur);
                }

                return acc;
            }, []) : Array.prototype.slice.call(this);
        },
        configurable: true,
        writable: true
    });
}

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, "startsWith", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.indexOf(searchString, position) === position;
        }
    });
}

if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (pattern, replacement) {
        if (typeof pattern === 'string') {
            pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        return this.replace(new RegExp(pattern, 'g'), replacement);
    }
}

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            // 1. Let O be ? ToObject(this value).
            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1.
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}

/**
 * Array.flat() polyfill
 * Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#reduce_concat_isArray_recursivity
 */
if (!Array.prototype.flat) {
    Array.prototype.flat = function(depth) {
        // If no depth is specified, default to 1
        if (depth === undefined) {
            depth = 1;
        }

        // Recursively reduce sub-arrays to the specified depth
        var flatten = function (arr, depth) {
            // If depth is 0, return the array as-is
            if (depth < 1) {
                return arr.slice();
            }

            // Otherwise, concatenate into the parent array
            return arr.reduce(function (acc, val) {
                return acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val);
            }, []);

        };

        return flatten(this, depth);
    };
}

if (typeof URLSearchParams === "undefined") {
    URLSearchParams = function (url) {
        this.values = {};
        this.size = 0;

        if (url) {
            if ("?" === url.charAt(0)) {
                url = url.substr(1); // Drop the leading '?' / '#'
            }

            var nameValues = url.split("&");

            for (var i = 0; i < nameValues.length; i++) {
                var nameValue = nameValues[i].split("=");
                var name = nameValue[0];
                var value = decodeURIComponent(nameValue[1].replace(/\+/g, " "));

                this.set(name, value);
            }
        }
    };

    URLSearchParams.prototype.get = function (name) {
        return this.values[name];
    };

    URLSearchParams.prototype.set = function (name, value) {
        this.values[name] = value;
        this.size = Object.keys(this.values).length;
    };

    URLSearchParams.prototype.toString = function () {
        return Object.keys(this.values).map(function( key) {
            return key + "=" + this.values[key]
        }, this).join("&");
    };
}