/**
 * Created by mac on 5/8/17.
 */

// eslint-disable-next-line no-use-before-define
if (typeof cc === "undefined") {
    var Context = require("../common/context");

    var cleverapps = {
        config: JSON.parse(JSON.stringify(Context.getConfig() || {})) || {}
    };
}

cleverapps.CODE_SUCCEED = 0;
cleverapps.CODE_FAILED = 1;
cleverapps.CODE_CANCELLED = 2;
cleverapps.CODE_PENDING = 3;

cleverapps.CODE_CANCELLED_FACEBOOK_DIALOG = 4201;

cleverapps.normalize = function (arr, ratio) {
    ratio = ratio || 1;

    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }

    return arr.map(function (value) {
        return value / sum * ratio;
    });
};

/**
 * Parses parameters to a JS map<br/>
 * Supports both window.location.search and window.location.hash)
 * @param {String} [source=window.location.search] string to parse
 * @returns {Object}
 */
cleverapps.getRequestParameters = function (source, keepAsIs) {
    var res = {};
    var url = source || window.location.search;
    if (url) {
        url = url.substr(1); // Drop the leading '?' / '#'
        var nameValues = url.split("&");

        for (var i = 0; i < nameValues.length; i++) {
            var nameValue = nameValues[i].split("=");
            var name = nameValue[0];
            var value = nameValue[1] || "";
            if (!keepAsIs) {
                try {
                    value = decodeURIComponent(value.replace(/\+/g, " "));
                } catch (e) {
                    console.error("getRequestParameters decodeURIComponent - " + value);
                }
            }
            res[name] = value;
        }
    }
    return res;
};

cleverapps.EventEmitter = function () {
    this.bindings = {};
};

cleverapps.EventEmitter.prototype.once = function (eventName, callback, target) {
    this.on(eventName, function () {
        this.off(eventName);
        callback.apply(this, arguments);
    }.bind(this), target);
};

cleverapps.EventEmitter.prototype.on = function (eventName, callback, target) {
    if (!this.bindings[eventName]) {
        this.bindings[eventName] = [];
    }
    this.bindings[eventName].push(callback);
    var handler = {
        clear: function () {
            if (this.bindings[eventName]) {
                var index = this.bindings[eventName].indexOf(callback);
                if (index >= 0) {
                    this.bindings[eventName].splice(index, 1);
                }
            }
        }.bind(this)
    };

    addCleaner(target, handler.clear);

    return handler;
};

cleverapps.EventEmitter.prototype.off = function (eventName) {
    this.bindings[eventName] = undefined;
};

cleverapps.EventEmitter.prototype.purge = function () {
    this.bindings = {};
};

cleverapps.EventEmitter.prototype.trigger = function () {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    var eventName = args.shift();
    if (this.bindings[eventName]) {
        this.bindings[eventName].slice().forEach(function (callback) {
            callback.apply(this, args);
        });
    }
};

addCleaner = function (target, cleaner) {
    if (typeof target === "object") {
        if (!target._cleaners) {
            target._cleaners = [];
        }
        target._cleaners.push(cleaner);
    }
};

runCleaners = function (target) {
    if (target._cleaners) {
        target._cleaners.forEach(cleverapps.callFunc);
        delete target._cleaners;
    }
};

cleverapps.EventsQueue = function (interval) {
    this.data = [];
    this.interval = cleverapps.parseInterval(interval);
};

cleverapps.EventsQueue.prototype.add = function (event) {
    this.data.push(event);
    this.data.sort();

    this.shrink();
};

cleverapps.EventsQueue.prototype.first = function () {
    this.shrink();
    if (this.data.length > 0) {
        return this.data[0];
    }
};

cleverapps.EventsQueue.prototype.shrink = function () {
    while (this.data.length > 0 && this.data[0] + this.interval <= Date.now()) {
        this.data.shift();
    }
};

cleverapps.EventsQueue.prototype.getShrinkLeftTime = function () {
    if (this.data.length > 0) {
        return this.data[0] + this.interval - Date.now();
    }
};

cleverapps.EventsQueue.prototype.size = function () {
    this.shrink();

    return this.data.length;
};

