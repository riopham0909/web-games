/**
 * Created by Andrey Popov on 03.11.2023
 */

var CrazySocial = function () {
    console.log("Choosing crazy");

    cleverapps.Social.call(this);
};

CrazySocial.prototype = Object.create(cleverapps.Social.prototype);
CrazySocial.prototype.constructor = CrazySocial;

CrazySocial.prototype._connect = function (callback) {
    CrazyGames.SDK.user.addAuthListener(function () {
        this.loadUser(function () {
            callback(Platform.STATUS_CONNECTED);
        });
    }.bind(this));
};

CrazySocial.prototype._login = function (callback) {
    CrazyGames.SDK.user.showAuthPrompt(function (error) {
        if (error) {
            console.log("CrazySocial login error:", error);

            callback();
            return;
        }

        this.loadUser(callback);
    }.bind(this));
};

CrazySocial.prototype.loadUser = function (callback) {
    CrazyGames.SDK.user.getUserToken(function (error, token) {
        if (error) {
            console.log("CrazyGames getUserToken error:", error);
            callback(error);
            return;
        }

        cleverapps.RestClient.get(
            "/crazy/decodetoken/" + token,
            {},
            function (response) {
                this.accessToken = token;
                this.user = CrazySocial.formatUserData(response);
                callback();
            }.bind(this),
            function (error) {
                callback(error);
            }
        );
    }.bind(this));
};

CrazySocial.formatUserData = function (userData) {
    if (!userData.userId) {
        return undefined;
    }

    return {
        id: "" + userData.userId,
        name: userData.username,
        first_name: userData.username,
        picture: {
            data: {
                url: userData.profilePictureUrl
            }
        }
    };
};

CrazySocial.prototype._aboutMe = function (callback) {
    callback(this.user);
};

CrazySocial.prototype.markAchievement = function () {
    CrazyGames.SDK.game.happytime();
};

CrazySocial.prototype.getAccessToken = function () {
    return "CRAZY_" + this.accessToken;
};

CrazySocial.prototype.isLoggedIn = function () {
    return Boolean(this.user);
};

CrazySocial.prototype._getUserID = function () {
    return this.user && this.user.id;
};
