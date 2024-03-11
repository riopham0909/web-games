/**
 * Created by vladislav on 9/6/2022
 */

var Platform = function (options, source) {
    console.log("Choosing " + source + " platform");

    cleverapps.EventEmitter.call(this);

    this._createLocalStorage();

    this.config = options.config;

    SimpleDataLoader.INIT_TYPES(this.config.name + this.getLocalStoragePreffix());

    this.dataLoader = options.dataLoader || new SimpleDataLoader();
    this.source = source;

    this.status = {};
    this.status[Platform.PLATFORM] = undefined;
    this.plugins = {};
    this.pluginCreators = {};

    this.callbacks = {};
    this.nativeEventListeners = {};

    if (!this.oneOf(Amazon, AndroidPlatform, IOS, MacOS, FacebookCanvas, GPG, Instant, Microsoft, Ton, WortalPlatform, Mygames, Xiaomi) && this.getLocalStoragePreffix() === "") {
        throw "Not specified local storage prefix";
    }

    this.info = new PlatformInfo(source);

    this.device = {};
    if (cleverapps.isLocalhost()) {
        this.device.idfa = "localhostIDFA";
    }

    this.initGameEvents();
};

Platform.prototype = Object.create(cleverapps.EventEmitter.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype._createLocalStorage = function () {
    try {
        this.localStorage = window.localStorage;
        this.localStorage.setItem("storage", "");
        this.localStorage.removeItem("storage");
    } catch (e) {
        var warn = function () {
            console.warn("Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option");
        };
        this.localStorage = {
            getItem: warn,
            setItem: warn,
            removeItem: warn,
            clear: warn
        };
    }
};

Platform.prototype.getHelpUrl = function () {
    switch (this.source) {
        case "web_ok":
            return "https://ok.ru/group/" + cleverapps.config.ok.groupId;
        case "mobile_ok":
            return "https://m.ok.ru/group/" + cleverapps.config.ok.groupId;
        case "web_vk":
            return "https://vk.com/" + cleverapps.config.vk.groupId;
        case "mobile_vk":
            return "https://m.vk.com/" + cleverapps.config.vk.groupId;
        case "web_mm":
            return "https://my.mail.ru/community/" + cleverapps.config.mm.groupId;
        case "mobile_mm":
            return "https://m.my.mail.ru/community/" + cleverapps.config.mm.groupId;
        case "mbga":
            return "http://yahoo-mbga.jp/group/" + cleverapps.config.mbga.groupId;
        case "sp_mbga":
            return "http://sp.mbga.jp/_grp_view?g=" + cleverapps.config.mbga.groupId;
        case "draugiem":
            return "https://www.draugiem.lv/" + cleverapps.config.draugiem.groupId;
        case "fotostrana":
            return "https://fotostrana.ru/public/" + cleverapps.config.fotostrana.groupId;
        default:
            if (cleverapps.config.instant.groupId) {
                return "https://www.facebook.com/" + cleverapps.config.instant.groupId;
            }
            return "https://www.facebook.com/" + cleverapps.config.facebook.groupId;
    }
};

Platform.prototype.getGameUrl = function (source) {
    return Platform.guessPlatformURL(cleverapps.config, cleverapps.config.debugMode, source || this.source);
};

Platform.prototype.getRateUrl = function () {
    switch (this.source) {
        case "test":
            return Platform.guessPlatformURL(cleverapps.config, true, "android");
        case "android":
            return "market://details?id=" + cleverapps.config.android.package;
        case "amazon":
            return "amzn://apps/android?p=" + cleverapps.config.amazon.package;
        case "macos":
        case "ios":
            return "itms-apps://itunes.apple.com/app/id" + cleverapps.config.ios.id;
    }
};

Platform.prototype.getExternalUrl = function (url) {
    if (url[0] === "/") {
        url = url.substr(1);
    }

    if (this instanceof TestPlatform || this instanceof Instant) {
        return url;
    }

    return cleverapps.config.deployment + "/" + url;
};

Platform.prototype.followOfficialPage = function () {
    if (cleverapps.platform.isConnected(Platform.PLATFORM)) {
        this._followOfficialPage();
    }
};

Platform.prototype._followOfficialPage = function () {};

Platform.prototype.showOfficialPage = function () {
    cc.sys.openURL(this.getHelpUrl());
};

Platform.prototype.canNativeInvite = function () {
    return this instanceof Apple || this instanceof AndroidBase;
};

Platform.prototype.inviteFriends = function (callback) {
    var options = {
        message: Messages.get("InviteFriends.message"),
        title: Messages.get(cleverapps.config.title)
    };

    if (this.canNativeInvite()) {
        this.callNative("MessagesPlugin.inviteFriends", {
            title: options.title,
            message: options.message,
            link: this.getExternalUrl("res/applink.html")
        }, callback);

        return;
    }

    cleverapps.social.checkConnection(function () {
        cleverapps.social.inviteFriends(options, callback);
    }, function () {
        callback(cleverapps.CODE_FAILED);
    });
};

Platform.prototype.registerPlugin = function (name, creatorFunc) {
    this.pluginCreators[name] = creatorFunc;

    this.plugins[name] = creatorFunc();

    this.status[name] = undefined;
};

Platform.prototype.updatePlugin = function (name) {
    var newPlugin = this.pluginCreators[name]();
    if (newPlugin === this.plugins[name]) {
        return;
    }

    this.plugins[name] = newPlugin;

    this.status[name] = undefined;

    this.connect();
};

Platform.prototype.isConnected = function (plugin) {
    return this.status[plugin] === Platform.STATUS_CONNECTED;
};

Platform.prototype.setStatus = function (plugin, status) {
    status = status || Platform.STATUS_DISCONNECTED;

    if (this.status[plugin] === status) {
        return;
    }

    console.log("Platform.setStatus", plugin, status);

    this.status[plugin] = status;

    this.trigger("changeStatus:" + plugin, status);
};

Platform.prototype.disconnect = function () {
    this.setStatus(Platform.PLATFORM, Platform.STATUS_DISCONNECTED);

    for (var name in this.plugins) {
        this.disconnectPlugin(name);
    }
};

Platform.prototype.disconnectPlugin = function (name) {
    var plugin = this.plugins[name];

    if (!plugin) {
        return;
    }

    this.setStatus(name, Platform.STATUS_DISCONNECTED);
};

Platform.prototype._loadUserId = function () {
    this._userID = this.dataLoader.load(SimpleDataLoader.TYPES.USER_ID);
    if (!this._userID) {
        this.setUserID(this.generateTmpId());
    }
};

Platform.prototype.setUserID = function (id) {
    if (this._userID === id) {
        return;
    }

    console.log("Platform.setUserID", this._userID, id);

    var oldId = this._userID;

    this._userID = id;

    this.dataLoader.save(SimpleDataLoader.TYPES.USER_ID, this._userID);

    this.trigger("userIdChanged", {
        oldId: oldId,
        newId: id
    });
};

Platform.prototype.getUserID = function () {
    return this._userID;
};

Platform.prototype.initialize = function (callback) {
    this._initialize(function () {
        this._loadUserId();

        callback();
    }.bind(this));
};

Platform.prototype._initialize = function (callback) {
    callback();
};

Platform.prototype.start = function () {
    this.started = true;

    this.connect();
};

Platform.prototype.connect = function () {
    if (!this.started) {
        return;
    }

    if (this.connecting) {
        return;
    }

    var statuses = "";
    for (var name in this.status) {
        statuses += " " + name + ":" + this.status[name];
    }
    console.log("Platform.connect" + statuses);

    if (this.isConnected(Platform.PLATFORM)) {
        this._connectPlugins();
    } else {
        this.connecting = true;

        this._connect(cleverapps.waitNoMore(Platform.WAIT_CONNECT_TIMEOUT, function (status) {
            this.connecting = false;

            this.setStatus(Platform.PLATFORM, status);

            this._connectPlugins();
        }.bind(this)));
    }
};

Platform.prototype._connectPlugins = function () {
    var connectPlugin = function (name) {
        var plugin = this.plugins[name];

        if (!plugin || this.isConnected(name) || plugin.connecting) {
            return;
        }

        if (this.isConnected(Platform.PLATFORM) || plugin.withSdk) {
            this.connectPlugin(name);
        } else {
            this.setStatus(name, Platform.STATUS_DISCONNECTED);
        }
    }.bind(this);

    for (var name in this.plugins) {
        connectPlugin(name);
    }
};

Platform.prototype.connectPlugin = function (name) {
    var plugin = this.plugins[name];

    plugin.connect(function (status) {
        this.setStatus(name, status);
    }.bind(this));
};

Platform.prototype._connect = function (callback) {
    callback(Platform.STATUS_CONNECTED);
};

Platform.prototype.generateTmpId = function () {
    return "__" + Math.floor(Math.random() * 1000000000000000);
};

Platform.prototype.haveTmpId = function () {
    return Platform.isTmpId(this._userID);
};

Platform.isTmpId = function (id) {
    return id && id.length >= 2 && id.substr(0, 2) === "__";
};

Platform.prototype.haveDeviceId = function () {
    return Platform.isDeviceId(this._userID);
};

Platform.isDeviceId = function (id) {
    var deviceId = cleverapps.platform.getDeviceId();

    return deviceId && id === deviceId;
};

Platform.prototype.getDeviceId = function () {

};

Platform.prototype.canReview = function () {
    return false;
};

Platform.prototype.getLocalStoragePreffix = function () {
    return "";
};

Platform.prototype.getSuggestedLanguage = function () {
    return [PlatformInfo.LANGUAGE_ENGLISH];
};

Platform.prototype.needWindowForLogin = function () {
    return false;
};

Platform.prototype.requestReview = function () {
    if (cleverapps.platform.isConnected(Platform.PLATFORM)) {
        this._requestReview();
    }
};

Platform.prototype._requestReview = function () {

};

Platform.prototype.canCreateShortcut = function () {
    if (!this.isConnected(Platform.PLATFORM)) {
        return false;
    }

    return this._canCreateShortcut();
};

Platform.prototype._canCreateShortcut = function () {
    return false;
};

Platform.prototype.createShortcut = function () {

};

Platform.prototype.reportScore = function (score, callback) {
    if (cleverapps.platform.isConnected(Platform.PLATFORM)) {
        this._reportScore(score, callback);
    } else {
        callback();
    }
};

Platform.prototype._reportScore = function (score, callback) {
    callback();
};

Platform.prototype.getCurrentTournamentId = function (callback) {
    callback();
};

Platform.prototype.getAccessToken = function () {

};

Platform.prototype.isFullscreenAvailable = function () {
    if (this.info.isNative || this.info.isMobile || cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL || cleverapps.platform.oneOf(Instant)) {
        return false;
    }
    return !!this.getFullscreener();
};

Platform.prototype.getFullscreener = function () {
    var elem = document.documentElement;
    var fullscreener = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.msRequestFullscreen || elem.mozRequestFullscreen;
    if (fullscreener) {
        return fullscreener.bind(elem);
    }
};

Platform.prototype.goFullscreen = function () {
    if (this.isFullScreen()) {
        return;
    }

    var fullscreener = this.getFullscreener();
    if (fullscreener) {
        fullscreener();
    }
};

Platform.prototype.exitFullscreen = function (callback) {
    if (!this.isFullscreenAvailable() || !this.isFullScreen()) {
        callback && callback();
        return;
    }

    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozExitFullscreen) {
        document.mozExitFullscreen();
    }

    if (callback) {
        setTimeout(callback, 100);
    }
};

