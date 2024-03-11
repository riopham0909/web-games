/**
 * Created by andrey on 31.01.2024
 */

var MultiAdsPlugin = function () {
    this.plugins = {
        ads_msstart: new MSStartAds(),
        ads_google: new GoogleWebAds()
    };

    AdsPlugin.call(this, {
        cantLoadAndPlayInParallel: true
    });

    Object.keys(this.plugins).forEach(function (code) {
        var plugin = this.plugins[code];
        cleverapps.platform.registerPlugin(code, function () {
            return plugin;
        });

        plugin._onCancel = function () {
            this._onCancel();
        }.bind(this);

        plugin.onChangeLoaderState = function (name) {
            this.onPluginChangeLoaderState(code, name);
        }.bind(this);

        plugin.onChangeVideoState = function (name) {
            this.onPluginChangeVideoState(code, name);
        }.bind(this);
    }, this);

    this._cacheCallbacks = {};
    this._playCallbacks = {};
};

MultiAdsPlugin.prototype = Object.create(AdsPlugin.prototype);
MultiAdsPlugin.prototype.constructor = MultiAdsPlugin;

MultiAdsPlugin.prototype._connect = function (callback) {
    for (var code in this.plugins) {
        if (cleverapps.platform.isConnected(code)) {
            callback(Platform.STATUS_CONNECTED);
            return;
        }

        cleverapps.platform.once("changeStatus:" + code, function (status) {
            if (status === Platform.STATUS_CONNECTED) {
                callback(Platform.STATUS_CONNECTED);
            }
        });
    }
};

MultiAdsPlugin.prototype.onPluginChangeLoaderState = function (code, name) {
    // console.log("Ads onPluginChangeLoaderState " + code + " - " + name);
    if (this.plugins[code].loaderState[name] === AdsPlugin.LOADER_STATE.READY) {
        this._cacheCallbacks[name]();
    }
};

MultiAdsPlugin.prototype._cache = function (name, callback) {
    this._cacheCallbacks[name] = cleverapps.once(function () {
        console.log("Ads cached - " + name);
        callback(AdsPlugin.CODE_SUCCEED, true);
    });

    for (var code in this.plugins) {
        var plugin = this.plugins[code];
    
        if (!cleverapps.platform.isConnected(code)) {
            continue;
        }

        if (plugin.isAvailable(name) && plugin.expired(name)) {
            plugin.reset(name);
        }

        if (plugin.isAvailable()) {
            this._cacheCallbacks[name](code);
        } else {
            plugin.cache(name);
        }
    }
};

MultiAdsPlugin.prototype.onPluginChangeVideoState = function (code, name) {
    // console.log("Ads onPluginChangeVideoState " + code + " - " + name);
    if (this.plugins[code].videoState[name] === AdsPlugin.VIDEO_STATE.STOP) {
        this._playCallbacks[name]();
    }
};

MultiAdsPlugin.prototype.getPlayReadyPlugin = function (name) {
    for (var code in this.plugins) {
        var plugin = this.plugins[code];
        if (cleverapps.platform.isConnected(code) && plugin.isAvailable(name)) {
            return plugin;
        }
    }
};

MultiAdsPlugin.prototype.playAd = function (name) {
    this._playPlugin = this.getPlayReadyPlugin(name);

    if (!cleverapps.platform.isConnected(Platform.ADS) || this.adIsRunning(name) || !this._playPlugin) {
        this._onCancel();
        return;
    }

    console.log("Ads play - " + this._playPlugin.code);

    this.setPlaying(name);
    this._playCallbacks[name] = cleverapps.once(this.setFinished.bind(this, name));

    this._playPlugin.playAd(name);

    this.reset(name);
};

MultiAdsPlugin.prototype.getECPM = function () {
    return this._playPlugin ? this._playPlugin.getECPM() : 0;
};

MultiAdsPlugin.isAppropriate = function () {
    return MSStartAds.isAppropriate() && cleverapps.config.adsense.client
        && cleverapps.config.debugMode;
};