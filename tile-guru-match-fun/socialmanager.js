/**
 * Created by slava on 4/5/17.
 */

cleverapps.SocialManager = {
    onFailedLogin: function () {
        cleverapps.notification.create("SocialManager.FailedLogging");
    },

    onLogin: function (params) {
        var newId = params.newId;
        var oldId = params.oldId;

        // tmp id --> social id
        if (Platform.isTmpId(oldId) || Platform.isDeviceId(oldId)) {
            cleverapps.RestClient.post("/users/off/" + oldId, { newId: newId }, function (response) {
                console.log("Success marked off: " + oldId + ", newId: " + newId + ", response " + JSON.stringify(response));
            }, function () {
                console.log("Failed marking off: " + oldId + ", newId: " + newId);
            });
            levels.user.setLoggedIn(Date.now());

            cleverapps.synchronizer.reset();

            cleverapps.info.onChangeUserId();

            if (cleverapps.userClan) {
                cleverapps.userClan.changeUserId(oldId, newId);
                cleverapps.userClan.load();
            }

            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.LOGIN, {
                method: cleverapps.platform.source
            });
        // social id --> social id
        } else if (oldId !== newId) {
            console.log("second login! old - " + oldId + ", new - " + newId);

            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.SECOND_LOGIN);

            if (cleverapps.config.debugMode && cleverapps.platform.oneOf(Wechat)) {
                alert("second login! old - " + oldId + ", new - " + newId);
            }

            if (!cleverapps.platform.info.isNative && !cleverapps.platform.oneOf(MSStart, Wechat)
                && !(cleverapps.platform.oneOf(WortalPlatform) && (cleverapps.config.debugMode || cleverapps.platform.debugMode))) {
                cleverapps.DataLoader.cleanAll();
                cleverapps.DataLoader.setEnabled(false);
                window.location.reload();
                return;
            }

            cleverapps.synchronizer.reset();
        }

        // onLogin
        cleverapps.DataLoader.processSaveQueue();
        cleverapps.social.deleteAllRequests();

        cleverapps.synchronizer.syncWhenReady();

        cleverapps.whenAllInitialized(this.onLoginRefreshes.bind(this));
    },

    onLoginRefreshes: function () {
        if (!cleverapps.platform.oneOf(MobileVk, VKPlatform, GDCom, Plinga) && cleverapps.social.getName()) {
            cleverapps.notification.create("SocialManager.Connected", { facebook: cleverapps.social.getName() });
        }

        // console.log('About me');
        cleverapps.social.aboutMe(this.onLoadUserInfo.bind(this));
        // console.log('Done about me');

        cleverapps.friends.reload();
        cleverapps.invitalbleFriends.reload();

        if (cleverapps.platform.oneOf(TestPlatform)) {
            RewardedAdsManager.initialize();
        }

        cleverapps.restoreProgress.update();

        if (cleverapps.adOcean) {
            cleverapps.adOcean.requestClueToken();
        }

        if (cleverapps.thinkingData) {
            cleverapps.thinkingData.updateUserId();
        }

        if (cleverapps.gravityEngine) {
            cleverapps.gravityEngine.updateUserId();
        }

        if (cleverapps.googleAnalytics) {
            cleverapps.googleAnalytics.updateUserId();
        }
    },

    onLoadUserInfo: function (user) {
        // console.log(JSON.stringify(user));
        cleverapps.friends.updatePlayerInfo(user);

        if (user.currency && user.currency.user_currency) {
            var userCurrency = user.currency.user_currency;

            if (Product.CURRENCY_SIGNS[userCurrency]) {
                Product.CURRENCY = Product.CURRENCY_SIGNS[userCurrency];
                Product.CURRENCY_CODE = userCurrency;
            }
        }

        if (user.first_name && !cleverapps.flags.nologin) {
            setTimeout(function () {
                var image;
                var player = cleverapps.friends.getPlayer();
                if (player.avatar && player.avatar !== FriendsCache.DEFAULT_PLAYER_INFO().avatar) {
                    image = new cleverapps.UI.Avatar(player);
                    if (!image.width || !image.height) {
                        image = undefined;
                    }
                }
                cleverapps.notification.create("SocialManager.Welcome", {
                    toReplace: {
                        userName: user.first_name
                    },
                    image: image
                });
            }, 1000);
        }

        if (user.name) {
            var name = user.name.substr(0, 50);
            cleverapps.info.setKeyValue("name", name);
        }

        if (user.picture && user.picture.data && user.picture.data.url) {
            cleverapps.info.setKeyValue("avatar", user.picture.data.url);
        }

        if (cleverapps.periodicBonus) {
            cleverapps.periodicBonus.refreshItems();
        }
    }
};
