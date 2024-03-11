/**
 * Created by vladislav on 28.12.2021
 */

var Share = {
    show: function (id, callback) {
        callback = cleverapps.once(callback || function () {});

        cleverapps.social.checkConnection(function () {
            var shareData = this.getData(id);

            cleverapps.social.shareDialog(shareData, function (code) {
                if (code === cleverapps.CODE_SUCCEED) {
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.SHARE + id);
                    this.save();
                } else {
                    console.log(Messages.get("Share.ShareFailed") + code);
                }

                callback();
            }.bind(this));
        }.bind(this), callback);
    },

    getData: function (id) {
        var data = cc.loader.getRes(bundles.main.jsons.vk_json);
        var vkPictures = data[id] || data.default;

        var path = id + "_" + cleverapps.settings.language;
        if (!bundles.shares.urls[path + "_1"]) {
            path = id + "_en";
        }
        if (!bundles.shares.urls[path + "_1"]) {
            path = "default_en";
        }

        var pictures = [];
        for (var i = 1; i < 15; i++) {
            var picture = bundles.shares.urls[path + "_" + i];

            if (!picture) {
                break;
            }

            pictures.push(picture);
        }

        return {
            name: Messages.get("Share." + id + ".Name"),
            description: Messages.get("Share." + id + ".Description"),
            picture: cleverapps.Random.mathChoose(pictures),
            vk: cleverapps.Random.mathChoose(vkPictures)
        };
    },

    isEnoughTimePassed: function () {
        var save = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.LAST_SUCCESSFUL_SHARE) || {};
        return !save.date || Date.now() - save.date >= Share.INTERVAL;
    },

    isAvailable: function () {
        if (cleverapps.flags.noshares) {
            return false;
        }
        return this.isEnoughTimePassed() && cleverapps.social.isLoggedIn() && cleverapps.user.checkAvailable(Share.AVAILABLE);
    },

    save: function () {
        cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.LAST_SUCCESSFUL_SHARE, {
            date: Date.now()
        });
    }
};

Share.INTERVAL = cleverapps.parseInterval(cleverapps.config.debugMode ? "3 minute" : "3 days");

Share.AVAILABLE = {
    level: 0.93
};

if (cleverapps.config.type === "merge") {
    Share.AVAILABLE = {
        level: 4
    };
}