cleverapps.Cache = function (capacity) {
    this.capacity = capacity || 100;
    this.data = {};
    this.queue = [];
};

cleverapps.Cache.prototype.set = function (key, value) {
    if (!this.data[key]) {
        var index = this.queue.indexOf(key);
        if (index !== -1) {
            this.queue.splice(index, 1);
        }
    }

    this.data[key] = value;
    this.queue.push(key);

    if (this.queue.length > this.capacity) {
        key = this.queue.shift();
        delete this.data[key];
    }
};

cleverapps.Cache.prototype.get = function (key) {
    return this.data[key];
};

cleverapps.isRumble = function () {
    var knockout = cleverapps.meta.getMainObject().knockoutGame;
    return knockout && knockout.isRumble();
};

cleverapps.isKnockoutGame = function () {
    return cleverapps.config.regime === "knockout";
};

cleverapps.humanReadableNumber = function (episode, level) {
    var episodeNo = episode;
    var levelNo = level;

    if (typeof episode === "object") {
        var floatLevel = episode.floatLevel || 0;

        if (cleverapps.config.type === "merge") {
            return Math.ceil(floatLevel) + 1;
        }

        if (cleverapps.isKnockoutGame()) {
            floatLevel /= 6;
        } else {
            floatLevel /= 2;
        }
        episodeNo = Math.floor(floatLevel);
        levelNo = Math.round(Episode.LEVELS_PER_EPISODE * (floatLevel - episodeNo));
    }

    return (parseInt(episodeNo) || 0) * Episode.LEVELS_PER_EPISODE + levelNo + 1;
};

cleverapps.arrayFill = function (n, value) {
    var res = [];
    for (var i = 0; i < n; i++) {
        res.push(value);
    }
    return res;
};

cleverapps.formatAmount = function (amount) {
    if (amount < 1000) {
        return amount;
    }

    var thousands = Math.floor(amount / 1000);

    amount -= thousands * 1000;

    if (amount < 10) {
        amount = "00" + amount;
    } else if (amount < 100) {
        amount = "0" + amount;
    }

    var DELIMETER = " ";
    return thousands + DELIMETER + amount;
};

cleverapps.cmp = function (a, b) {
    a = JSON.stringify(a);
    b = JSON.stringify(b);

    return a === b;
};

cleverapps.loadSdk = function (path, options) {
    options.onSuccessOnce = options.onSuccessOnce || cleverapps.once(options.onSuccess);
    options.onFailureOnce = options.onFailureOnce || cleverapps.once(options.onFailure);

    var onSuccess = options.onSuccessOnce;
    var onFailure = options.onFailureOnce;

    if (options.attempt === undefined) {
        options.attempt = 3;
    }

    var script = document.createElement("script");
    if (options.crossorigin !== false) {
        script.setAttribute("crossorigin", "anonymous");
    }
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", path);
    if (options.attrs) {
        Object.keys(options.attrs).forEach(function (attrName) {
            script.setAttribute(attrName, options.attrs[attrName]);
        });
    }

    var loadTimeout;

    var onFailureCallback = function () {
        clearTimeout(loadTimeout);
        script.onload = undefined;
        script.onerror = undefined;

        if (options.attempt > 1) {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            options.attempt--;
            cleverapps.loadSdk(path, options);
        } else {
            onFailure();
        }
    };

    script.onload = function () {
        clearTimeout(loadTimeout);
        onSuccess();
    };
    script.onerror = onFailureCallback;
    loadTimeout = setTimeout(onFailureCallback, 30000);

    document.body.appendChild(script);
};

cleverapps.getFrameUserId = function (baseUrl, options) {
    options = options || {};

    var callback = options.callback || function () {};
    var key = options.key || cleverapps.config.name;
    var timeout = options.timeout || 60000;

    var iframe = document.createElement("iframe");
    iframe.src = baseUrl + "cleverapps/res/getitem.html?key=" + key;
    iframe.style = "display: none;";
    document.body.appendChild(iframe);

    var listener = cleverapps.waitNoMore(timeout, function (event) {
        console.log("Message received from the child: " + (event && event.data));

        window.removeEventListener("message", listener);
        document.body.removeChild(iframe);

        if (event && event.data) {
            try {
                callback(JSON.parse(event && event.data).id);
            } catch (e) {
                console.log("parse userid error - " + event && event.data, e);
            }
        }
    });

    window.addEventListener("message", listener);
};