Platform.prototype.isFullScreen = function () {
    return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || document.mozFullscreenElemen;
};

Platform.prototype.toggleFullScreen = function () {
    if (this.isFullScreen()) {
        this.exitFullscreen();
    } else {
        this.goFullscreen();
    }
};

Platform.prototype.oneOf = function (arr) {
    return cleverapps.oneOf(this, Array.isArray(arr) ? arr : Array.prototype.slice.call(arguments));
};

Platform._parseChannel = function (param, source) {
    var params = cleverapps.getRequestParameters(source || location.search);
    if (params.custom_args) {
        var customArgs = "";
        try {
            customArgs = decodeURIComponent(params.custom_args);
        } catch (e) {
            cleverapps.throwAsync("calcChannel decodeURIComponent error, params.custom_args - " + params.custom_args);
        }
        if (customArgs.indexOf(param) >= 0) {
            params = cleverapps.getRequestParameters("?" + customArgs);
        }
    }

    return params[param] || "";
};

Platform.prototype.calcChannel = function (callback) {
    if (this.info.isNative) {
        callback("");
    } else {
        callback(Platform._parseChannel("channel"));
    }
};

Platform.prototype.showBannerAd = function (callback) {
    if (cleverapps.platform.isConnected(Platform.PLATFORM)) {
        this._showBannerAd.apply(this, arguments);
    } else {
        callback(cleverapps.CODE_FAILED);
    }
};

