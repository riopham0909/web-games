/**
 * Created by andrey on 04.07.17.
 */

cleverapps.CrossPromo = function () {
    var saveInfo = this.load();

    if (saveInfo) {
        this.processed = saveInfo.processed;
    } else {
        this.reset();
    }
};

cleverapps.CrossPromo.prototype.reset = function () {
    this.processed = [];
    this.save();
};

cleverapps.CrossPromo.prototype.getFirstAvailable = function () {
    var result = undefined;
    this.listPromotions().forEach(function (promotion) {
        if (result || this.processed.indexOf(promotion.id) !== -1) {
            return;
        }

        result = promotion;
    }, this);

    if (result !== undefined) {
        return result;
    }

    if (this.processed.length > 0) {
        this.processed = [];
        this.save();
        return this.getFirstAvailable();
    }

    return undefined;
};

cleverapps.CrossPromo.prototype.listPromotions = function () {
    var promotions = [];

    Object.keys(projects).forEach(function (game) {
        if (game === cleverapps.config.name) {
            return;
        }

        var config = Platform.getPlatformConfig(game, cleverapps.platform.source);
        if (!cleverapps.config.debugMode && config && config.debug) {
            return;
        }

        var bundleName = "crosspromo_" + game + "_" + cleverapps.settings.language;
        var bundleNameEn = "crosspromo_" + game + "_" + cc.sys.LANGUAGE_ENGLISH;
        if (!bundles[bundleNameEn]) {
            return;
        }

        var promo = {
            id: game,
            title: "" + game + "PromoTitle",
            description: "" + game + "Promo",
            bundleName: bundles[bundleName] ? bundleName : bundleNameEn,
            link: Platform.guessPlatformURL(projects[game], cleverapps.config.debugMode, cleverapps.platform.source)
        };

        if (cleverapps.platform.source === "crazy") {
            // tmp, since we have only one game for now
            return;
        }

        if (cleverapps.platform.source === "msstart") {
            // no cross promo for now https://assets.msn.com/staticsb/statics/latest/msstart-games-sdk/documentation/docs/common-issues/index.html
            return;
        }

        if (cleverapps.platform.source === "instant" || cleverapps.config.debugMode) {
            var projectConfig = projects[cleverapps.config.name];
            var projectBusiness = projectConfig.instant && projectConfig.instant.business || projectConfig.business;
            var promotionConfig = projects[game];
            var promoBusiness = promotionConfig.instant && promotionConfig.instant.business || promotionConfig.business;

            if (projectBusiness !== promoBusiness) {
                return;
            }
        }

        if (!promo.link && cleverapps.platform.source !== "instant") {
            return;
        }

        if (cleverapps.platform.source === "instant") {
            promo.link = projects[game].instant && projects[game].instant.appId;
            if (!promo.link) {
                return;
            }
        }
        if (cleverapps.platform.source === "facebook") {
            promo.link += "?channel=" + cleverapps.config.name;
        }
        if (cleverapps.platform.source === "android") {
            promo.link += "&utm_source=" + cleverapps.config.name;
        }

        promotions.push(promo);
    });

    return promotions;
};

cleverapps.CrossPromo.prototype.isReady = function () {
    if (!cleverapps.user.checkAvailable(cleverapps.CrossPromo.AVAILABLE)) {
        return false;
    }

    return this.getFirstAvailable() !== undefined;
};

cleverapps.CrossPromo.prototype.setProcessed = function (promotion) {
    this.processed.push(promotion.id);
    this.save();
};

cleverapps.CrossPromo.prototype.load = function () {
    return cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.PROMOTION);
};

cleverapps.CrossPromo.prototype.save = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.PROMOTION, {
        processed: this.processed
    });
};

cleverapps.CrossPromo.ShowFirstAvailable = function () {
    var promotion = cleverapps.crossPromo.getFirstAvailable();

    new CrossPromoWindow(promotion);
};

cleverapps.CrossPromo.BONUS = 10;

cleverapps.CrossPromo.AVAILABLE = {
    level: 3.33
};

if (cleverapps.config.type === "merge") {
    cleverapps.CrossPromo.AVAILABLE = {
        level: 8.2
    };
}