cleverapps.setUrlHash = function (data) {
    var params = cleverapps.getRequestParameters(window.location.hash);

    for (var key in data) {
        var value = data[key];

        if (value === undefined) {
            delete params[key];
        } else {
            params[key] = value;
        }
    }

    window.location.hash = Object.keys(params).map(function (objectKey) {
        return objectKey + "=" + params[objectKey];
    }).join("&");
};

cleverapps.INTERVALS = {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 7 * 86400,
    month: 30 * 86400
};

cleverapps.padZeroes = function (num, size) {
    var s = num + "";
    while (s.length < size) {
        s = "0" + s;
    }
    return s;
};

cleverapps.compactTime = function (time, options) {
    if (!time) {
        return time;
    }

    var precision = options && options.seconds ? 1000 : 60000;

    return Math.max(Math.round((time - cleverapps.ZERO_DATE) / precision), 0);
};

cleverapps.expandTime = function (time, options) {
    if (!time || time > cleverapps.ZERO_DATE) {
        return time;
    }
    var precision = options && options.seconds ? 1000 : 60000;

    return time * precision + cleverapps.ZERO_DATE;
};

cleverapps.parseInterval = function (intervalStr) {
    var value = parseInt(intervalStr) * 1000;

    for (var name in cleverapps.INTERVALS) {
        if (intervalStr.indexOf(name) !== -1) {
            var period = cleverapps.INTERVALS[name];
            return value * period;
        }
    }

    return value;
};

cleverapps.goalCollectSound = function () {
    cleverapps.audio.playSound(bundles.game.urls.goal_inc_effect, {
        throttle: 100
    });
};

cleverapps.once = function (func) {
    return function () {
        if (func) {
            var oldFunc = func;
            func = undefined;
            return oldFunc.apply(this, arguments);
        }
    };
};

cleverapps.shuffle = function (a) {
    for (var i = 0; i < a.length; i++) {
        var s = cleverapps.Random.random(a.length);
        var tmp = a[i];
        a[i] = a[s];
        a[s] = tmp;
    }
    return a;
};

cleverapps.extractDateFromDateTime = function (datetime) {
    return new Date(datetime).setHours(0, 0, 0, 0);
};

cleverapps.extractNumber = function (str) {
    if (!str) {
        return;
    }

    var digits = "";
    for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i);
        if (ch.match(/\d+/g)) {
            digits += ch;
        } else if (ch === "," || ch === ".") {
            digits += ".";
        }
    }
    return digits.indexOf(".") !== -1 ? parseFloat(digits) : parseInt(digits);
};

cleverapps.override = function (target, source) {
    for (var i in source) {
        var v1 = target[i];
        var v2 = source[i];

        if (typeof cc !== "undefined" && v1 instanceof cc.Color) {
            target[i] = v2;
        } else if (Array.isArray(v1) && Array.isArray(v2)) {
            target[i] = v2;
        } else if (typeof v1 === "object" && typeof v2 === "object") {
            cleverapps.override(v1, v2);
        } else {
            target[i] = v2;
        }
    }
    return target;
};

cleverapps.increaseStylesByKoef = function (target, koef) {
    for (var i in target) {
        var value = target[i];
        if (typeof value === "number") {
            if (Array.isArray(target)) {
                continue;
            }
            if (cleverapps.UI.needUpdateSizes(target, i, value)) {
                target[i] *= koef;
                target[i] = Math.round(target[i]);
            }
        } else if (typeof value === "object") {
            if (cleverapps.UI.needUpdateSizes(target, i, value)) {
                cleverapps.increaseStylesByKoef(value, koef);
            }
        }
    }
};

cleverapps.extendStyles = function (source, target) {
    if (target.extendStylesProcessed) {
        return target;
    }

    var targetCopy = cleverapps.overrideStyles(source, target, true);
    targetCopy.extendStylesProcessed = true;
    Object.assign(target, targetCopy);
    return target;
};

