/**
 * Created by Aleksandr on 15.06.2023
 */

cleverapps.MSStartSocial = function () {
    console.log("Choosing msstart");

    cleverapps.Social.call(this);
};

cleverapps.MSStartSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.MSStartSocial.prototype.constructor = cleverapps.MSStartSocial;

cleverapps.MSStartSocial.prototype._connect = function (callback) {
    $msstart.getSignedInUserAsync()
        .then(function (player) {
            this.playerId = player.publisherPlayerId || player.playerId;
            console.log("MSStart getSignedInUserAsync", player);
            callback(Platform.STATUS_CONNECTED);
        }.bind(this))
        .catch(function (error) {
            console.log("MSStart getSignedInUserAsync error", error);
            callback(Platform.STATUS_CONNECTED);
        });
};

cleverapps.MSStartSocial.prototype.isLoggedIn = function () {
    return !!this.playerId;
};

cleverapps.MSStartSocial.prototype._getUserID = function () {
    return this.playerId;
};

cleverapps.MSStartSocial.prototype._login = function (callback) {
    $msstart.signInAsync().then(function (player) {
        this.playerId = player.publisherPlayerId || player.playerId;
        console.log("MSStart login", player);

        callback();
    }.bind(this)).catch(function (error) {
        console.log("MSStart login error", error);

        callback();
    });
};

cleverapps.MSStartSocial.prototype._shareDialog = function (data, callback) {
    console.log("MS Start share", data);

    $msstart.shareAsync({
        title: data.name,
        text: data.description,
        image: data.picture
    }).then(function () {
        console.log("MSStart share: success!");
        callback(cleverapps.CODE_SUCCEED);
    }).catch(function (error) {
        console.log("MSStart share error", error);
        callback(cleverapps.CODE_FAILED);
    });
};

cleverapps.MSStartSocial.prototype._aboutMe = function (callback) {
    callback({
        name: "MSN Player " + (cleverapps.platform.getUserID() + "").substring(0, 18),
        first_name: "MSN Player"
    });
};

cleverapps.MSStartSocial.prototype.getAccessToken = function () {
    return "msstart";
};