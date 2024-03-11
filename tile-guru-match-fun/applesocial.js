/**
 * Created by andrey on 22.07.2020
 */

cleverapps.AppleSocial = function () {
    console.log("Choosing Apple Social");

    cleverapps.Social.call(this);
};

cleverapps.AppleSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.AppleSocial.prototype.constructor = cleverapps.AppleSocial;

cleverapps.AppleSocial.prototype.onTokenValidateFailure = function () {
    this.id = "";
    this.token = "";

    this.save();
};

cleverapps.AppleSocial.prototype.updateNameFromServer = function (callback) {
    console.log("AppleSocial.updateNameFromServer");

    cleverapps.RestClient.get("/info/name/" + cleverapps.platform.getUserID(), {}, function (response) {
        var name = response.name || "";

        console.log("AppleSocial.updateNameFromServer success - " + name);

        this.name = name;
        this.save();

        callback(Platform.STATUS_CONNECTED);
    }.bind(this), function (response) {
        console.log("AppleSocial.updateNameFromServer failure - " + response);

        callback(Platform.STATUS_CONNECTED);
    });
};

cleverapps.AppleSocial.prototype.onAuthDetails = function (authDetails, callback) {
    console.log("AppleSocial.prepareData - " + JSON.stringify(authDetails));

    this.id = authDetails.id || "";
    this.token = authDetails.token || "";
    if (authDetails.name) {
        this.name = authDetails.name;
    }

    this.save();

    if (this.id && !this.name) {
        this.updateNameFromServer(callback);
    } else {
        callback(Platform.STATUS_CONNECTED);
    }
};

cleverapps.AppleSocial.prototype.save = function () {
    cleverapps.platform.dataLoader.save(SimpleDataLoader.TYPES.APPLE_SOCIAL, {
        id: this.id,
        token: this.token,
        name: this.name
    });
};

cleverapps.AppleSocial.prototype._connect = function (callback) {
    var data = cleverapps.platform.dataLoader.load(SimpleDataLoader.TYPES.APPLE_SOCIAL);

    cleverapps.platform.callNative("AppleSocialPlugin.init", { data: data }, function (code, authDetails) {
        this.onAuthDetails(authDetails, callback);
    }.bind(this));
};

cleverapps.AppleSocial.prototype.isLoggedIn = function () {
    return this._getUserID() && this.getAccessToken();
};

cleverapps.AppleSocial.prototype._getUserID = function () {
    if (this.id) {
        return "apple_" + this.id;
    }
};

cleverapps.AppleSocial.isAppleUserId = function (id) {
    return id && id.indexOf("apple_") === 0;
};

cleverapps.AppleSocial.prototype.getAccessToken = function () {
    return this.token;
};

cleverapps.AppleSocial.prototype._login = function (callback) {
    cleverapps.platform.callNative("AppleSocialPlugin.login", function (code, authDetails) {
        this.onAuthDetails(authDetails, callback);
    }.bind(this));
};

cleverapps.AppleSocial.prototype._aboutMe = function (callback) {
    var data = {
        id: cleverapps.platform.getUserID(),
        first_name: this.name,
        name: this.name
    };

    console.log("AppleSocial.aboutMe - " + JSON.stringify(data));

    callback(data);
};

cleverapps.AppleSocial.prototype.getCode = function () {
    return cleverapps.AppleSocial.CODE;
};

cleverapps.AppleSocial.isAvailable = function () {
    return cleverapps.platform.appleSocialAvailable && cleverapps.platform.oneOf(IOS, MacOS);
};

cleverapps.AppleSocial.CODE = "applesocial";
