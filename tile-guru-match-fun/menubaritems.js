/**
 * Created by Andrey Popov on 6/2/21
 */

cleverapps.MenuBarItems = function () {
    var items = [];

    if (cleverapps.config.type === "merge") {
        items.push({
            name: "GameLevelItem",
            targets: ["default", "exp"],
            viewClass: MenuBarGameLevelView,
            modelClass: GameLevelMenuBarItem,
            availableOnScenes: [cleverapps.Environment.SCENE_MAIN]
        });
    }

    if (["klondike"].indexOf(cleverapps.config.type) === -1) {
        items.push({
            name: "GoldItem",
            lottery: true,
            isClickable: function () {
                return !cleverapps.flags.videoAdsMainMonetization || cleverapps.rewardedAdsManager.isEnabled();
            },
            clickableUpdater: function (f) {
                cleverapps.flags.on("change:videoAdsMainMonetization", f, this);
            },
            targets: "hard",
            plusButton: true,
            value: function () {
                return cleverapps.user.gold;
            },
            updater: function (f) {
                cleverapps.user.on("changeHard", f, this);
            },
            attentionUpdater: function (f) {
                cleverapps.adsLimits.on("update", f, this);

                if (cleverapps.subscription) {
                    cleverapps.subscription.on("update", f, this);
                }

                if (cleverapps.growthFund) {
                    cleverapps.growthFund.on("updateState", f, this);
                }
            },
            attention: function () {
                if (ShopProductSource.listProducts(ShopWindow.TABS.HARD_CURRENCY).indexOf("hardForVideo") !== -1
                    && cleverapps.adsLimits.state(AdsLimits.TYPES.HARD) === AdsLimits.STATE_READY) {
                    return true;
                }
                if (ShopProductSource.listProducts(ShopWindow.TABS.HARD_CURRENCY).indexOf("subsMonth") !== -1
                    && cleverapps.subscription && cleverapps.subscription.needsAttention()) {
                    return true;
                }
                if (cleverapps.growthFund && cleverapps.growthFund.needsAttention()) {
                    return true;
                }
                return false;
            },
            availableOnScenes: function () {
                var scenes = [
                    cleverapps.Environment.SCENE_MAIN,
                    cleverapps.Environment.SCENE_HEROES,
                    cleverapps.Environment.SCENE_DAILY_CUP,
                    cleverapps.Environment.SCENE_BONUS_WORLD,
                    cleverapps.Environment.SCENE_SLOT_MACHINE,
                    cleverapps.Environment.SCENE_GAME
                ];
                return scenes;
            },
            hiddenByDefault: ["match3", "tile3", "battlefield"].includes(cleverapps.config.type) ? [cleverapps.Environment.SCENE_GAME, cleverapps.Environment.SCENE_WYSIWYG] : undefined,
            icon: bundles.menubar.frames.gold_png,
            onClickWindow: HardCurrencyShopWindow,
            deltaSound: bundles.menubar.urls.coins_effect,
            sparks: ["merge", "board"].includes(cleverapps.config.type)
        });
    }

    if (cleverapps.lives) {
        items.push({
            name: "LivesItem",
            lottery: true,
            targets: "lives",
            plusButton: cleverapps.platform.oneOf(Pliega) ? undefined : true,
            attentionUpdater: function (f) {
                if (Game.currentGame && Game.currentGame.energyLottery) {
                    Game.currentGame.energyLottery.onLotteryAttentionChanged = f;
                }
            },
            attention: function () {
                if (Game.currentGame && Game.currentGame.energyLottery) {
                    return Game.currentGame.energyLottery.isReady();
                }
            },
            availableOnScenes: function () {
                var scenes = [cleverapps.Environment.SCENE_BONUS_WORLD];

                var expedition = cleverapps.travelBook.getCurrentPage();
                if (expedition.withEnergy()) {
                    scenes.push(cleverapps.Environment.SCENE_MAIN);
                }

                if (cleverapps.dailyCup.withLives()) {
                    scenes.push(cleverapps.Environment.SCENE_DAILY_CUP);
                }

                return scenes;
            },
            force: Forces.BUY_ENERGY_ICON,
            viewClass: MenuBarWithTimeoutView,
            modelClass: LivesMenuBarItem,
            icon: bundles.menubar.frames.life_png,
            onClickWindow: cleverapps.platform.oneOf(Pliega) ? undefined : LivesShopWindow,
            sparks: true,
            deltaSound: cleverapps.config.lives ? bundles.menubar.urls.lives_fly_finish_effect : bundles.menubar.urls.energy_fly_finish_effect
        });
    }

    if (cleverapps.config.soft) {
        items.push({
            name: "CoinsItem",
            targets: "soft",
            plusButton: true,
            value: function () {
                return cleverapps.user.soft;
            },
            updater: function (f) {
                cleverapps.user.on("changeSoft", f, this);
            },
            attentionUpdater: function (f) {
                cleverapps.adsLimits.on("update", f, this);
            },
            attention: function () {
                return false;
            },
            onClickWindow: SoftCurrencyShopWindow,
            icon: bundles.menubar.frames.coin_png,
            force: Forces.MENU_BAR_SOFT_FORCE,
            availableOnScenes: function () {
                return [
                    cleverapps.Environment.SCENE_MAIN,
                    cleverapps.Environment.SCENE_GAME
                ];
            },
            hiddenByDefault: ["match3"].includes(cleverapps.config.type) ? [cleverapps.Environment.SCENE_GAME] : undefined,
            sparks: true,
            deltaSound: bundles.menubar.urls.coins_effect
        });
    }
    if (cleverapps.config.type === "merge") {
        items.push({
            name: "WandsItem",
            plusButton: false,
            targets: "wands",
            value: function () {
                return Game.currentGame.wands;
            },
            updater: function (f) {
                Game.currentGame.onChangeWandsListener = f;
            },
            onClickWindow: GuideWindow,
            onClickOptions: function () {
                var expedition = cleverapps.travelBook.getCurrentExpedition();
                return expedition ? ExpeditionWandsGuideOptions : { name: "WandsGuideWindow" };
            },
            icon: function () {
                return bundles.menubar.frames.merge_wand_png;
            },
            deltaSound: bundles.menubar.urls.wand_fly_finish_effect,
            availableOnScenes: function () {
                var page = cleverapps.travelBook.getCurrentPage();
                if (page.withWands()) {
                    return [cleverapps.Environment.SCENE_MAIN];
                }
            },
            sparks: true
        }, {
            name: "WorkersItem",
            plusButton: true,
            targets: "worker",
            timerTTF: true,
            viewClass: MenuBarWithTimeoutView,
            modelClass: WorkersMenuBarItem,
            attention: function () {
                return Game.currentGame && Game.currentGame.workers.isAdsWorkerAvailable()
                    && cleverapps.adsLimits.state(AdsLimits.TYPES.WORKER) === AdsLimits.STATE_READY && cleverapps.flags.videoAdsMainMonetization;
            },
            onClickWindow: BonusWorkerWindow,
            icon: function () {
                return bundles.menubar.frames.merge_worker_png;
            },
            availableOnScenes: function () {
                var page = cleverapps.travelBook.getCurrentPage();
                if (page.withWorkers()) {
                    return [cleverapps.Environment.SCENE_MAIN];
                }
            },
            deltaSound: bundles.menubar.urls.worker_fly_finish_effect,
            sticker: function () {
                var page = cleverapps.travelBook.getCurrentPage();
                if (page.isMain() && Subscription.IsAvailable() && cleverapps.subscription.isActive()) {
                    return "premium";
                }
            }
        });
    }

    if (cleverapps.meta.getType() === Metha.HOMEFIX) {
        items.push({
            name: "MethaStarsItem",
            plusButton: true,
            value: function () {
                return cleverapps.home.stars;
            },
            updater: function (f) {
                cleverapps.home.onChangeStars = f;
            },
            onClickWindow: GuideWindow,
            onClickOptions: { name: "HomefixRulesWindow" },
            icon: bundles.menubar.frames.menubar_metha_stars,
            availableOnScenes: [cleverapps.Environment.SCENE_MAIN]
        });
    }

    if (typeof match3 !== "undefined") {
        items.push({
            name: "ExpItem",
            plusButton: true,
            lottery: true,
            isClickable: function () {
                return !cleverapps.flags.videoAdsMainMonetization;
            },
            clickableUpdater: function (f) {
                cleverapps.flags.on("change:videoAdsMainMonetization", f, this);
            },
            value: function () {
                return cleverapps.exp.getExp();
            },
            updater: function (f) {
                cleverapps.exp.on("changeExp", f, this);
            },
            onClickWindow: ExpInfoWindow,
            icon: bundles.menubar.frames.exp_png,
            availableOnScenes: [cleverapps.Environment.SCENE_HEROES]
        });
    }

    if (["board", "differences"].indexOf(cleverapps.config.type) >= 0) {
        items.push({
            name: "CryptexItem",
            centerAlign: true,
            helpButton: true,
            force: Forces.CRYPTEX,
            icon: bundles.menubar.frames.cryptex_png,
            onClickWindow: CryptexWindow,
            modelClass: CryptexMenuBarItem,
            availableOnScenes: function () {
                return Game.currentGame && Game.currentGame.cryptex && [cleverapps.Environment.SCENE_GAME];
            }
        });
    }

    items.push({
        name: "BonusRoundTimerItem",
        centerAlign: true,
        tooltip: "BonusRoundCountdownTooltip",
        animation: bundles.menubar.jsons.bound_round_timer_json,
        modelClass: BonusRoundMenuBarItem,
        availableOnScenes: function () {
            return Game.currentGame && Game.currentGame.bonusRoundCountDown && [cleverapps.Environment.SCENE_GAME];
        }
    });

    return items;
};