Platform.prototype._showBannerAd = function (callback) {
    callback();
};

Platform.prototype.refreshBannerAd = function (callback) {
    if (cleverapps.platform.isConnected(Platform.PLATFORM)) {
        this._refreshBannerAd(callback);
    } else {
        callback(cleverapps.CODE_FAILED);
    }
};

Platform.prototype._refreshBannerAd = function (callback) {
    callback();
};

Platform.prototype.hideBannerAd = function (callback) {
    if (cleverapps.platform.isConnected(Platform.PLATFORM)) {
        this._hideBannerAd(callback);
    } else {
        callback(cleverapps.CODE_FAILED);
    }
};

Platform.prototype._hideBannerAd = function (callback) {
    callback();
};

Platform.DecodeWebViewData = function (data) {
    if (data) {
        try {
            return decodeURIComponent(data);
        } catch (e) {
            return data;
        }
    }
    return data;
};

Platform.prototype.nativeEvent = function (name, data) {
    if (this.oneOf(AndroidBase, Apple, Microsoft)) {
        data = Platform.DecodeWebViewData(data);
        data = data && JSON.parse(data);
    }

    console.log("Platform.nativeEvent " + name + ": " + JSON.stringify(data));

    var listener = name.split(".")[0];
    var event = name.split(".")[1];

    if (this.nativeEventListeners[listener]) {
        this.nativeEventListeners[listener](event, data);
    }
};

