/**
 * Created by andrey on 29.09.2023
 */

var WebViewLocalStorage = function () {
    this.data = {};
};

WebViewLocalStorage.prototype.initialize = function (callback) {
    cleverapps.platform.callNative("LocalStoragePlugin.initialize", function (code, options) {
        this.data = options.data || {};
        callback();
    }.bind(this));
};

WebViewLocalStorage.prototype.getItem = function (key) {
    return this.data[key];
};

WebViewLocalStorage.prototype.setItem = function (key, value) {
    cleverapps.platform.callNative("LocalStoragePlugin.setItem", {
        key: key,
        value: value
    });

    this.data[key] = value;
};

WebViewLocalStorage.prototype.removeItem = function (key) {
    cleverapps.platform.callNative("LocalStoragePlugin.removeItem", {
        key: key
    });

    delete this.data[key];
};

WebViewLocalStorage.prototype.clear = function () {
    cleverapps.platform.callNative("LocalStoragePlugin.clear");

    this.data = {};
};

WebViewLocalStorage.prototype.getData = function () {
    return this.data;
};
