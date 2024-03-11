/**
 * Created by slava on 4/12/17.
 */

cleverapps.RestClient = { 
    getBase: function () {
        return (cc.sys.isNative
            || cleverapps.platform && cleverapps.platform.oneOf(Instant, Mobage, AndroidPlatform, GDCom, Huzcom, Pliega, Rustore, Yandex, Microsoft, Mygames, WortalPlatform, Samsung))
            ? cleverapps.config.deployment : "";
    },

    standsWeb: function (url) {
        url = url || "";
        return cleverapps.config.deployment + url;
    },

    standsRest: function (url) {
        url = url || "";
        return cleverapps.config.deployment + "/" + cleverapps.config.name + "-rest" + url;
    },

    getDefaultTimeout: function () {
        return cleverapps.platform && cleverapps.platform.oneOf(Wechat) ? 20000 : 10000;
    },

    sendRaw: function (httpMethod, path, rawData) {
        var oReq = (cc.sys.isNative) ? cc.loader.getXMLHttpRequest() : new XMLHttpRequest();

        var fullPath = cleverapps.RestClient.getBase() + path;
        oReq.open(httpMethod, fullPath);
        oReq.timeout = this.getDefaultTimeout();

        oReq.send(rawData);
    },

    createQueryString: function (data) {
        var dataItems = [];
        for (var key in data) {
            dataItems.push(key + "=" + (typeof data[key] === "string" ? data[key] : JSON.stringify(data[key])));
        }

        return dataItems.join("&");
    },

    get: function (path, data, onSuccess, onError, options) {
        this.send(cleverapps.RestClient.METHODS.GET, path, data, onSuccess, onError, options);
    },

    post: function (path, data, onSuccess, onError, options) {
        this.send(cleverapps.RestClient.METHODS.POST, path, data, onSuccess, onError, options);
    },

    send: function (httpMethod, path, data, onSuccess, onError, options) {
        options = options || {};

        if (cleverapps.flags && cleverapps.flags.norest && !options.ignoreNoRest) {
            return;
        }

        data = data || {};
        var timeout = options.timeout || this.getDefaultTimeout();
        var reqListener;

        var oReq = cc.loader.getXMLHttpRequest();

        var errorTimeout = setTimeout(function () {
            reqListener.call({
                status: -1,
                responseText: "our timeout"
            });
        }, timeout + 1000);

        reqListener = function () {
            if (errorTimeout !== undefined) {
                clearTimeout(errorTimeout);
                errorTimeout = undefined;
            }
            if (this.status >= 200 && this.status < 300) {
                if (onSuccess) {
                    var json;
                    try {
                        json = this.responseText && JSON.parse(this.responseText);
                    } catch (e) {
                        throw ("parse json error: path - " + path + ", message - " + e.message);
                    }
                    onSuccess(json);
                }
            } else {
                if (this.responseText) {
                    this.errorMessage = (this.responseText.split("\n")[0] || "").trim();
                }

                console.log("XMLHttpRequest FAILED", httpMethod, this.status, this.errorMessage, fullPath);

                if (onError) {
                    onError(this);
                }
            }

            onSuccess = function () {};
            onError = function () {};
        }.bind(oReq);

        oReq.ontimeout = reqListener;
        oReq.onload = reqListener;
        oReq.onerror = reqListener;
        oReq.onabort = reqListener;

        var fullPath = path;
        if (!fullPath.startsWith("http") && !options.fullPath) {
            fullPath = cleverapps.RestClient.getBase() + cleverapps.config.restApiURL + path;
        }
        oReq.open(httpMethod, fullPath);
        oReq.timeout = timeout;
        if (!options.noContentType) {
            oReq.setRequestHeader("Content-Type", "application/json");
        }

        if (options.authorization) {
            oReq.setRequestHeader("authorization", options.authorization);
        } else {
            oReq.setRequestHeader("Cache-Control", "no-cache");
        }

        oReq.send(options.noContentType ? data : JSON.stringify(data));
    },

    METHODS: {
        GET: "GET",
        POST: "POST"
    }
};
