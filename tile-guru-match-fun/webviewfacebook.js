/**
 * Created by slava on 4/5/17.
 */

var WebViewFacebook = function () {
    if (this.constructor === WebViewFacebook) {
        console.log("Choosing webview facebook (webview)");
    }

    this.apiJobs = [];
    this.apiProcessing = false;

    cleverapps.BaseFB.call(this);

    this.listeners = {};
};

WebViewFacebook.prototype = Object.create(cleverapps.BaseFB.prototype);
WebViewFacebook.prototype.constructor = WebViewFacebook;

WebViewFacebook.prototype.onAuthDetails = function (authDetails) {
    console.log("WebViewFacebook.onAuthDetails - " + JSON.stringify(authDetails));

    this.accessToken = authDetails.accessToken;
    this.userID = authDetails.userID;
    this.graphDomain = authDetails.graphDomain;
    this.instantUserID = authDetails.instantUserID;

    if (this.graphDomain === "gaming") {
        this.userID = this.instantUserID;

        if (authDetails.userID && authDetails.accessToken) {
            this.accessToken = "instant_" + authDetails.userID + "|" + authDetails.accessToken;
        }
    }
};

WebViewFacebook.prototype._connect = function (callback) {
    cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
        this.deleteAllRequests();
    }.bind(this));

    this.deleteAllRequests();

    cleverapps.platform.callNative("FacebookPlugin.init", function (code, authDetails) {
        this.onAuthDetails(authDetails);
        
        callback(Platform.STATUS_CONNECTED);
    }.bind(this));
};

WebViewFacebook.prototype.isLoggedIn = function () {
    return this.accessToken && this.userID;
};

WebViewFacebook.prototype._getUserID = function () {
    return this.userID;
};

WebViewFacebook.prototype.getAccessToken = function () {
    return this.accessToken;
};

WebViewFacebook.prototype._login = function (callback) {
    cleverapps.platform.callNative(
        "FacebookPlugin.login", 
        { permissions: cleverapps.BaseFB.PERMISSIONS },
        function (code, authDetails) {
            console.log("WebViewFacebook.onLogin - " + code + " - " + authDetails);

            this.onAuthDetails(authDetails);

            callback();
        }.bind(this)
    );
};

WebViewFacebook.prototype.api = function (apiMethod, httpMethod, params, callback) {
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
        httpMethod = "GET";
        callback = function () {};
    } else if (typeof httpMethod === "function") {
        callback = httpMethod;
        httpMethod = "GET";
    }

    // console.log('Add api: ' + apiMethod, httpMethod, JSON.stringify(params));

    this.apiJobs.push({
        apiMethod: apiMethod, httpMethod: httpMethod, params: params, callback: callback
    });

    this.processApi();
};

WebViewFacebook.prototype.processApi = function () {
    if (this.apiProcessing || this.apiJobs.length === 0) {
        return;
    }

    this.apiProcessing = true;
    var job = this.apiJobs.shift();

    var callback = job.callback;
    delete job.callback;

    cleverapps.platform.callNative("FacebookPlugin.api", job, function (code, data) {
        if (callback && code === cleverapps.CODE_SUCCEED) {
            callback(cleverapps.CODE_SUCCEED, data);
        }

        this.apiProcessing = false;
        this.processApi();
    }.bind(this));
};

WebViewFacebook.prototype.getCode = function () {
    return "facebook";
};

WebViewFacebook.isAvailable = function () {
    return cleverapps.platform.oneOf(AndroidPlatform, Amazon, IOS);
};

WebViewFacebook.APPINVITES_SDKBOX_ERROR = "Unrecognized 'com.facebook.platform.protocol.PROTOCOL_ACTION' extra: 'com.facebook.platform.action.request.APPINVITES_DIALOG'.";