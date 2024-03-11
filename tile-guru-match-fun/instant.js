/**
 * Created by vladislav on 9/6/2022
 */

var Instant = function (options) {
    Platform.call(this, options, "instant");
};

Instant.prototype = Object.create(Platform.prototype);
Instant.prototype.constructor = Instant;

Instant.prototype.removeLoadingProgress = function (callback) {
    if (this.isConnected(Platform.PLATFORM)) {
        FBInstant.startGameAsync().then(callback);
    } else {
        var listener = this.on("changeStatus:" + Platform.PLATFORM, function (status) {
            if (status === Platform.STATUS_CONNECTED) {
                listener.clear();

                FBInstant.startGameAsync().then(callback);
            }
        });
    }
};

Instant.prototype.reportProgress = function (value) {
    if (this.isConnected(Platform.PLATFORM)) {
        FBInstant.setLoadingProgress(value);
    }
};

Instant.prototype._connect = function (callback) {
    var initializeUserId = function (callback) {
        var startWaitUser = Date.now();
        var waitUserID = function () {
            if (FBInstant.player.getID() || Date.now() - startWaitUser > 30000) {
                callback();
                return;
            }

            setTimeout(waitUserID, 100);
        };

        waitUserID();
    };

    cleverapps.loadSdk("//connect.facebook.net/en_US/fbinstant.7.1.js", {
        onSuccess: function () {
            FBInstant.initializeAsync().then(function () {
                initializeUserId(function () {
                    this.preparePlatform();
                    callback(Platform.STATUS_CONNECTED);
                }.bind(this));
            }.bind(this)).catch(function () {
                callback(Platform.STATUS_DISCONNECTED);
            });
        }.bind(this),
        onFailure: function () {
            callback(Platform.STATUS_DISCONNECTED);
        }
    });
};

Instant.prototype.loadOldUserId = function (callback) {
    var canvasAppId = cleverapps.config.facebook && cleverapps.config.facebook.appId;

    if (canvasAppId && cleverapps.config.name === "heroes") {
        FBInstant.graphApi.requestAsync("/me/ids_for_business")
            .then(function (response) {
                var canvasUser = response.data.find(function (user) {
                    return user.app && user.app.id === canvasAppId;
                });

                callback(canvasUser && canvasUser.id);
            })
            .catch(function (error) {
                console.log("my ids error", error);
            });
    }
};

Instant.prototype.preparePlatform = function () {
    var platform = FBInstant.getPlatform();

    console.log("FB platform", platform);

    switch (FBInstant.getPlatform()) {
        case "IOS":
            this.info.setInfo({
                os: PlatformInfo.OS_IOS,
                isInApp: /\b(FB_IAB|FBAV|FBAN|FBDV|FBMD|FBSN|FBSV|FBSS|FBID)\b/.test(window && window.navigator && window.navigator.userAgent)
            });
            break;
        case "IOS_IAB":
            this.info.setInfo({
                os: PlatformInfo.OS_IOS,
                isInApp: true
            });
            break;
        case "ANDROID":
            this.info.setInfo({
                os: PlatformInfo.OS_ANDROID,
                isInApp: true
            });
            break;
        case "WEB":
        case "MOBILE_WEB":
    }
};

Instant.prototype._canCreateShortcut = function () {
    return !cleverapps.platform.dataLoader.load(SimpleDataLoader.TYPES.SHORTCUT_CREATED);
};

Instant.prototype.createShortcut = function () {
    if (cleverapps.pendingRequests) {
        return;
    }

    FBInstant.canCreateShortcutAsync()
        .then(function (canCreateShortcut) {
            if (cleverapps.pendingRequests || !canCreateShortcut) {
                return;
            }

            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.SHORTCUT_SHOW);

            cleverapps.countPendingRequests(FBInstant.createShortcutAsync())
                .then(function () {
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.SHORTCUT);
                    cleverapps.platform.dataLoader.save(SimpleDataLoader.TYPES.SHORTCUT_CREATED, 1);
                })
                .catch(function () {
                    // Shortcut not created
                });
        });
};

