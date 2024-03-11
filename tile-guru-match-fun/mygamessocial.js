/**
 * Created by spepa on 23.08.2022
 */

cleverapps.MygamesSocial = function () {
    console.log("Choosing mygames social");

    cleverapps.Social.call(this);
};

cleverapps.MygamesSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.MygamesSocial.prototype.constructor = cleverapps.MygamesSocial;

cleverapps.MygamesSocial.prototype._connect = function (callback) {
    var params = new URLSearchParams(window.location.search);

    var ourParams = new URLSearchParams();
    ourParams.set("uid", "" + params.get("sz_pers_id"));
    ourParams.set("otp", "" + params.get("sz_token"));

    cleverapps.RestClient.get("/mygames/auth?" + ourParams.toString(), {}, function (res) {
        if (res.error) {
            console.log("Auth error", res);
            callback(Platform.STATUS_DISCONNECTED);
        } else {
            this.user = cleverapps.MygamesSocial.formatUserData(res);
            callback(Platform.STATUS_CONNECTED);
        }
    }.bind(this), function (err) {
        console.log("Auth error", err);
        callback(Platform.STATUS_DISCONNECTED);
    });
};

cleverapps.MygamesSocial.prototype.isLoggedIn = function () {
    return this.user !== undefined;
};

cleverapps.MygamesSocial.prototype.getAccessToken = function () {
    return "mygames";
};

cleverapps.MygamesSocial.prototype._getUserID = function () {
    return this.user && this.user.id;
};

cleverapps.MygamesSocial.prototype._shareDialog = function (data, callback) {
    var postData = {
        uid: cleverapps.platform.getUserID(),
        title: data.name,
        img: data.picture
    };

    cleverapps.RestClient.post("/mygames/share", postData, function (res) {
        if (res.status === "ok") {
            callback(cleverapps.CODE_SUCCEED);
        } else {
            callback(cleverapps.CODE_FAILED);
        }
    }, function () {
        callback(cleverapps.CODE_FAILED);
    });
};

cleverapps.MygamesSocial.prototype._aboutMe = function (callback) {
    if (this.user) {
        callback(this.user);
    }
};

cleverapps.MygamesSocial.formatUserData = function (data) {
    return {
        id: "" + data.uid,
        name: data.nick,
        first_name: data.nick,
        slug: data.slug,
        picture: {
            data: {
                url: data.avatar
            }
        }
    };
};