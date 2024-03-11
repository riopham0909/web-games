/**
 * Created by mac on 1/25/21
 */

var VirtualProducts = {};

VirtualProducts.initialize = function () {
    if (cleverapps.config.lives) {
        VirtualProducts.refillLives = {
            icon: "refillLives_5_png",
            title: "LivesShopWindow.products.refillLives",
            spentEvent: cleverapps.EVENTS.SPENT.LIVES,
            currency: "hard",
            price: 99,
            TileModelClass: RefillLivesTileModel,
            ViewClassName: LivesProductTile
        };

        VirtualProducts.livesForVideo = {
            icon: "lives_for_video_png",
            title: "LivesShopWindow.products.livesForVideo",
            description: "LivesForVideoProduct.description",
            reward: {
                lives: 1
            },
            adsLimit:
                function () {
                    return AdsLimits.TYPES.LIVES;
                },
            TileModelClass: LimitedVideoTileModel,
            ViewClassName: LivesProductTile
        };

        VirtualProducts.askLives = {
            icon: "askLives_png",
            title: "LivesShopWindow.products.askLives",
            TileModelClass: AskLivesTileModel,
            ViewClassName: LivesProductTile
        };

        if (cleverapps.config.type === "tile3") {
            VirtualProducts.unlimitedLives = {
                title: "UnlimitedLives.Title",
                description: "UnlimitedLives.Description",
                spentEvent: cleverapps.EVENTS.SPENT.LIVES,
                currency: "hard",
                price: 290,
                reward: {
                    unlimitedLives: "3 days"
                },
                icon: "unlimitedLives_png",
                animation: "animation",
                ViewClassName: LivesProductTile,
                TileModelClass: BuyLivesTileModel
            };

            VirtualProducts.buyLife = {
                icon: "life_1_png",
                title: "LivesShopWindow.products.buyLive",
                spentEvent: cleverapps.EVENTS.SPENT.LIVES,
                currency: "soft",
                price: 249,
                reward: {
                    lives: 1
                },
                TileModelClass: BuyLivesTileModel,
                ViewClassName: LivesProductTile
            };
        }
    }

    if (cleverapps.config.energy) {
        VirtualProducts.buyEnergy350 = {
            icon: "energy_for_coins_png",
            title: "LivesShopWindow.products.buyEnergy",
            rewardsIcon: "shop_energy_png",
            currency: "soft",
            price: 350,
            reward: 90,
            discount: "66%",
            timeout: cleverapps.parseInterval("24 hour"),
            TileModelClass: BuyEnergyTileModel,
            ViewClassName: LivesProductTile
        };

        VirtualProducts.buyEnergy700 = {
            icon: "energy_for_coins_png",
            title: "LivesShopWindow.products.buyEnergy",
            rewardsIcon: "shop_energy_png",
            currency: "soft",
            price: 700,
            reward: 90,
            discount: "33%",
            disableProductIds: ["buyEnergy350"],
            timeout: cleverapps.parseInterval("24 hour"),
            TileModelClass: BuyEnergyTileModel,
            ViewClassName: LivesProductTile
        };

        VirtualProducts.buyEnergy = {
            icon: "energy_for_coins_png",
            title: "LivesShopWindow.products.buyEnergy",
            rewardsIcon: "shop_energy_png",
            currency: "soft",
            price: 1050,
            reward: 90,
            disableProductIds: ["buyEnergy350", "buyEnergy700"],
            TileModelClass: BuyEnergyTileModel,
            ViewClassName: LivesProductTile
        };

        VirtualProducts.energyLottery = {
            icon: "energy_lottery_png",
            title: "LivesShopWindow.products.energyLottery",
            attention: true,
            TileModelClass: EnergyLotteryTileModel,
            ViewClassName: LivesProductTile
        };

        VirtualProducts.energyForVideo = {
            icon: "energy_for_video_png",
            title: "LivesShopWindow.products.energyForVideo",
            description: "EnergyForVideoProduct.description",
            rewardsIcon: "shop_energy_png",
            reward: {
                energy: 30
            },
            adsLimit: function () {
                switch (cleverapps.lives && cleverapps.lives.slot) {
                    case CustomSyncers.EXPEDITION_SLOT1: return AdsLimits.TYPES.ENERGY_1;
                    case CustomSyncers.EXPEDITION_SLOT2: return AdsLimits.TYPES.ENERGY_2;
                    case CustomSyncers.EXPEDITION_SLOT3: return AdsLimits.TYPES.ENERGY_3;
                    default: return AdsLimits.TYPES.ENERGY;
                }
            },
            TileModelClass: LimitedVideoTileModel,
            ViewClassName: LivesProductTile
        };

        VirtualProducts.energyForVideoShort = {
            icon: "energy_for_video_png",
            title: "LivesShopWindow.products.energyForVideoShort",
            description: "EnergyForVideoProduct.description",
            rewardsIcon: "shop_energy_png",
            reward: {
                energy: 5
            },
            adsLimit: function () {
                switch (cleverapps.lives && cleverapps.lives.slot) {
                    case CustomSyncers.EXPEDITION_SLOT1: return AdsLimits.TYPES.ENERGY_1_SHORT;
                    case CustomSyncers.EXPEDITION_SLOT2: return AdsLimits.TYPES.ENERGY_2_SHORT;
                    case CustomSyncers.EXPEDITION_SLOT3: return AdsLimits.TYPES.ENERGY_3_SHORT;
                    default: return AdsLimits.TYPES.ENERGY_SHORT;
                }
            },
            TileModelClass: LimitedVideoTileModel,
            ViewClassName: LivesProductTile
        };
    }

    VirtualProducts.softCurrencyVerySmall = {
        icon: "shop_coins_very_small_png",
        title: "LivesShopWindow.products.softCurrencyVerySmall",
        rewardsIcon: "shop_coin_png",
        realProductId: "coins350",
        currency: "hard",
        price: 80,
        reward: { soft: 350 },
        TileModelClass: SoftCurrencyTileModel,
        ViewClassName: SoftCurrencyTile
    };

    VirtualProducts.softCurrencySmall = {
        icon: "shop_coins_small_png",
        title: "LivesShopWindow.products.softCurrencySmall",
        rewardsIcon: "shop_coin_png",
        realProductId: "coins1100",
        currency: "hard",
        price: 250,
        reward: { soft: 1100 },
        TileModelClass: SoftCurrencyTileModel,
        ViewClassName: SoftCurrencyTile
    };

    VirtualProducts.softCurrencyMedium = {
        icon: "shop_coins_medium_png",
        title: "LivesShopWindow.products.softCurrencyMedium",
        rewardsIcon: "shop_coin_png",
        realProductId: "coins3000",
        currency: "hard",
        price: 600,
        reward: { soft: 3000 },
        TileModelClass: SoftCurrencyTileModel,
        ViewClassName: SoftCurrencyTile
    };

    VirtualProducts.softCurrencyLarge = {
        icon: "shop_coins_large_png",
        title: "LivesShopWindow.products.softCurrencyLarge",
        rewardsIcon: "shop_coin_png",
        realProductId: "coins7000",
        currency: "hard",
        price: 1400,
        reward: { soft: 7000 },
        TileModelClass: SoftCurrencyTileModel,
        ViewClassName: SoftCurrencyTile
    };

    VirtualProducts.hardForVideo = {
        icon: "gold_for_video_png",
        attention: true,
        title: "TileShop.products.hardForVideo",
        rewardsIcon: "shop_gold_png",
        reward: {
            hard: cleverapps.config.type === "merge" ? [1, 3] : 10
        },
        mainMonetizationReward: {
            hard: cleverapps.config.type === "merge" ? [3, 8] : 10
        },
        adsLimit: function () {
            return AdsLimits.TYPES.HARD;
        },
        TileModelClass: LimitedVideoTileModel,
        ViewClassName: cleverapps.config.ui === "heroes" ? PackProductTile : CoinsProductTile
    };

    if (cleverapps.config.type === "tile3") {
        VirtualProducts.piggybankSmall = {
            title: "Shop.PiggyBank1.Title",
            description: "Shop.PiggyBank1.Description",
            currency: "hard",
            spentEvent: cleverapps.EVENTS.SPENT.PIGGY_BANK,
            price: 290,
            restoreLogic: PiggyBank,
            reward: {
                soft: 2120
            }
        };

        VirtualProducts.piggybankMedium = {
            title: "Shop.PiggyBank2.Title",
            description: "Shop.PiggyBank2.Description",
            currency: "hard",
            spentEvent: cleverapps.EVENTS.SPENT.PIGGY_BANK,
            price: 990,
            restoreLogic: PiggyBank,
            reward: {
                soft: 7640
            }
        };

        VirtualProducts.piggybankLarge = {
            title: "Shop.PiggyBank3.Title",
            description: "Shop.PiggyBank3.Description",
            currency: "hard",
            spentEvent: cleverapps.EVENTS.SPENT.PIGGY_BANK,
            price: 5990,
            restoreLogic: PiggyBank,
            reward: {
                soft: 25450
            }
        };

        VirtualProducts.piggybankHuge = {
            title: "Shop.PiggyBank4.Title",
            description: "Shop.PiggyBank4.Description",
            currency: "hard",
            spentEvent: cleverapps.EVENTS.SPENT.PIGGY_BANK,
            price: 9900,
            restoreLogic: PiggyBank,
            reward: {
                soft: 106060
            }
        };
    }

    if (["mergecraft", "wondermerge", "fairy"].includes(cleverapps.config.name)) {
        Object.assign(VirtualProducts, {
            caravan0: {
                order: 0,
                title: "Caravan.Title0",
                price: 349,
                icon: bundles.caravan.frames.caravan_chest_0,
                person: bundles.caravan.frames.caravan_person_0,
                reward: {
                    unit: [{
                        code: "caravanbox",
                        stage: 0,
                        amount: 1
                    }, {
                        code: "energycup",
                        stage: 0,
                        amount: 1
                    }, {
                        code: "coinscup",
                        stage: 0,
                        amount: 1
                    }],
                    energy: 50,
                    soft: 100,
                    wands: 20
                }
            },

            caravan1: {
                order: 1,
                title: "Caravan.Title1",
                price: 699,
                icon: bundles.caravan.frames.caravan_chest_1,
                person: bundles.caravan.frames.caravan_person_1,
                value: "+50%",
                reward: {
                    unit: [{
                        code: "caravanbox",
                        stage: 1,
                        amount: 1
                    }, {
                        code: "energycup",
                        stage: 1,
                        amount: 1
                    }, {
                        code: "coinscup",
                        stage: 1,
                        amount: 1
                    }],
                    energy: 130,
                    soft: 250,
                    wands: 50
                }
            },

            caravan2: {
                order: 2,
                title: "Caravan.Title2",
                price: 1499,
                icon: bundles.caravan.frames.caravan_chest_2,
                person: bundles.caravan.frames.caravan_person_2,
                value: "+100%",
                reward: {
                    unit: [{
                        code: "caravanbox",
                        stage: 2,
                        amount: 1
                    }, {
                        code: "energycup",
                        stage: 2,
                        amount: 1
                    }, {
                        code: "coinscup",
                        stage: 2,
                        amount: 1
                    }],
                    energy: 400,
                    soft: 750,
                    wands: 130
                }
            }
        });
    }

    if (cleverapps.config.type === "battlefield") {
        Object.assign(VirtualProducts, {
            troops900: {
                probabilities: [0.5, 0.5, 0],
                price: 900,
                points: 1,
                stage: 0
            },
            troops1900: {
                probabilities: [0.4, 0.59, 0.01],
                price: 1900,
                points: 2,
                stage: 1
            },
            troops3800: {
                probabilities: [0.17, 0.8, 0.03],
                price: 3800,
                points: 3,
                stage: 2
            },
            troops7500: {
                probabilities: [0.01, 0.93, 0.06],
                price: 7500,
                points: 4,
                stage: 3
            }
        });
    }

    for (var key in VirtualProducts) {
        VirtualProducts[key].key = key;
    }

    if (cleverapps.config.name === "zenmatch") {
        VirtualProducts.hardForVideo = undefined;
    }
};