cleverapps.overrideStyles = function (target, source, clone) {
    if (target === undefined || source === undefined) {
        console.log(target, source);
    }

    if (clone) {
        target = cleverapps.clone(target, true);
    }

    for (var i in source) {
        var v1 = target[i];
        var v2 = source[i];

        if (v1 instanceof cc.Color || v1 && v1.fnt || v1 && v1.tmplt) {
            target[i] = v2;
        } else if (Array.isArray(v1) && Array.isArray(v2)) {
            target[i] = v2;
        } else if (typeof v1 === "object" && typeof v2 === "object") {
            cleverapps.overrideStyles(v1, v2);
        } else {
            target[i] = v2;
        }
    }
    return target;
};

cleverapps.overrideColors = function (target, source) {
    var isColor = function (obj) {
        return obj instanceof cc.Color
            || cc.sys.isNative && obj && obj.r !== undefined && obj.g !== undefined && obj.b !== undefined && obj.a !== undefined;
    };

    for (var i in source) {
        var v1 = target[i];
        var v2 = source[i];

        if (v1 === undefined) {
            target[i] = v2;
        } else if (isColor(v1) && isColor(v2)) {
            v1.r = v2.r;
            v1.g = v2.g;
            v1.b = v2.b;
            v1.a = v2.a;
        } else if (typeof v1 === "object" && typeof v2 === "object") {
            cleverapps.overrideColors(v1, v2);
        } else {
            target[i] = v2;
        }
    }
    return target;
};

cleverapps.overrideFonts = function (target, source) {
    for (var i in source) {
        var v1 = target[i];
        var v2 = source[i];

        if (v1 === undefined) {
            target[i] = v2;
        } else {
            if (cleverapps.config.debugMode) {
                var was = JSON.stringify(v1);
            }
            if (v2.size) {
                v1.size = v2.size;
            }
            if (v2.color) {
                v1.color = v2.color;
            }
            if (v2.name) {
                v1.name = v2.name;
            }
            if (v2.lineHeight) {
                v1.lineHeight = v2.lineHeight;
            }
            v1.stroke = v2.stroke;
            v1.shadow = v2.shadow;

            if (cleverapps.config.debugMode) {
                var become = JSON.stringify(v1);
                if (was === become) {
                    console.log("WAS BECOME override " + i);
                    console.log(was, become);
                    throw "Unnecessary overrideFonts: " + i;
                }
            }
        }

        target[i].fnt = true;
    }
    return target;
};

cleverapps.overrideTemplates = function (target, source) {
    for (var i in source) {
        var v1 = target[i];
        var v2 = source[i];

        if (v2 === undefined) {
            delete target[i];
        } else if (v1 === undefined) {
            target[i] = v2;
        } else {
            Object.assign(v1, v2);
        }

        if (target[i]) {
            target[i].tmplt = true;
        }
    }
    return target;
};

cleverapps.clone = function (object, recursive) {
    if (object === null) {
        return null;
    }

    if (typeof object !== "object") {
        return object;
    }

    if (typeof cc !== "undefined" && object instanceof cc.Color) {
        return cc.color(object);
    }

    var r;

    if (Array.isArray(object)) {
        r = [];
        for (var i = 0; i < object.length; i++) {
            if (recursive) {
                r.push(cleverapps.clone(object[i], true));
            } else {
                r.push(object[i]);
            }
        }
        return r;
    }

    r = {};
    for (var name in object) {
        if (object[name] && object[name].fnt) {
            r[name] = object[name];
        } else if (recursive) {
            if (cleverapps.config.debugMode && typeof cc !== "undefined" && object[name] instanceof cc.Node) {
                throw "clone node object with name - " + name;
            }
            r[name] = cleverapps.clone(object[name], true);
        } else {
            r[name] = object[name];
        }
    }
    return r;
};

cleverapps.accumulate = function (interval, callback) {
    var timeout = undefined;
    var self;
    var args;

    return function () {
        self = this;
        args = arguments;

        if (timeout === undefined) {
            timeout = setTimeout(function () {
                clearTimeout(timeout);
                timeout = undefined;

                var s = self, a = args;
                self = undefined;
                args = undefined;

                callback.apply(s, a);
            }, interval);
        }
    };
};

