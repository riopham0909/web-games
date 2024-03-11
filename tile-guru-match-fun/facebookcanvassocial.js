/**
 * Created by slava on 4/21/17.
 */

cleverapps.FacebookCanvasSocial = function () {
    console.log("Choosing html5-facebook");

    cleverapps.BaseFB.call(this);
};

cleverapps.FacebookCanvasSocial.prototype = Object.create(cleverapps.BaseFB.prototype);
cleverapps.FacebookCanvasSocial.prototype.constructor = cleverapps.FacebookCanvasSocial;

cleverapps.FacebookCanvasSocial.prototype.isLoggedIn = function () {
    return cleverapps.platform.isConnected(Platform.SOCIAL) && plugin.FacebookAgent.getInstance().isLoggedIn();
};

cleverapps.FacebookCanvasSocial.prototype._getUserID = function () {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        return;
    }

    return plugin.FacebookAgent.getInstance().getUserID();
};

cleverapps.FacebookCanvasSocial.prototype.getAccessToken = function () {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        return;
    }

    return plugin.FacebookAgent.getInstance().getAccessToken();
};

cleverapps.FacebookCanvasSocial.prototype._login = function (callback) {
    cleverapps.platform.exitFullscreen(function () {
        plugin.FacebookAgent.getInstance().login(cleverapps.BaseFB.PERMISSIONS, function () {
            callback();
        });
    });
};

cleverapps.FacebookCanvasSocial.prototype._inviteFriends = function (options, callback) {
    this.request(options, callback);
};

cleverapps.FacebookCanvasSocial.prototype._request = function (options, callback) {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        if (callback) {
            callback(cleverapps.CODE_FAILED);
        }
        return;
    }

    delete options.element;

    if (typeof options.to === "object") {
        options.to = options.to.join(",");
    }

    cleverapps.platform.exitFullscreen(function () {
        plugin.FacebookAgent.getInstance().appRequest(options, callback);
    });
};

cleverapps.FacebookCanvasSocial.prototype._shareDialog = function (data, callback) {
    var link = this.getShareDialogLink(data);

    console.log("share link", link);

    var shareData = {
        dialog: "feedDialog",
        link: link,
        caption: Messages.get(cleverapps.config.title)
    };

    cleverapps.platform.exitFullscreen(function () {
        plugin.FacebookAgent.getInstance().dialog(shareData, callback);
    });
};

cleverapps.FacebookCanvasSocial.prototype.api = function (apiMethod, httpMethod, params, callback) {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        if (callback) {
            callback(cleverapps.CODE_FAILED);
        }

        return;
    }

    params = params || {};
    if (typeof params === "function") {
        callback = params;
        params = {};
    }

    if (!this.isLoggedIn()) {
        console.log("Not logged in!");
        if (callback) {
            callback(cleverapps.CODE_CANCELLED);
        }
        return;
    }

    if (httpMethod === undefined) {
        httpMethod = plugin.FacebookAgent.HttpMethod.GET;
        callback = function () {
        };
    } else if (typeof httpMethod === "function") {
        callback = httpMethod;
        httpMethod = plugin.FacebookAgent.HttpMethod.GET;
    }
    try {
        plugin.FacebookAgent.getInstance().api(apiMethod, httpMethod, params, callback);
    } catch (e) {
        console.log(e);
        if (callback) {
            callback(cleverapps.CODE_CANCELLED);
        }
    }
};

cleverapps.FacebookCanvasSocial.prototype.getName = function () {
    return Messages.get("facebook");
};
