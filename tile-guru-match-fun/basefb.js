/**
 * Created by slava on 23.03.17.
 */

cleverapps.BaseFB = function () {
    cleverapps.Social.call(this);
};

cleverapps.BaseFB.prototype = Object.create(cleverapps.Social.prototype);
cleverapps.BaseFB.prototype.constructor = cleverapps.BaseFB;

cleverapps.BaseFB.prototype.pagingLoading = function (api, callback, page, next, res) {
    if (!res) {
        res = [];
    }

    if (!next) {
        next = "";
    }

    if (!page) {
        page = 0;
    }

    if (page >= cleverapps.BaseFB.MAX_PAGE) {
        callback(cleverapps.CODE_SUCCEED, res);
        return;
    }

    this.api(api + "&limit=100" + next, function (code, response) {
        if (code === cleverapps.CODE_SUCCEED) {
            if (response.data) {
                res = res.concat(response.data);
            }
            if (response.paging && response.paging.cursors && response.paging.next && response.paging.cursors.after) {
                this.pagingLoading(api, callback, page + 1, "&after=" + response.paging.cursors.after, res);
            } else {
                callback(cleverapps.CODE_SUCCEED, res);
            }
        } else if (res.length) {
            callback(cleverapps.CODE_SUCCEED, res);
        } else {
            callback(code, res);
        }
    }.bind(this));
};

cleverapps.BaseFB.prototype.getShareDialogLink = function (data) {
    var shareLink = cleverapps.config.deployment + cleverapps.config.restApiURL + "/share/?"
        + "name=" + encodeURIComponent(data.name)
        + "&description=" + encodeURIComponent(data.description)
        + "&picture=" + encodeURIComponent(data.picture);

    return shareLink;
};

cleverapps.BaseFB.prototype._listFriends = function (callback) {
    this.pagingLoading("/me/friends?fields=first_name,id,picture.type(large)", callback);
};

cleverapps.BaseFB.prototype._listInvitableFriends = function (callback) {
    callback([]);
};

cleverapps.BaseFB.prototype._aboutMe = function (callback) {
    this.aboutUser("me", callback); 
};

cleverapps.BaseFB.prototype._aboutUser = function (userId, callback, onFailure) {
    var fields = "currency,first_name,name,picture.type(large)";

    if (userId === "me") {
        fields += ",email";
    }

    this.api("/" + userId + "/?fields=" + fields, function (code, response) {
        if (code === cleverapps.CODE_SUCCEED) {
            callback(response);
        } else {
            console.log("Error: " + code);
            console.log(response);

            if (onFailure) {
                onFailure(code, response);
            }

            if (cleverapps.BaseFB.USERS_BLACK_LIST_ERROR_CODES.indexOf(code) >= 0) {
                var data = { code: code, data: response };
                cleverapps.RestClient.post(
                    "/users/blacklist/add/" + userId, 
                    data,
                    function () {
                        console.log("Success add to black list:" + userId);
                    },
                    function () {
                        console.log("Failure add to black list:" + userId);
                    }
                );
            }
        }
    });
};

cleverapps.BaseFB.prototype.deleteAllRequests = function () {
    this.api("me/apprequests", function (code, response) {
        if (code === cleverapps.CODE_SUCCEED) {
            if (response.data) {
                for (var i = 0; i < response.data.length; i++) {
                    console.log("START DELETE REQUEST", response.data[i].id);
                    this.api(response.data[i].id, "delete", function (code, response) {
                        console.log("DELETE REQUEST", code, response);
                    });
                }
            }
        } else {
            console.log("Error: " + code);
            console.log(response);
        }
    }.bind(this));
};

cleverapps.BaseFB.MAX_PAGE = 20;
cleverapps.BaseFB.USERS_BLACK_LIST_ERROR_CODES = [100];
cleverapps.BaseFB.PERMISSIONS = "public_profile";
