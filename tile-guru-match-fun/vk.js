/**
 * Created by vladislav on 9/6/2022
 */

var VKPlatform = function (options, source) {
    Platform.call(this, options, source || "web_vk");
};

VKPlatform.prototype = Object.create(Platform.prototype);
VKPlatform.prototype.constructor = VKPlatform;

VKPlatform.prototype._connect = function (callback) {
    var onSuccess = function () {
        vkBridge.subscribe(function (event) {
            console.log("vkBridge event", event);
        });

        if (vkBridge.isWebView()) {
            this.info.setInfo({
                isInApp: true,
                isMobile: true
            });
        }

        if (this.info.isInApp) {
            var cb = function (event) {
                if (event.detail.type === "VKWebAppInitResult") {
                    callback(Platform.STATUS_CONNECTED);
                    vkBridge.unsubscribe(cb);
                }
                if (event.detail.type === "VKWebAppInitFailed") {
                    callback(Platform.STATUS_DISCONNECTED);
                    vkBridge.unsubscribe(cb);
                    vkBridge.donate(101);
                }
            };

            vkBridge.subscribe(cb);
        }

        vkBridge.send("VKWebAppInit", {});

        if (!this.info.isInApp) {
            callback(Platform.STATUS_CONNECTED);
        }
    }.bind(this);

    var onFailure = function () {
        callback(Platform.STATUS_DISCONNECTED);
    };

    cleverapps.loadSdk("//unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js", { onSuccess: onSuccess, onFailure: onFailure });
};

VKPlatform.prototype.getLocalStoragePreffix = function () {
    return "_VK";
};

VKPlatform.prototype.getSuggestedLanguage = function () {
    return [PlatformInfo.LANGUAGE_RUSSIAN];
};

VKPlatform.prototype._canCreateShortcut = function () {
    return true;
};

VKPlatform.prototype.createShortcut = function () {
    cleverapps.social.api("VKWebAppAddToFavorites");
};

VKPlatform.prototype.calcChannel = function (callback) {
    callback(Platform._parseChannel("hash") || Platform._parseChannel("referrer"));
};

VKPlatform.prototype._showBannerAd = function (callback) {
    if (!this.bannerAdListener) {
        this.bannerAdListener = function (event) {
            event = event && event.detail;

            if (!event) {
                return;
            }

            if (event.type === "VKWebAppBannerAdUpdated" && event.data.result === true) {
                cleverapps.bannerAd.onPaidEvent();
            }
        };

        vkBridge.subscribe(this.bannerAdListener);
    }

    vkBridge.send("VKWebAppShowBannerAd", {
        layout_type: "resize",
        can_close: false
    })
        .then(function (data) {
            if (!data || !data.result) {
                callback(data || cleverapps.CODE_FAILED);
                return;
            }
            callback(cleverapps.CODE_SUCCEED);
            cleverapps.bannerAd.onPaidEvent();
        })
        .catch(function (e) {
            callback(e || true);
        });
};

VKPlatform.prototype._hideBannerAd = function (callback) {
    if (!this.isConnected(Platform.PLATFORM)) {
        callback(cleverapps.CODE_FAILED);

        return;
    }

    vkBridge.send("VKWebAppHideBannerAd")
        .then(function (data) {
            if (!data || !data.result) {
                callback(data || true);
                return;
            }

            callback(cleverapps.CODE_SUCCEED);

            if (this.bannerAdListener) {
                vkBridge.unsubscribe(this.bannerAdListener);
                this.bannerAdListener = undefined;
            }
        })
        .catch(function (e) {
            callback(e || true);
        });
};