Platform.prototype.callNative = function (method, options, callback) {
    if (!callback && typeof options === "function") {
        callback = options;
        options = undefined;
    }

    var params = options || {};
    params._hasOptions = Boolean(options);
    params._hasCallback = Boolean(callback);

    // console.log("Platform.callNative " + method + " - " + JSON.stringify(options));
    this.callbacks[method] = callback;
    this._callNative(method, params);
};

Platform.prototype._callNative = function () {

};

Platform.prototype.callCallback = function (method, code, options) {
    if (this.oneOf(AndroidBase, Apple, Microsoft)) {
        options = Platform.DecodeWebViewData(options);
        options = options ? JSON.parse(options) : {};
    }

    console.log("Platform.callCallback " + method + " - " + code + " - " + JSON.stringify(options));

    var callback = this.callbacks[method];
    if (callback) {
        delete this.callbacks[method];
        callback(code, options);
    }
};

Platform.prototype.initGameEvents = function () {
    if (document.hidden) {
        this.pause();
    }

    if (typeof document.hidden !== "undefined") {
        [
            "visibilitychange",
            "webkitvisibilitychange"
        ].forEach(function (event) {
            document.addEventListener(event, function () {
                // console.log("event listener", event, document.hidden);
                if (document.hidden) {
                    this.pause();
                } else {
                    this.resume();
                }
            }.bind(this), false);
        }.bind(this));
    }

    window.addEventListener("pagehide", function () {
        // console.log("event listener", "pagehide");
        this.pause();
    }.bind(this), false);
    window.addEventListener("pageshow", function () {
        // console.log("event listener", "pageshow");
        this.resume();
    }.bind(this), false);

    cc.game.canvas.addEventListener("webglcontextlost", function () {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.ERROR_CONTEXT_LOST);
        cleverapps.playSession.inc(cleverapps.EVENTS.STATS.ERROR_CONTEXT_LOST);

        setTimeout(function () {
            window.location.reload();
        }, 0);
    });

    // resume context after clicks (after autoplay policy pause; after alerts); click event fires before context can be resumed thus we need to delay it
    cc.eventManager.addListener(cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        onTouchBegan: cleverapps.accumulate(100, function () {
            this.resumeAudioContext();
        }.bind(this))
    }), -1);
};

Platform.prototype.resumeAudioContext = function () {
    var context = cc.Audio._context;
    if (!context) {
        return;
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state
    if (context.state === "suspended" || context.state === "interrupted") {
        context.resume();
    }
};

Platform.prototype.isAudioContextRunning = function () {
    var context = cc.Audio._context;
    return context && context.state === "running";
};

Platform.prototype.pause = function () {
    if (cc.game.isPaused() || cleverapps.gameModes && cleverapps.gameModes.noGamePause) {
        return;
    }

    if (this.oneOf(Instant) && this.info.os === PlatformInfo.OS_IOS && this.info.isInApp) {
        return;
    }

    console.log("pause game");

    cc.game.pause();

    if (cleverapps.audio) {
        cleverapps.audio.onChangeMusic();
    }

    if (cc.eventManager) {
        cc.eventManager.dispatchEvent(new cc.EventCustom(cc.game.EVENT_HIDE));
    }
};

Platform.prototype.resume = function () {
    this.resumeAudioContext();

    if (!cc.game.isPaused() || cleverapps.gameModes && cleverapps.gameModes.noGamePause) {
        return;
    }

    console.log("resume game");

    cc.game.resume();

    if (cleverapps.audio) {
        cleverapps.audio.onChangeMusic();
    }

    if (cc.eventManager) {
        cc.eventManager.dispatchEvent(new cc.EventCustom(cc.game.EVENT_SHOW));
    }
};

Platform.WAIT_CONNECT_TIMEOUT = cleverapps.parseInterval("60 seconds");

Platform.SOCIAL = "social";
Platform.PAYMENTS = "payments";
Platform.ADS = "ads";
Platform.PLATFORM = "platform";

Platform.STATUS_CONNECTED = "connected";
Platform.STATUS_DISCONNECTED = "disconnected";
Platform.STATUS_DISABLED = "disabled";