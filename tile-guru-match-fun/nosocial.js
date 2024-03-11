/**
 * Created by Andrey Popov on 06.07.2020.
 */

cleverapps.NoSocial = function () {
    console.log("Choosing without Social");

    cleverapps.Social.call(this);
};

cleverapps.NoSocial.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.NoSocial.prototype.constructor = cleverapps.NoSocial;

cleverapps.NoSocial.prototype._connect = function (callback) {
    callback(Platform.STATUS_CONNECTED);
};