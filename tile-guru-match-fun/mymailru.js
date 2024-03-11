/**
 * Created by vladislav on 9/6/2022
 */

var MyMailRu = function (options, source) {
    Platform.call(this, options, source || "web_mm");
};

MyMailRu.prototype = Object.create(Platform.prototype);
MyMailRu.prototype.constructor = MyMailRu;

MyMailRu.prototype._connect = function (callback) {
    var onFailure = function (reason) {
        if (window.outerHeight && window.innerHeight) {
            var maxH = window.outerHeight - 250;
            cleverapps.resolution.setupDesignResolution(cc.size(window.innerWidth, maxH));
        }

        callback(Platform.STATUS_DISCONNECTED);

        if (reason === "timeout") {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FAKEFB_BY_TIMEOUT);
        } else {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FAKEFB_BY_SCRIPT_ERROR);
        }
    };

    var onSuccess = function () {
        mailru.loader.require("api", function () {
            mailru.app.init(cleverapps.config.mm.privateKey);

            if (this instanceof MobileMyMailRu) {
                this.createHeaderAndFooter(function () {
                    callback(Platform.STATUS_CONNECTED);
                });
            } else {
                if (window.outerHeight && window.innerHeight) {
                    var maxH = window.outerHeight - 250;
                    mailru.app.utils.setHeight(maxH);
                    cleverapps.resolution.setupDesignResolution(cc.size(window.innerWidth, maxH));
                }

                mailru.events.listen(mailru.app.events.readHash, function (result) {
                    if (result && result.channel) {
                        levels.user.setChannel(result.channel);
                    }
                });
                mailru.app.utils.hash.read();

                setTimeout(function () {
                    callback(Platform.STATUS_CONNECTED);
                }, 300);
            }
        }.bind(this));
    };

    cleverapps.loadSdk("//connect.mail.ru/js/loader.js", { onSuccess: onSuccess, onFailure: onFailure, crossorigin: false });
};

MyMailRu.prototype.getLocalStoragePreffix = function () {
    return "_MM";
};

MyMailRu.prototype.getSuggestedLanguage = function () {
    return [PlatformInfo.LANGUAGE_RUSSIAN];
};

MyMailRu.prototype.calcChannel = function (callback) {
    var channel = Platform._parseChannel("channel");

    if (!channel && document.referrer) {
        var url = new URL(document.referrer);

        callback(Platform._parseChannel("channel", url.search));
    } else {
        callback(channel);
    }
};