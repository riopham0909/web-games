/**
 * Created by vtbelo on 31/03/21
 */

var TileModel = function (product) {
    this.product = product;
    this.onUpdateTileModel = function () {};
    this.onGetView = function () {};
    this.onBuyVideoProduct = function () {};
    this.onUpdateAvailability = function () {};

    cleverapps.meta.showControlsWhileFocused(this.getCurrencyControl());
    if (this.product.videoProduct) {
        cleverapps.rewardedAdsManager.on("changeLoaderState:" + RewardedAdsManager.REWARDED, this.updateAvailability.bind(this), this);
    }
};

TileModel.prototype.onExit = function () {
    runCleaners(this);
};

TileModel.prototype.getCurrencyControl = function () {
    if (this.product.currency === "hard") {
        return "MenuBarGoldItem";
    }
    if (this.product.currency === "soft") {
        return "MenuBarCoinsItem";
    }
    return [];
};

TileModel.prototype.currentVideoProgress = function () {
    return cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.PRODUCT_VIDEO_PROGRESS + this.product.itemId) || 0;
};

TileModel.clearVideoProgress = function (product) {
    return cleverapps.DataLoader.remove(cleverapps.DataLoaderTypes.PRODUCT_VIDEO_PROGRESS + product.itemId);
};

TileModel.prototype.updateModelState = function () {
    this.onUpdateTileModel();
};

TileModel.prototype.updateAvailability = function () {
    this.onUpdateAvailability();
};

TileModel.prototype.getCurrentPrice = function () {
    if (this.product.videoProduct) {
        return "##" + this.currentVideoProgress() + "/" + this.product.videoPrice;
    }
    return this.product.getCurrentPrice();
};

TileModel.prototype.getDisabledPrice = function () {
    return this.product.videoProduct ? this.getCurrentPrice() : "Claimed";
};

TileModel.prototype.isAttention = function () {
    return this.isAvailable() && this.product.attention;
};

TileModel.prototype.getTitle = function () {
    return this.product.title;
};

TileModel.prototype.getDescription = function () {
    return this.product.description;
};

TileModel.prototype.getPrice = function () {
    return this.product.price;
};

TileModel.prototype.getItemId = function () {
    return this.product.itemId;
};

TileModel.prototype.getIcon = function () {
    return this.product.icon;
};

TileModel.prototype.getViewClassName = function () {
    return this.product.ViewClassName || CoinsProductTile;
};

TileModel.prototype.getProductDescription = function () {
};

TileModel.prototype.getProductLimit = function () {
};

TileModel.prototype.getRewardsIcon = function () {
    return bundles.reward_icons.frames[this.product.rewardsIcon];
};

TileModel.prototype.getReward = function () {
    return this.product.reward;
};

TileModel.prototype.isEnabled = function () {
    if (this.product.key === "unlimitedLives") {
        return !cleverapps.flags.videoAdsMainMonetization;
    }
    if (this.product.key === "energyLottery") {
        return Game.currentGame.energyLottery !== undefined;
    }

    return true;
};

TileModel.prototype.checkDisabledProducts = function () {
    if (this.product.disableProductIds) {
        for (var i = 0; i < this.product.disableProductIds.length; ++i) {
            var disableTile = TileModel.Create(Product.Create(this.product.disableProductIds[i]));
            if (disableTile.isEnabled() && disableTile.isAvailable()) {
                return false;
            }
        }
    }
    return true;
};

TileModel.prototype.buyVideoProduct = function (closeShopCallback) {
    var adLimit = AdsLimits.TYPES.PRODUCT;
    if (typeof UnitsShopTileModel !== "undefined" && this instanceof UnitsShopTileModel) {
        adLimit = AdsLimits.TYPES.CINEMA;
    }
    cleverapps.rewardedAdsManager.loadAndPlay({
        type: RewardedAdsManager.REWARDED,
        adLimit: adLimit,
        callback: function () {
            this.incVideoProduct(closeShopCallback);
        }.bind(this)
    });
};

TileModel.prototype.incVideoProduct = function (closeShopCallback) {
    var amount = this.currentVideoProgress();
    amount++;
    if (amount >= this.product.videoPrice) {
        amount = 0;

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.VIDEO_PRODUCT_BUY);
        if (this.product.onBuyed) {
            this.product.onBuyed();
        }
        closeShopCallback();
    }
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.PRODUCT_VIDEO_PROGRESS + this.product.itemId, amount);

    this.onBuyVideoProduct();
};

TileModel.prototype.buy = function (closeShopCallback) {
    if (this.product.videoProduct) {
        this.buyVideoProduct(closeShopCallback);

        return;
    }
    return this.product.buy(function (success) {
        if (success) {
            this.product.logBuyItem();

            closeShopCallback();
        }
    }.bind(this));
};

TileModel.prototype.isAvailable = function () {
    if (this.product.videoProduct && !cleverapps.rewardedAdsManager.isAvailable(RewardedAdsManager.REWARDED)) {
        return false;
    }
    return true;
};

TileModel.prototype.wantsScroll = function () {
    return this.badge;
};

TileModel.prototype.getBadge = function () {
    if (PeriodicSaleLogic.NeedTileDecor(this)) {
        return {
            rotation: 0,
            image: bundles.tile_shop.frames.bonussale_badge,
            icon: new cc.Sprite(bundles.reward_icons.frames.bonussale_gift),
            clickAction: function () {
                cleverapps.windows.currentWindow().close();
                new PeriodicSaleWindow(cleverapps.missionManager.findByType(Mission.TYPE_PERIODIC_SALE));
            }
        };
    }

    if (cleverapps.clans && Clans.IsAvailable() && this.product.clanGift && !this.product.videoProduct) {
        if (!(this instanceof SubscriptionTileModel && cleverapps.subscription.isActive())
            && !(this instanceof GrowthFundTileModel && cleverapps.growthFund && cleverapps.growthFund.isBought())) {
            return {
                icon: new cc.Sprite(bundles.reward_icons.frames.clan_gift_png),
                tooltipText: "ClanGift.Text"
            };
        }
    }

    if (this.badge) {
        return this.badge;
    }

    if (this.product.discount) {
        return {
            type: "discount",
            text: this.product.discount
        };
    }

    if (this.product.value) {
        return {
            type: "value",
            value: this.product.value
        };
    }

    if (this.product.badge) {
        return {
            text: this.product.badge
        };
    }
};

TileModel.prototype.getView = function () {
    return this.onGetView();
};

TileModel.Create = function (product) {
    var TileModelClass = TileModel;
    if (product.TileModelClass) {
        TileModelClass = product.TileModelClass;
    }
    return new TileModelClass(product);
};