Instant.prototype._followOfficialPage = function () {
    if (cleverapps.pendingRequests) {
        return;
    }

    FBInstant.community.canFollowOfficialPageAsync()
        .then(function (canFollow) {
            if (cleverapps.pendingRequests || !canFollow) {
                return;
            }

            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.PAGE_SHOW);
            cleverapps.countPendingRequests(FBInstant.community.followOfficialPageAsync())
                .then(function () {
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.PAGE);
                })
                .catch(function (e) {
                    switch (e.code) {
                        case "USER_INPUT":
                            break;
                        case "PAGE_NOT_LINKED":
                            if (cleverapps.config.debugMode) {
                                cleverapps.notification.create("No page linked for staging");
                                break;
                            }
                        // eslint-disable-next-line no-fallthrough
                        default:
                            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.PAGE_ERROR);
                            cleverapps.throwAsync("followOfficialPageAsync: " + e.code + " " + e.message);
                    }
                });
        })
        .catch(function (e) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.PAGE_ERROR);
            cleverapps.throwAsync("canFollowOfficialPageAsync: " + e.code + " " + e.message);
        });
};

Instant.prototype.showOfficialPage = function () {
    this.followOfficialPage();
};

Instant.prototype.calcChannel = function (callback) {
    if (cleverapps.platform.isConnected(Platform.PLATFORM)) {
        callback(this.getChannel());
        return;
    }

    var connectListener = cleverapps.platform.on("changeStatus:" + Platform.PLATFORM, function (status) {
        if (status === Platform.STATUS_CONNECTED) {
            callback(this.getChannel());

            connectListener.clear();
        }
    }.bind(this));
};

Instant.prototype.getChannel = function () {
    var data = FBInstant.getEntryPointData() || {};
    return data.channel || data.fb_instant_game_campaign_id || data.fb_instant_game_adset_id || data.fb_instant_game_ad_id;
};

Instant.prototype._reportScore = function (score, callback) {
    FBInstant.postSessionScoreAsync(score).then(function () {
        this.getCurrentTournamentId(callback);
    }.bind(this)).catch(function () {
        callback();
    });
};

Instant.prototype.getCurrentTournamentId = function (callback) {
    FBInstant.getTournamentAsync().then(function (tournament) {
        var expired = new Date(tournament.getEndTime() * 1000) < new Date();
        callback(expired ? undefined : String(tournament.getID()));
    }).catch(function () {
        callback();
    });
};

Instant.FULL_AD_ID = function (id) {
    return cleverapps.config.instant.appId + "_" + id;
};

Instant.prototype._showBannerAd = function (callback) {
    callback = cleverapps.once(callback);

    setTimeout(function () {
        callback("loadBannerAdAsync timeout");
    }, Instant.AD_BANNER_TIMEOUT);

    FBInstant.loadBannerAdAsync(Instant.FULL_AD_ID(cleverapps.config.instant.banner))
        .then(function () {
            var viewport = cleverapps.resolution.getFrameSize();
            var height = Instant.AD_BANNER_HEIGHT;

            if (this.info.isMobile && this.info.isInApp) {
                height = Instant.AD_BANNER_HEIGHT_MOBILE;

                // in FB app on iPhone devices banners are raised to the height of the 'Home Indicator'
                // All iPhone devices that doesn't have 'Home button' have 'Home Indicator' (e.g. all devices since iPhone X + iPhone SE)
                // On iPhone 11 viewport.height is 800 instead of 896 as per resolutions table https://www.ios-resolution.com/
                if (this.info.os === PlatformInfo.OS_IOS) {
                    if (Math.max(viewport.width, viewport.height) > 780) {
                        height = Instant.AD_BANNER_HEIGHT_MOBILE + Instant.IPOHNE_HOME_INDICATOR_HEIGHT;
                    }
                }
            }

            console.log("show instant banner " + viewport.width + "x" + viewport.height, height, this.info.os, this.info.isMobile, this.info.isInApp);

            callback(cleverapps.CODE_SUCCEED, height);
        }.bind(this))
        .catch(function (e) {
            callback(e || true);
        });
};

Instant.prototype._hideBannerAd = function (callback) {
    callback = cleverapps.once(callback);

    setTimeout(function () {
        callback("hideBannerAdAsync timeout");
    }, Instant.AD_BANNER_TIMEOUT);

    FBInstant.hideBannerAdAsync()
        .then(function () {
            callback(cleverapps.CODE_SUCCEED);
        })
        .catch(function (e) {
            callback(e || true);
        });
};

Instant.AD_BANNER_TIMEOUT = cleverapps.parseInterval("30 seconds");
Instant.AD_BANNER_HEIGHT = 74;
Instant.AD_BANNER_HEIGHT_MOBILE = 50;

Instant.IPOHNE_HOME_INDICATOR_HEIGHT = 34;