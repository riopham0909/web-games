/**
 * Created by Andrey Popov on 5/5/21
 */

cleverapps.XsollaSocial = function () {
    console.log("Choosing Xsolla");
    this.accessToken = undefined;
    this.user = undefined;

    cleverapps.Social.call(this);
};

cleverapps.XsollaSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.XsollaSocial.prototype.constructor = cleverapps.XsollaSocial;

cleverapps.XsollaSocial.prototype._connect = function (callback) {
    var div = document.createElement("div");
    div.id = "xsollaLoginLayout";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.left = "0px";
    div.style.top = "0px";
    div.style.position = "absolute";
    div.style.backgroundColor = "#00000050";
    div.style.zIndex = "1000000000";
    div.style.visibility = "hidden";
    document.body.appendChild(div);

    this.accessToken = cleverapps.platform.dataLoader.load(SimpleDataLoader.TYPES.XSOLLA_ACCESS_TOKEN);
    if (this.accessToken) {
        this.loadUser(function (code) {
            if (code === cleverapps.CODE_SUCCEED) {
                callback(Platform.STATUS_CONNECTED);
            } else {
                this.accessToken = undefined;
                cleverapps.platform.dataLoader.remove(SimpleDataLoader.TYPES.XSOLLA_ACCESS_TOKEN);
                callback(Platform.STATUS_DISCONNECTED);
            }
        }.bind(this));
    } else {
        callback(Platform.STATUS_CONNECTED);
    }
};

cleverapps.XsollaSocial.prototype.loadUser = function (callback) {
    cleverapps.RestClient.get(
        "https://login.xsolla.com/api/users/me", 
        {},
        function (response) {
            this.user = response;
            callback(cleverapps.CODE_SUCCEED);
        }.bind(this),
        function () {
            callback(cleverapps.CODE_FAILED);
        },
        {
            authorization: "Bearer " + this.accessToken
        }
    );
};

cleverapps.XsollaSocial.prototype._login = function (callback) {
    var initZ2, checkInterval;

    var onPopupClosed = function () {
        window.removeEventListener("message", initZ2, false);
        document.getElementById("xsollaLoginLayout").style.visibility = "hidden";
        clearInterval(checkInterval);
    };

    initZ2 = function (e) {
        if (e.origin !== location.origin) {
            return;
        }
        this.accessToken = e.data;
        cleverapps.platform.dataLoader.save(SimpleDataLoader.TYPES.XSOLLA_ACCESS_TOKEN, this.accessToken);
        onPopupClosed();

        this.loadUser(callback);
    }.bind(this);

    var myWidth = Math.max(800, screen.width * 0.5);
    var myHeight = Math.max(600, screen.height * 0.6);
    var left = (screen.width - myWidth) / 2;
    var top = (screen.height - myHeight) / 2;
    var url = location.href;
    url = url.substr(0, url.lastIndexOf("/") + 1) + "xsolla-login.html";

    var popup = window.open(url, "popup", "toolbar=no, location=no, directories=no, status=no, menubar=no, copyhistory=no, width=" + myWidth + ", height=" + myHeight + ", top=" + top + ", left=" + left);

    if (popup) {
        window.addEventListener("message", initZ2, false);
        document.getElementById("xsollaLoginLayout").style.visibility = "visible";
        checkInterval = setInterval(function () {
            if (popup.closed) {
                onPopupClosed();
                callback();
            }
        }, 100);
    } else {
        callback();
    }
};

cleverapps.XsollaSocial.prototype._getUserID = function () {
    return this.user ? this.user.id : undefined;
};

cleverapps.XsollaSocial.prototype.isLoggedIn = function () {
    return this.user;
};

cleverapps.XsollaSocial.prototype.getAccessToken = function () {
    return "XS_" + (this.accessToken || 0);
};

cleverapps.XsollaSocial.prototype._aboutMe = function (callback) {
    cleverapps.RestClient.get(
        "https://login.xsolla.com/api/users/me/social_providers", 
        {},
        function (data) {
            if (data && data.length > 0) {
                data = data[0];

                callback({
                    id: cleverapps.platform.getUserID(), // data.social_id,
                    name: data.full_name,
                    first_name: data.nickname,
                    picture: {
                        data: {
                            url: data.picture
                        }
                    }
                });
            } else {
                console.log("Error: " + JSON.stringify(data));
            }
        },
        function () {
            console.log("Failed loading aboutMe");
        }, 
        {
            authorization: "Bearer " + this.accessToken
        }
    );
};