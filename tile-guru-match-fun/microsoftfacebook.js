/**
 * Created by vladislav on 9/14/2022
 */

cleverapps.MicrosoftFacebook = function () {
    console.log("Choosing microsoft-facebook");
    cleverapps.Social.call(this);
};

cleverapps.MicrosoftFacebook.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.MicrosoftFacebook.prototype.constructor = cleverapps.MicrosoftFacebook;

cleverapps.MicrosoftFacebook.prototype._connect = function (callback) {
    this.loadUser();
    callback(Platform.STATUS_CONNECTED);
};

cleverapps.MicrosoftFacebook.prototype.saveUser = function () {
    cleverapps.platform.dataLoader.save(SimpleDataLoader.TYPES.MS_SOCIAL, {
        user: this.user
    });
};

cleverapps.MicrosoftFacebook.prototype.loadUser = function () {
    var data = cleverapps.platform.dataLoader.load(SimpleDataLoader.TYPES.MS_SOCIAL);
    if (data && data.user) {
        this.user = data.user;
    }
};

cleverapps.MicrosoftFacebook.prototype._login = function (callback) {
    var waitWindow = new WaitWindow();

    var fbLoginCallback = function () {
        waitWindow.close();

        callback();

        if (this.isLoggedIn()) {
            this.saveUser();
        }
    }.bind(this);

    cleverapps.platform.callNative("social.FBLogin", {
        FBAppId: cleverapps.config.instant.appId
    }, function (code, response) {
        var authUrl = response && response.authUrl;

        var params = new URLSearchParams(authUrl.substring(authUrl.indexOf("#") + 1));

        if (!params.has("access_token")) {
            fbLoginCallback();
            return;
        }
        this.accessToken = params.get("access_token");

        this.initPlayer(fbLoginCallback);
    }.bind(this));
};

cleverapps.MicrosoftFacebook.prototype.initPlayer = function (callback) {
    var success = function (data) {
        if (data && data.id) {
            this.user = cleverapps.MicrosoftFacebook.formatUserData(data);
            callback(cleverapps.CODE_SUCCEED);
        } else {
            callback(cleverapps.CODE_FAILED);
        }
    }.bind(this);

    var fail = function () {
        callback(cleverapps.CODE_FAILED);
    };

    this.api("me?fields=instant_game_player_id,first_name,name,picture", success, fail);
};

cleverapps.MicrosoftFacebook.prototype.api = function (path, onSuccess, onFail) {
    var host = "https://graph.fb.gg/";
    if (path.indexOf("?") === -1) {
        path += "?";
    }
    var url = host + path + "&access_token=" + this.accessToken;

    cleverapps.RestClient.get(url, {}, function (response) {
        onSuccess(response);
    }, function () {
        onFail && onFail();
    });
};

cleverapps.MicrosoftFacebook.prototype._aboutMe = function (callback) {
    if (this.user) {
        callback(this.user);
    }
};

cleverapps.MicrosoftFacebook.prototype.getAccessToken = function () {
    return "microsoft";
};

cleverapps.MicrosoftFacebook.prototype.isLoggedIn = function () {
    return this.user && this.user.id !== undefined;
};

cleverapps.MicrosoftFacebook.prototype._getUserID = function () {
    return this.user && this.user.id;
};

cleverapps.MicrosoftFacebook.prototype.getName = function () {
    return Messages.get("facebook");
};

cleverapps.MicrosoftFacebook.formatUserData = function (data) {
    return {
        id: "" + data.instant_game_player_id,
        fbId: "" + data.id,
        name: data.name,
        first_name: data.first_name,
        picture: {
            data: {
                url: data.url
            }
        }
    };
};