cleverapps.async = function (callback) {
    return function () {
        var self = this;
        var args = arguments;
        setTimeout(function () {
            callback.apply(self, args);
        }, 0);
    };
};

cleverapps.extendFunc = function (superFunc, func) {
    return function () {
        var oldSuper = this._super;
        this._super = superFunc;
        var res = func.apply(this, arguments);
        this._super = oldSuper;
        return res;
    };
};

cleverapps.throttle = function (delay, callback) {
    var timeout;

    return function () {
        if (timeout) {
            return;
        }

        timeout = setTimeout(function () {
            timeout = undefined;
        }, delay);

        callback.apply(this, arguments);
    };
};

cleverapps.postpone = function (delay, callback) {
    var self;
    var args;
    var timeout;

    return function () {
        self = this;
        args = arguments;

        clearTimeout(timeout);
        timeout = setTimeout(function () {
            callback.apply(self, args);
        }, delay);
    };
};

cleverapps.timeredThrottle = function (delay, callback) {
    var self, args, timeout;

    var exec = function () {
        if (timeout || !args) {
            return;
        }

        timeout = setTimeout(function () {
            timeout = undefined;
            exec();
        }, delay);

        var s = self, a = args;
        self = undefined;
        args = undefined;

        callback.apply(s, a);
    };

    return function () {
        self = this;
        args = arguments;

        exec();
    };
};

cleverapps.oneOf = function (obj, arr) {
    var platforms = Array.isArray(arr) ? arr : Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < platforms.length; i++) {
        if (obj instanceof platforms[i]) {
            return true;
        }
    }

    return false;
};

cleverapps.createSet = function (array) {
    var res = {};
    array.forEach(function (item) {
        res[item] = true;
    });
    return res;
};

cleverapps.contains = function (array1, array2, getKey) {
    getKey = getKey || function (item) {
        return item;
    };

    array1 = cleverapps.toArray(array1 || []).map(getKey);
    array2 = cleverapps.toArray(array2 || []).map(getKey);

    return array2.filter(function (item) {
        return array1.indexOf(item) !== -1;
    }).length === array2.length;
};

cleverapps.substract = function (array1, array2, getKey) {
    getKey = getKey || function (item) {
        return item;
    };

    array1 = array1 || [];
    array2 = array2 || [];

    var array2Object = {};
    array2.forEach(function (item) {
        array2Object[getKey(item)] = true;
    });

    return array1.filter(function (item) {
        return array2Object[getKey(item)] === undefined;
    });
};

cleverapps.intersect = function (array1, array2, getKey) {
    getKey = getKey || function (item) {
        return item;
    };

    array1 = cleverapps.toArray(array1 || []);
    array2 = cleverapps.toArray(array2 || []).map(getKey);

    var array2Object = {};
    array2.forEach(function (item) {
        array2Object[item] = true;
    });

    return array1.filter(function (item) {
        return array2Object[getKey(item)] !== undefined;
    });
};

cleverapps.unique = function (array, getKey) {
    if (typeof Set !== "undefined" && typeof Array.from === "function" && !getKey) {
        return Array.from(new Set(array));
    }

    var added = {};
    var result = [];
    array.forEach(function (item) {
        var key = getKey ? getKey(item) : item;
        if (added[key] !== true) {
            result.push(item);
            added[key] = true;
        }
    });
    return result;
};

cleverapps.values = function (obj) {
    if (!obj) {
        return [];
    }
    if (Object.values) {
        return Object.values(obj);
    }
    var values = [];
    for (var key in obj) {
        values.push(obj[key]);
    }
    return values;
};

cleverapps.callFunc = function (action) {
    action();
};

