/**
 * Created by Aleksandr on 13.10.2022.
 */

cleverapps.PlingaSocial = function () {
    console.log("Choosing plinga");

    cleverapps.Social.call(this);
};

cleverapps.PlingaSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.PlingaSocial.prototype.constructor = cleverapps.PlingaSocial;

cleverapps.PlingaSocial.prototype._login = function () {
    plingaRpc.invite();
};

cleverapps.PlingaSocial.prototype._aboutUser = function (usersId, callback) {
    var isSingle = !Array.isArray(usersId);

    plingaRpc.getUsers(isSingle ? [usersId] : usersId, function (users) {
        var usersData = users.map(cleverapps.PlingaSocial.formatUserData);
        callback(isSingle ? usersData[0] : usersData);
    });
};

cleverapps.PlingaSocial.prototype._aboutMe = function (callback) {
    var info = plingaRpc.getOwner();
    callback(cleverapps.PlingaSocial.formatUserData(info));
};

cleverapps.PlingaSocial.prototype._listFriends = function (callback) {
    var list = plingaRpc.getFriends();
    var friends = list.map(cleverapps.PlingaSocial.formatUserData);
    callback(cleverapps.CODE_SUCCEED, friends);
};

cleverapps.PlingaSocial.formatUserData = function (user) {
    return {
        id: user.uid,
        name: user.firstname + " " + user.lastname,
        first_name: user.firstname,
        picture: {
            data: {
                url: user.thumbnailurl
            }
        }
    };
};

cleverapps.PlingaSocial.prototype._inviteFriends = function (options, callback) {
    plingaRpc.invite(options.message);
    callback(cleverapps.CODE_SUCCEED);
};

cleverapps.PlingaSocial.prototype._shareDialog = function (options, callback) {
    var data = {
        target: cleverapps.platform.getUserID(),
        title: options.name,
        body: options.description,
        linktext: Messages.get("PlayNow"),
        pic: options.picture
    };

    plingaRpc.post(data, function (params) {
        console.log("post callback", params);
        if (params.globalError_ === false) {
            callback(cleverapps.CODE_SUCCEED);
        } else {
            callback(cleverapps.CODE_FAILED);
        }
    });
    callback(cleverapps.CODE_SUCCEED);
};

cleverapps.PlingaSocial.prototype.sendMessage = function (options, callback) {
    console.log(options);
    plingaRpc.sendMessage({
        target: "userid of the receiver",
        title: "text, which is shown as title",
        body: "text of the post",
        pic: "link to a picture, which is shown in the post",
        linktext: "text to display for the link"
    }, callback);
};

cleverapps.PlingaSocial.prototype.getCode = function () {
    return cleverapps.PlingaSocial.CODE;
};

cleverapps.PlingaSocial.prototype.getAccessToken = function () {
    var getParams = cleverapps.getRequestParameters();
    return "PLINGA_" + getParams.sessionid + "_" + getParams.sessionkey;
};

cleverapps.PlingaSocial.prototype.isLoggedIn = function () {
    return cleverapps.platform.isConnected(Platform.SOCIAL) && plingaRpc.getOwner().guest !== true;
};

cleverapps.PlingaSocial.prototype._getUserID = function () {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        return;
    }

    return plingaRpc.getOwner().uid;
};

cleverapps.PlingaSocial.CODE = "plinga";