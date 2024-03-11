/**
 * Created by mac on 2019-02-09
 */

cleverapps.Information = function () {
    this.data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.INFORMATION);
    if (this.data === undefined) {
        this.data = {};
    }

    this.diff = {};
};

cleverapps.Information.prototype.onChangeUserId = function () {
    this.diff = this.data;
    this.update();
};

cleverapps.Information.prototype.reportMaxTextureSize = function () {
    if (typeof gl !== "undefined") {
        var maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this.setKeyValue("maxTextureSize", maxTextureSize);
    }
};

cleverapps.Information.prototype.reportPhone = function () {
    var sources = {};
    sources[cc.sys.OS_ANDROID] = { avatar: "#avatars/android_avatar.png", name: "Android" };
    sources[cc.sys.OS_IOS] = { avatar: "#avatars/ios_avatar.png", name: "iOS" };

    if (sources[cc.sys.os] && cc.sys.isNative) {
        var socialHasAvatar = cleverapps.social.isLoggedIn() && cleverapps.social.getCode() !== "applesocial";
        if (!this.data.avatar && !socialHasAvatar) {
            cleverapps.info.setKeyValue("avatar", sources[cc.sys.os].avatar);
        }
        if (!this.data.name && !cleverapps.social.isLoggedIn()) {
            cleverapps.info.setKeyValue("name", sources[cc.sys.os].name + "_" + cleverapps.platform.getUserID().substr(-3));
        }
    }

    if (cleverapps.platform.oneOf(GDCom)) {
        cleverapps.info.setKeyValue("avatar", "#avatars/game_distribution.png");
    }
};

cleverapps.Information.prototype.save = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.INFORMATION, this.data);
};

cleverapps.Information.prototype.getValue = function (key) {
    return this.data[key];
};

cleverapps.Information.prototype.setKeyValue = function (key, value, force) {
    if (JSON.stringify(this.data[key]) !== JSON.stringify(value) || force) {
        this.data[key] = value;
        this.diff[key] = value;
        this.update();
    }
};

cleverapps.Information.prototype.update = function () {
    this.save();
    this._updateInner();
};

cleverapps.Information.prototype._updateInner = cleverapps.accumulate(5000, function () {
    console.log("Sending information: " + JSON.stringify(this.diff));

    cleverapps.RestClient.post("/info/" + encodeURIComponent(cleverapps.platform.getUserID()), this.diff, function () {
        // console.log("Success updating info: " + cleverapps.platform.getUserID() + " = " + JSON.stringify(data));
    }, function () {
        // console.log("Failed updating info: " + cleverapps.platform.getUserID() + " = " + JSON.stringify(data));
    });

    this.diff = {};
});

cleverapps.Information.prototype.reportUserAgent = function () {
    var name;
    var version;

    if (cleverapps.platform.oneOf(AndroidBase, Apple)) {
        name = cleverapps.platform.device.name;
        version = cleverapps.platform.device.version;
    } else {
        var uaParser = new UAParser();
        var result = uaParser.getResult(navigator.userAgent);

        name = result.browser.name;
        version = result.browser.major;
    }

    this.setKeyValue("useragent", {
        browser: name,
        version: version
    });
};

cleverapps.Information.prototype.reportAppVersion = function () {
    this.setKeyValue("appversion", {
        version: cleverapps.config.version,
        source: cleverapps.platform.source
    });
};

cleverapps.Information.prototype.reportSysLanguage = function () {
    this.setKeyValue("syslanguage", cc.sys.language);
};