cleverapps.intervalToString = function (time, showHours) {
    if (showHours === undefined) {
        showHours = true;
    }

    time = Math.ceil(time / 1000);
    var sec = time % 60;
    time = Math.floor(time / 60);
    var min = time % 60;
    var hr = Math.floor(time / 60);
    if (sec < 10) {
        sec = "0" + sec;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (hr > 24 || (hr === 24 && (min > 0 || sec > 0))) {
        var day = Math.floor(hr / 24);
        hr %= 24;
        return Messages.get("dayTimeString", { day: day, hr: hr });
    }
    if (!showHours && (hr <= 24 && hr > 0)) {
        return Messages.get("hoursMinutesString", { hr: hr, min: min });
    }
    if (hr < 10) {
        hr = "0" + hr;
    }
    return (showHours ? (hr + ":") : "") + min + ":" + sec;
};

cleverapps.isLevels = function () {
    return !([Metha.NONE].includes(cleverapps.meta.getType()) || ["blocks", "klondike"].includes(cleverapps.config.type));
};

cleverapps.isStaging = function () {
    return !cc.sys.isNative && cleverapps.config.debugMode && (location.host.includes("labsystech.ru") || location.host.includes("-staging."));
};

cleverapps.isLocalhost = function () {
    return !cc.sys.isNative && (location.host === "localhost" || location.host === "127.0.0.1" || location.host.indexOf("192.168.") === 0);
};

cleverapps.isIFrame = function () {
    return window.top !== window.self;
};

cleverapps.checkStatus = function (status, accepted) {
    if (!Array.isArray(accepted)) {
        accepted = [accepted];
    }

    if (Array.isArray(status)) {
        return status.filter(function (single) {
            return cleverapps.checkStatus(single, accepted);
        }).length > 0;
    }

    return accepted.indexOf(status) !== -1
        || status && status.errorMessage && status.errorMessage.status && accepted.indexOf(status.errorMessage.status) !== -1;
};

cleverapps.toArray = function (array) {
    return Array.isArray(array) || array === undefined || array === null ? array : [array];
};

cleverapps.wait = function (n, callback) {
    if (n === 0) {
        callback();
        return;
    }

    var total = 0;
    return function () {
        total++;
        if (total === n) {
            callback();
        }
    };
};

cleverapps.waitNoMore = function (timeout, callback) {
    var waitTimeout = setTimeout(function () {
        console.log("waitNoMore timeout: " + timeout);
        waitTimeout = undefined;
        callback();
    }, timeout);

    return function () {
        if (waitTimeout !== undefined) {
            clearTimeout(waitTimeout);
            waitTimeout = undefined;
            callback.apply(this, arguments);
        }
    };
};

cleverapps.throwAsync = function (message, e) {
    if (typeof message === "object" && message.group) {
        message = "REPORT: " + message.group.toUpperCase() + " " + message.message;
    } else {
        message = message + " " + JSON.stringify((e || new Error()).stack);
    }

    message = decodeURIComponent(message);

    if (cleverapps.platform && cleverapps.platform.oneOf(Wechat)) {
        window.onerror(message);
    } else {
        setTimeout(function () {
            throw message;
        }, 0);
    }
};

cleverapps.isNumber = function (value) {
    return typeof value === "string" && value && /^[0-9]+$/.test(value) || typeof value === "number" && !isNaN(value);
};

cleverapps.castType = function (value) {
    if (typeof value === "string" && cleverapps.isNumber(value)) {
        return parseInt(value);
    }
    return value;
};

cleverapps.rangeArray = function (a, b) {
    var l = [];
    for (var i = a; i <= b; i++) {
        l.push(i);
    }
    return l;
};

cleverapps.splitToChunks = function (array, chunks) {
    var batch = Math.ceil(array.length / chunks);
    var result = [];
    while (array.length > 0) {
        result.push(array.splice(0, batch));
    }
    return result;
};

cleverapps.splitToBatches = function (array, batch) {
    var result = [];
    while (array.length > 0) {
        result.push(array.splice(0, batch));
    }
    return result;
};

cleverapps.sign = function (value) {
    if (value < 0) {
        return -1;
    }
    if (value > 0) {
        return 1;
    }

    return 0;
};

cleverapps.clamp = function (value, min, max) {
    return Math.min(Math.max(min, value), max);
};

cleverapps.splitHalfByWord = function (string) {
    var middle = Math.floor(string.length / 2);
    var index = -1;
    for (var i = 0; i <= middle && index === -1; i++) {
        if (string.charAt(middle - i) === " ") {
            index = middle - i;
        } else if (string.charAt(middle + i) === " ") {
            index = middle + i;
        }
    }
    return index === -1 ? [string] : [string.substr(0, index), string.substr(index + 1)];
};

var OverridesContainer = function () {
    this.overrides = [];
};

OverridesContainer.prototype.override = function (target, key, value) {
    if (target) {
        var oldValue = target[key];
        target[key] = value;

        this.overrides.push({
            target: target,
            key: key,
            value: value,
            oldValue: oldValue
        });
    }
};

OverridesContainer.prototype.unoverride = function () {
    var overrides = this.overrides;
    this.overrides = [];

    overrides.forEach(function (override) {
        override.target[override.key] = override.oldValue;
    });
};

cleverapps.RUB_DISCOUNTED_RATE = 20;
cleverapps.RUB_YOOKASSA_RATE = 50;
cleverapps.WECHAT_PAYMENTS_RATE = 5;

cleverapps.EXCHANGE_RATES = {
    EUR: 1,
    RUB: 90,
    GBP: 0.85,
    DEM: 1.7,
    JPY: 132,
    INR: 80,
    FRF: 6.5,
    CAD: 1.3,
    AUD: 1.45,
    BEF: 40.6,
    CNY: 7.13,
    SGD: 1.34
};

cleverapps.NO_ACTION = "no_action";

cleverapps.ONE_HOUR = cleverapps.parseInterval("1 hour");
cleverapps.ONE_DAY = cleverapps.parseInterval("1 day");

cleverapps.colorToHex = function (color) {
    // eslint-disable-next-line no-bitwise
    return ((color.r << 16) + (color.g << 8) + (color.b | 0));
};

cleverapps.hashCode = function (str) {
    if (str === undefined || str === null || typeof str === "number" && isNaN(str)) {
        return 0;
    }

    str += "";

    var hashCode = 0;

    for (var i = 0; i < str.length; i++) {
        // eslint-disable-next-line no-bitwise
        hashCode = ((hashCode << 5) - hashCode) + str.charCodeAt(i);
    }

    return hashCode;
};

cleverapps.reverseObject = function (obj) {
    var result = {};

    for (var key in obj) {
        var value = obj[key];

        if (result[value] !== undefined) {
            throw "Not unique key - " + key;
        }

        result[value] = key;
    }

    return result;
};

cleverapps.validateEmail = function (email) {
    // https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
};

cleverapps.fromBit = function (bits) {
    if (!bits) {
        return [];
    }

    bits = cleverapps.toArray(bits);

    var arr = [], id;
    bits.forEach(function (bit, index) {
        id = cleverapps.SYNCED_BITS * index;
        while (bit) {
            if (bit % 2) {
                arr.push(id);
            }
            bit = Math.floor(bit / 2);
            id++;
        }
    });
    return arr;
};

cleverapps.toBit = function (arr, syncedBits) {
    syncedBits = syncedBits || cleverapps.SYNCED_BITS;

    var length = Math.ceil(syncedBits / cleverapps.SYNCED_BITS);
    var bits = cleverapps.arrayFill(length, 0);
    var slot, maxSlot = 0, bit;

    arr.forEach(function (id) {
        if (id >= syncedBits) {
            cleverapps.throwAsync(id + " is bigger then " + syncedBits);
            return;
        }

        bit = id % cleverapps.SYNCED_BITS;
        slot = (id - bit) / cleverapps.SYNCED_BITS;
        bits[slot] += Math.pow(2, bit);

        maxSlot = Math.max(slot, maxSlot);
    });

    return length === 1 || maxSlot === 0 ? bits[0] : bits.slice(0, maxSlot + 1);
};

cleverapps.listToBit = function (list) {
    var res = {};
    for (var code in list) {
        var bit = cleverapps.toBit(Object.keys(list[code]));
        if (bit !== 0) {
            res[code] = bit;
        }
    }

    return res;
};

cleverapps.listFromBit = function (list) {
    var res = {};
    for (var code in list) {
        if (typeof list[code] === "object") {
            // old format
            res[code] = list[code];
        } else {
            res[code] = cleverapps.createSet(cleverapps.fromBit(list[code]));
        }
    }
    return res;
};

cleverapps.countPendingRequests = function (promise) {
    var clearFreezeTimeout = function () {
        if (cleverapps.pendingRequestsFreezeTimeout !== undefined) {
            clearTimeout(cleverapps.pendingRequestsFreezeTimeout);
            delete cleverapps.pendingRequestsFreezeTimeout;
        }
    };

    if (!cleverapps.pendingRequests) {
        clearFreezeTimeout();

        cleverapps.pendingRequestsFreezeTimeout = new cleverapps.LongTimeout(function () {
            if (cleverapps.pendingRequests) {
                cleverapps.pendingRequests = 0;
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.PENDING_REQUESTS_FREEZE);
            }

            clearFreezeTimeout();
        }, cleverapps.parseInterval("5 minutes"));
    }

    cleverapps.pendingRequests = (cleverapps.pendingRequests || 0) + 1;

    var decPendingRequests = function () {
        cleverapps.pendingRequests--;

        if (cleverapps.pendingRequests <= 0) {
            cleverapps.pendingRequests = 0;
            clearFreezeTimeout();
        }
    };

    var obj = {};

    promise.then(function () {
        decPendingRequests();
        obj.then && obj.then.apply(this, arguments);
    }).catch(function () {
        decPendingRequests();
        obj.catch && obj.catch.apply(this, arguments);
    });

    var wrapper = {
        then: function (f) {
            obj.then = f;
            return wrapper;
        },
        catch: function (f) {
            obj.catch = f;
            return wrapper;
        }
    };
    return wrapper;
};

cleverapps.fakePromise = function () {
    var promise = function () {
        return promise;
    };

    promise.then = function () {
        return promise;
    };

    promise.catch = function () {
        return promise;
    };

    return promise;
};

cleverapps.getCanvas = function () {
    return document.getElementById("GameCanvas");
};

cleverapps.copyToClipboard = function (value, callback) {
    callback = callback || function () {
        cleverapps.notification.create("Copied to clipboard");
    };

    var onError = function () {
        setTimeout(function () {
            var text = document.createElement("textArea");
            text.value = value;
            text.style.hidden = true;
            document.body.appendChild(text);

            try {
                text.select();
                document.execCommand("copy");
                callback();
            } catch (err) {
                console.log("Couldn't copy text to clipboard:", value);
            }
            document.body.removeChild(text);
        }, 0);
    };

    try {
        if (cleverapps.platform.oneOf(Wechat)) {
            wx.setClipboardData({
                data: value,
                success: function () {
                    callback();
                },
                fail: function (err) {
                    console.log("wx.setClipboardData fail", err);
                }
            });
        } else {
            window.navigator.clipboard.writeText(value).then(callback).catch(onError);
        }
    } catch (e) {
        onError();
    }
};

cleverapps.isNodeOrElement = function (o) {
    return (
        typeof Node === "object" ? o instanceof Node
            : o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
    ) || (
        typeof HTMLElement === "object" ? o instanceof HTMLElement
            : o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
    );
};

cleverapps.whenGameActiveListener = function (listener) {
    return function () {
        var self = this;
        var args = arguments;

        cleverapps.whenGameActive(function () {
            listener.apply(self, args);
        });
    };
};

cleverapps.whenGameActive = function (callback) {
    if (!cc.game.isPaused()) {
        callback();
    } else {
        cleverapps.timeouts.setTimeout(callback, 0);
    }
};

cleverapps.cutStringsReplacer = function (key, value) {
    if (typeof value === "string" && value.length > 50) {
        value = value.slice(0, 50) + "...";
    }
    return value;
};

cleverapps.ZERO_DATE = (new Date("2020-01-01")).getTime();
cleverapps.SYNCED_BITS = 52;
cleverapps.EMPTY_FUNCTION = function () {};

if (typeof cc !== "undefined" && cleverapps.config.debugMode && cleverapps.getRequestParameters(window.location.hash).dropDebugMode !== undefined) {
    cleverapps.config.debugMode = false;
}

if (typeof cc === "undefined") {
    module.exports = cleverapps;
}
