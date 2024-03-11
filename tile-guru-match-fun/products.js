/**
 * Created by slava on 4/21/17.
 */

if (typeof cc === "undefined") {
    var cleverapps = require("../../utils");

    if (typeof window !== "undefined" && window.CRMClientApp) {
        cleverapps.config.source = undefined;
    }

    // eslint-disable-next-line no-unused-vars
    var bundles = {
        reward_icons: {
            frames: {}
        }
    };

    var RewardsConfig = {
        Packs: []
    };

    var LivesProductTile;
    var PackProductTile;
    var SubscriptionTileModel;
    var SubscriptionTile;
    var GrowthFundTile;
    var GrowthFundTileModel;
    var BuyLivesTileModel;
    var PiggyBank, PackManager, GrowthFund, Offer;
}

var Products = {
};

Products.DEPRECATED = {};

Products.ACTIVE = {};
Products.MBGA_COIN_PRODUCTS = {};

Products.initialize = function () {
    Object.assign(Products.DEPRECATED, {
        pack500: { // deprecated since 22.06.2022
            projects: ["mergecraft", "wondermerge"],
            price: 5.99,
            image: false
        },

        pack2100: { // deprecated since 22.06.2022
            projects: ["mergecraft", "wondermerge"],
            price: 25.99,
            image: false
        },

        pack14000: { // deprecated since 22.06.2022
            projects: ["mergecraft", "wondermerge"],
            price: 129.99,
            image: false
        },

        pack3800: { // deprecated since 22.06.2022
            projects: ["mergecraft", "wondermerge"],
            price: 25.99,
            image: false
        },

        pack25000: { // deprecated since 22.06.2022
            projects: ["mergecraft", "wondermerge"],
            price: 129.99,
            image: false
        },

        addMoves: { // deprecated since 25.04.2023
            projects: ["heroes", "riddles", "spades", "tripeaks"],
            title: "Shop.AddMoves.Title",
            description: "Shop.AddMoves.Description",
            boughtMessage: "Shop.AddMoves.BoughtMessage",
            price: 0.99,
            restoreReward: {
                hard: 200
            }
        },

        addMoves1: { // deprecated since 25.04.2023
            projects: ["adventure", "heroes", "riddles", "runes", "spades", "tripeaks"],
            title: "Shop.AddMoves1.Title",
            description: "Shop.AddMoves1.Description",
            boughtMessage: "Shop.AddMoves.BoughtMessage",
            price: 0.99,
            moves: 5,
            bonus: 1,
            restoreReward: {
                hard: 200
            }
        },

        addMoves2: { // deprecated since 25.04.2023
            projects: ["adventure", "heroes", "riddles", "runes", "spades", "tripeaks"],
            title: "Shop.AddMoves2.Title",
            description: "Shop.AddMoves2.Description",
            boughtMessage: "Shop.AddMoves.BoughtMessage",
            price: 1.99,
            moves: 10,
            bonus: 1,
            restoreReward: {
                hard: 400
            }
        },

        addMoves3: { // deprecated since 25.04.2023
            projects: ["adventure", "heroes", "riddles", "runes", "spades", "tripeaks"],
            title: "Shop.AddMoves3.Title",
            description: "Shop.AddMoves3.Description",
            boughtMessage: "Shop.AddMoves.BoughtMessage",
            price: 2.99,
            moves: 15,
            bonus: 1,
            restoreReward: {
                hard: 600
            }
        },

        addMoves5: { // deprecated since 25.04.2023
            projects: ["adventure", "heroes", "riddles", "runes", "spades", "tripeaks"],
            title: "Shop.AddMoves5.Title",
            description: "Shop.AddMoves5.Description",
            boughtMessage: "Shop.AddMoves.BoughtMessage",
            price: 4.99,
            moves: 15,
            bonus: 2,
            restoreReward: {
                hard: 1000
            }
        }
    });

    if (cleverapps.config.name === "tripeaks") {
        cleverapps.override(Products.DEPRECATED, {
            addMoves: {
                id: {
                    yandex: "addMoves"
                },
                image: "/res/fbproducts/addmoves0.png"
            },

            addMoves1: {
                price: 1.49
            }
        });
    }

    if (["riddles", "tripeaks", "heroes", "adventure", "runes"].indexOf(cleverapps.config.name) !== -1) {
        cleverapps.override(Products.DEPRECATED, {
            addMoves1: {
                id: {
                    yandex: "addMoves1"
                },
                image: "/res/fbproducts/addmoves.png"
            },

            addMoves2: {
                id: {
                    yandex: "addMoves2"
                },
                image: "/res/fbproducts/addmoves.png"
            },

            addMoves3: {
                id: {
                    yandex: "addMoves3"
                },
                image: "/res/fbproducts/addmoves.png"
            },

            addMoves5: {
                id: {
                    yandex: "addMoves5"
                },
                image: "/res/fbproducts/addmoves.png"
            }
        });
    }

    if (cleverapps.config.type === "match3") {
        Object.assign(Products.ACTIVE, {
            buyExp10: {
                title: "Shop.BuyExp10.Title",
                description: "Shop.BuyExp10.Description",
                boughtMessage: "Shop.BuyExp10.BoughtMessage",
                price: 9.99,
                reward: {
                    exp: 10
                }
            },
            buyExp150: {
                title: "Shop.BuyExp150.Title",
                description: "Shop.BuyExp150.Description",
                boughtMessage: "Shop.BuyExp150.BoughtMessage",
                price: 99.99,
                reward: {
                    exp: 150
                }
            }
        });
    }

    if (!["merge", "tile3", "none", "blocks"].includes(cleverapps.config.type)) {
        Object.assign(Products.ACTIVE, {
            piggybank500: {
                title: "Shop.PiggyBank1.Title",
                description: "Shop.PiggyBank1.Description",
                price: 2.99,
                restoreLogic: PiggyBank,
                reward: {
                    hard: 500
                }
            },
            piggybank1800: {
                title: "Shop.PiggyBank2.Title",
                description: "Shop.PiggyBank2.Description",
                price: 9.99,
                restoreLogic: PiggyBank,
                reward: {
                    hard: 1800
                }
            },
            piggybank6000: {
                title: "Shop.PiggyBank3.Title",
                description: "Shop.PiggyBank3.Description",
                price: 29.99,
                restoreLogic: PiggyBank,
                reward: {
                    hard: 6000
                }
            },
            piggybank25000: {
                title: "Shop.PiggyBank4.Title",
                description: "Shop.PiggyBank4.Description",
                price: 99.99,
                restoreLogic: PiggyBank,
                reward: {
                    hard: 25000
                }
            }
        });
    }

    if (["merge", "tile3"].includes(cleverapps.config.type)) {
        Object.assign(Products.MBGA_COIN_PRODUCTS, {
            coins350: {
                id: {},
                title: "Shop.Coins350.Title",
                description: "Shop.Coins350.Description",
                price: 1.99,
                reward: {
                    soft: 350
                },
                icon: "shop_coins_very_small_png",
                image: "/res/fbproducts/soft_currency_very_small_200.png?v=2",
                boughtMessage: "Product.SoftCurrencyBought"
            },
            coins1100: {
                id: {},
                title: "Shop.Coins1100.Title",
                description: "Shop.Coins1100.Description",
                price: 3.99,
                reward: {
                    soft: 1100
                },
                icon: "shop_coins_small_png",
                image: "/res/fbproducts/soft_currency_small_200.png?v=2",
                boughtMessage: "Product.SoftCurrencyBought"
            },
            coins3000: {
                id: {},
                title: "Shop.Coins3000.Title",
                description: "Shop.Coins3000.Description",
                price: 7.99,
                reward: {
                    soft: 3000
                },
                icon: "shop_coins_medium_png",
                image: "/res/fbproducts/soft_currency_medium_200.png?v=2",
                boughtMessage: "Product.SoftCurrencyBought"
            },
            coins7000: {
                id: {},
                title: "Shop.Coins7000.Title",
                description: "Shop.Coins7000.Description",
                price: 17.99,
                reward: {
                    soft: 7000
                },
                icon: "shop_coins_large_png",
                image: "/res/fbproducts/soft_currency_large_200.png?v=2",
                boughtMessage: "Product.SoftCurrencyBought"
            }
        });
    }

    if (cleverapps.config.type === "merge") {
        Object.assign(Products.ACTIVE, {
            expeditionPack: {
                title: "Shop.expeditionPack.title",
                description: "Shop.expeditionPack.description",
                boughtMessage: "Shop.expeditionPack.boughtMessage",
                price: 9.99,
                restoreLogic: Offer,
                restoreReward: {
                    hard: 1200
                }
            },

            growthFund: {
                title: "Shop.growthFund.title",
                description: "Shop.growthFund.description",
                boughtMessage: "Shop.growthFund.boughtMessage",
                value: "800%",
                icon: "growth_fund_icon",
                mainSceneOnly: true,
                price: 24.99,
                clanGift: true,
                restoreLogic: GrowthFund,
                restoreReward: {
                    hard: 2800
                },
                TileModelClass: GrowthFundTileModel,
                ViewClassName: GrowthFundTile
            }
        });
    }

    if (cleverapps.config.lives && !["tile3", "none"].includes(cleverapps.config.type)) {
        Object.assign(Products.ACTIVE, {
            unlimitedLives: {
                title: "UnlimitedLives.Title",
                description: "UnlimitedLives.Description",
                boughtMessage: "UnlimitedLivesBought",
                image: "/res/fbproducts/unlimitedlives.png",
                price: 2.99,
                reward: {
                    unlimitedLives: "3 days"
                },
                icon: "unlimitedLives_png",
                animation: "animation",
                ViewClassName: LivesProductTile,
                TileModelClass: BuyLivesTileModel
            }
        });
    }

    if (!["none"].includes(cleverapps.config.type)) {
        Object.assign(Products.ACTIVE, {
            gold500: {
                title: "Shop.Gold500.Title",
                description: "Shop.Gold500.Description",
                price: 2.99,
                reward: {
                    hard: 500
                },
                rewardsIcon: "shop_gold_png",
                icon: "shop_gold_very_small_png"
            },
            gold1800: {
                title: "Shop.Gold1800.Title",
                description: "Shop.Gold1800.Description",
                price: 9.99,
                oldPrice: 1.99,
                label: 1800,
                reward: {
                    hard: 1800
                },
                rewardsIcon: "shop_gold_png",
                icon: "shop_gold_small_png"
            },
            gold3800: {
                title: "Shop.Gold3800.Title",
                description: "Shop.Gold3800.Description",
                price: 19.99,
                reward: {
                    hard: 3800
                },
                rewardsIcon: "shop_gold_png",
                icon: "shop_gold_medium_png"
            },
            gold6000: {
                title: "Shop.Gold6000.Title",
                description: "Shop.Gold6000.Description",
                price: 29.99,
                clanGift: true,
                oldPrice: 5.99,
                label: 6000,
                reward: {
                    hard: 6000
                },
                rewardsIcon: "shop_gold_png",
                icon: "shop_gold_large_png"
            },
            gold25000: {
                title: "Shop.Gold25000.Title",
                description: "Shop.Gold25000.Description",
                price: 99.99,
                clanGift: true,
                reward: {
                    hard: 25000
                },
                rewardsIcon: "shop_gold_png",
                icon: "shop_gold_huge_png"
            },

            starterPack0: {
                title: "StarterPack0.Title",
                description: "StarterPack0.Description",
                boughtMessage: "StarterPack.Bought",
                boughtMessageParams: {
                    title: "StarterPack0.Title"
                },
                restoreLogic: PackManager,
                reward: RewardsConfig.Packs[0],
                stage: 0,
                mainSceneOnly: true,
                price: 0.99,
                available: {
                    level: 2.65
                }
            },
            starterPack: {
                title: "StarterPack1.Title",
                description: "StarterPack1.Description",
                boughtMessage: "StarterPack.Bought",
                boughtMessageParams: {
                    title: "StarterPack1.Title"
                },
                restoreLogic: PackManager,
                reward: RewardsConfig.Packs[1],
                stage: 1,
                mainSceneOnly: true,
                price: 4.99,
                available: {
                    level: 4.65
                }
            },
            starterPack2: {
                title: "StarterPack2.Title",
                description: "StarterPack2.Description",
                boughtMessage: "StarterPack.Bought",
                boughtMessageParams: {
                    title: "StarterPack2.Title"
                },
                restoreLogic: PackManager,
                reward: RewardsConfig.Packs[2],
                stage: 2,
                mainSceneOnly: true,
                price: 29.99,
                available: {
                    level: 6.65
                }
            }
        });
    }

    if (!["none"].includes(cleverapps.config.type)) {
        Object.assign(Products.ACTIVE, {
            subsWeek: {
                title: "Shop.SubsWeek.Title",
                description: "Shop.SubsWeek.Description",
                boughtMessage: "Shop.SubsWeek.BoughtMessage",
                icon: "prem_tile_icon",
                price: 9.99,
                clanGift: true,
                trial: "1 day",
                period: "2 weeks",
                type: "subscription",
                projects: ["riddles", "heroes", "wordsoup", "crocword", "olympics", "tripeaks", "scramble", "magicwords", "mergecraft", "wondermerge", "fairy", "runes", "differences"]
            },
            subsMonth: {
                title: "Shop.SubsMonth.Title",
                description: "Shop.SubsMonth.Description",
                boughtMessage: "Shop.SubsMonth.BoughtMessage",
                icon: "prem_tile_icon",
                price: 14.99,
                clanGift: true,
                period: "1 month",
                type: "subscription",
                projects: ["riddles", "heroes", "wordsoup", "crocword", "olympics", "tripeaks", "scramble", "magicwords", "mergecraft", "wondermerge", "fairy", "runes", "differences"],
                TileModelClass: SubscriptionTileModel,
                ViewClassName: SubscriptionTile
            },

            // TEST staging OK subscriptions
            subsWeekTest: {
                title: "Shop.SubsWeek.Title",
                description: "Shop.SubsWeek.Description",
                boughtMessage: "Shop.SubsWeek.BoughtMessage",
                icon: "prem_tile_icon",
                price: 0.05,
                trial: "1 day",
                period: "2 weeks",
                type: "subscription",
                projects: ["riddles", "heroes", "wordsoup", "crocword", "fairy"],
                image: "/res/fbproducts/subsweek.png"
            },
            subsMonthTest: {
                title: "Shop.SubsMonth.Title",
                description: "Shop.SubsMonth.Description",
                boughtMessage: "Shop.SubsMonth.BoughtMessage",
                icon: "prem_tile_icon",
                price: 0.1,
                period: "1 month",
                type: "subscription",
                projects: ["riddles", "heroes", "wordsoup", "crocword", "fairy"],
                image: "/res/fbproducts/subsmonth.png"
            }
        });
    }

    // OLD ids COMPATIBILITY
    if (["mergecraft", "wondermerge", "riddles", "tripeaks", "heroes", "scramble", "wordsoup", "crocword", "olympics", "magicwords", "adventure", "runes", "differences"].indexOf(cleverapps.config.name) !== -1) {
        cleverapps.override(Products.ACTIVE.gold500, {
            id: {
                facebook: "500gold.html",
                android: "500gold",
                amazon: "500gold",
                ios: "500gold",
                instant: "500gold",
                yandex: "500gold"
            },
            image: "/res/fbproducts/gold2_200.png?v=3"
        });

        cleverapps.override(Products.ACTIVE.gold1800, {
            id: {
                facebook: "1800gold.html",
                android: "1800gold",
                amazon: "1800gold",
                ios: "1800gold",
                instant: "1800gold"
            },
            image: "/res/fbproducts/gold3_200.png?v=2"
        });

        cleverapps.override(Products.ACTIVE.gold3800, {
            id: {
                facebook: "3800gold.html",
                android: "3800gold",
                amazon: "3800gold",
                ios: "3800gold",
                instant: "3800gold"
            },
            image: "/res/fbproducts/heap_gold.png?v=4"
        });

        cleverapps.override(Products.ACTIVE.gold6000, {
            id: {
                facebook: "6000gold.html",
                android: "6000gold",
                amazon: "6000gold",
                ios: "6000gold",
                instant: "6000gold"
            },
            image: "/res/fbproducts/gold4_200.png?v=1"
        });

        cleverapps.override(Products.ACTIVE.gold25000, {
            id: {
                facebook: "25000gold.html",
                android: "25000gold",
                amazon: "25000gold",
                ios: "25000gold",
                instant: "25000gold"
            },
            image: "/res/fbproducts/gold5_200.png?v=1"
        });

        cleverapps.override(Products.ACTIVE, {
            starterPack0: {
                id: {
                    yandex: "StarterPack0"
                },
                image: "/res/fbproducts/starter_pack0.png?v=1"
            },
            starterPack: {
                id: {
                    yandex: "starterPack"
                },
                image: "/res/fbproducts/starter_pack.png?v=1"
            },
            starterPack2: {
                id: {
                    yandex: "starterPack2"
                },
                image: "/res/fbproducts/starter_pack2.png?v=1"
            }
        });

        if (cleverapps.config.type === "merge") {
            cleverapps.override(Products.ACTIVE.expeditionPack, {
                image: "/res/fbproducts/expedition_pack.png"
            });

            cleverapps.override(Products.ACTIVE.growthFund, {
                image: "/res/fbproducts/growth_fund.png"
            });
        }

        if (!["merge", "tile3"].includes(cleverapps.config.type)) {
            cleverapps.override(Products.ACTIVE, {
                piggybank500: {
                    image: "/res/fbproducts/piggy_bank.png?v=1"
                },
                piggybank1800: {
                    image: "/res/fbproducts/piggy_bank.png?v=1"
                },
                piggybank6000: {
                    image: "/res/fbproducts/piggy_bank.png?v=1"
                },
                piggybank25000: {
                    image: "/res/fbproducts/piggy_bank.png?v=1"
                }
            });
        }

        if (Products.ACTIVE.unlimitedLives) {
            cleverapps.override(Products.ACTIVE.unlimitedLives, {
                id: {
                    yandex: "unlimitedLives"
                }
            });
        }

        cleverapps.override(Products.ACTIVE, {
            subsWeek: {
                image: "/res/fbproducts/premium.png"
            },
            subsMonth: {
                image: "/res/fbproducts/premium.png"
            },
            subsWeekTest: {
                image: "/res/fbproducts/premium.png"
            },
            subsMonthTest: {
                image: "/res/fbproducts/premium.png"
            }
        });
    }

    // OLD PRODUCTS COMPATIBILITY
    if (["riddles", "heroes", "runes", "adventure", "scramble", "tripeaks"].indexOf(cleverapps.config.name) !== -1) {
        Object.assign(Products.ACTIVE, {
            sweetPack: {
                title: "TileShop.sweetPack.Title",
                description: "TileShop.sweetPack.Description",
                image: "/res/fbproducts/sweet_pack_200.png",
                boughtMessage: "Shop.sweetPack.boughtMessage",
                price: 5.99,
                reward: {
                    hard: 500,
                    boosters: {
                        0: 1,
                        1: 1
                    }
                },
                icon: "pack500_png",
                ViewClassName: PackProductTile
            },

            jamPack: {
                title: "TileShop.jamPack.Title",
                description: "TileShop.jamPack.Description",
                image: "/res/fbproducts/jam_pack_200.png",
                boughtMessage: "Shop.jamPack.boughtMessage",
                price: 12.99,
                reward: {
                    hard: 1800,
                    boosters: {
                        0: 1,
                        1: 1,
                        2: 1
                    }
                },
                icon: "pack1800_png",
                ViewClassName: PackProductTile
            },

            tastyPack: {
                title: "TileShop.tastyPack.Title",
                description: "TileShop.tastyPack.Description",
                image: "/res/fbproducts/tasty_pack_200.png?v=1",
                boughtMessage: "Shop.tastyPack.boughtMessage",
                price: 25.99,
                reward: {
                    hard: 3800,
                    boosters: {
                        0: 3,
                        1: 3,
                        2: 3
                    }
                },
                icon: "pack3800_png",
                ViewClassName: PackProductTile
            },

            honeyPack: {
                title: "TileShop.honeyPack.Title",
                description: "TileShop.honeyPack.Description",
                image: "/res/fbproducts/honey_pack_200.png?v=1",
                boughtMessage: "Shop.honeyPack.boughtMessage",
                price: 39.99,
                reward: {
                    hard: 6000,
                    boosters: {
                        0: 5,
                        1: 5,
                        2: 5
                    }
                },
                icon: "pack6000_png",
                ViewClassName: PackProductTile
            },

            epicPack: {
                title: "TileShop.epicPack.Title",
                description: "TileShop.epicPack.Description",
                image: "/res/fbproducts/epic_pack_200.png?v=1",
                boughtMessage: "Shop.epicPack.boughtMessage",
                price: 129.99,
                reward: {
                    hard: 25000,
                    boosters: {
                        0: 20,
                        1: 20,
                        2: 20
                    }
                },
                icon: "pack25000_png",
                ViewClassName: PackProductTile
            }
        });
    }

    if (cleverapps.config.name === "zenmatch") {
        Object.assign(Products.ACTIVE, {
            kit3: {
                title: "Kit3.Title",
                description: "Kit3.Description",
                boughtMessage: "Kit3.Bought",
                restoreReward: RewardsConfig.kit3,
                image: "/res/fbproducts/kit.png",
                price: 2.99
            },

            kit10: {
                title: "Kit10.Title",
                description: "Kit10.Description",
                boughtMessage: "Kit10.Bought",
                restoreReward: RewardsConfig.kit10,
                image: "/res/fbproducts/kit.png",
                price: 9.99
            },

            kit50: {
                title: "Kit50.Title",
                description: "Kit50.Description",
                boughtMessage: "Kit50.Bought",
                image: "/res/fbproducts/kit.png",
                price: 49.99
            }
        });
    }

    if (["merge", "tile3", "blocks"].includes(cleverapps.config.type)) {
        Products.ACTIVE.gold500.reward = { hard: 200 };
        Products.ACTIVE.gold1800.reward = { hard: 900 };
        Products.ACTIVE.gold3800.reward = { hard: 2100 };
        Products.ACTIVE.gold6000.reward = { hard: 3500 };
        Products.ACTIVE.gold25000.reward = { hard: 14000 };
    }

    if (cleverapps.config.type === "merge") {
        Products.ACTIVE.starterPack0.available = {
            level: 6.2
        };
        Products.ACTIVE.starterPack.available = {
            level: 8.2
        };
        Products.ACTIVE.starterPack2.available = {
            level: 10.2
        };
    }

    if (cleverapps.config.type === "solitaire" && cleverapps.config.name !== "spades") {
        Products.ACTIVE.sweetPack.reward.boosters = { 10: 2, 11: 2, 12: 2 };
        Products.ACTIVE.jamPack.reward.boosters = { 10: 3, 11: 3, 12: 3 };
        Products.ACTIVE.tastyPack.reward.boosters = { 10: 5, 11: 5, 12: 5 };
        Products.ACTIVE.honeyPack.reward.boosters = { 10: 7, 11: 7, 12: 7 };
        Products.ACTIVE.epicPack.reward.boosters = { 10: 30, 11: 30, 12: 30 };
    }

    if (cleverapps.config.type === "match3") {
        Products.ACTIVE.sweetPack.reward.boosters = { 5: 1, 6: 1, 7: 1 };
        Products.ACTIVE.jamPack.reward.boosters = { 5: 2, 6: 2, 7: 2 };
        Products.ACTIVE.tastyPack.reward.boosters = {
            0: 3, 1: 3, 5: 3, 6: 3, 7: 3
        };
        Products.ACTIVE.honeyPack.reward.boosters = {
            0: 5, 1: 5, 5: 5, 6: 5, 7: 5
        };
        Products.ACTIVE.epicPack.reward.boosters = {
            0: 18, 1: 18, 5: 18, 6: 18, 7: 18
        };
    }

    if (["android", "ios", "macos"].indexOf(cleverapps.config.source) !== -1) {
        Products.ACTIVE.subsWeek.price = 4.99;
        Products.ACTIVE.subsWeek.trial = "3 days";
        Products.ACTIVE.subsWeek.period = "1 week";
        Products.ACTIVE.subsWeek.title = "Shop.SubsWeek.ThreeDays.Title";
        Products.ACTIVE.subsWeek.description = "Shop.SubsWeek.ThreeDays.Description";
    }

    if (cleverapps.config.name === "scramble") {
        Products.ACTIVE.sweetPack.reward.boosters = { 13: 2, 14: 2, 15: 2 };
        Products.ACTIVE.jamPack.reward.boosters = { 13: 3, 14: 3, 15: 3 };
        Products.ACTIVE.tastyPack.reward.boosters = { 13: 5, 14: 5, 15: 5 };
        Products.ACTIVE.honeyPack.reward.boosters = { 13: 7, 14: 7, 15: 7 };
        Products.ACTIVE.epicPack.reward.boosters = { 13: 30, 14: 30, 15: 30 };
    }

    if (cleverapps.config.name === "mergecraft") {
        Object.assign(Products.DEPRECATED, { // deprecated since 31.07.2023
            gold1: {
                title: "Shop.Gold1.Title",
                description: "Shop.Gold1.Description",
                price: 0.99,
                reward: {
                    hard: 65
                },
                icon: "shop_gold_tiny_png",
                id: {
                    android: "1gold",
                    amazon: "1gold",
                    ios: "1gold",
                    instant: "1gold"
                },
                image: "/res/fbproducts/gold1_200.png?v=3"
            },
            gold5: {
                title: "Shop.Gold5.Title",
                description: "Shop.Gold5.Description",
                price: 4.99,
                reward: {
                    hard: 455
                },
                icon: "shop_gold_very_small_png",
                id: {
                    android: "5gold",
                    amazon: "5gold",
                    ios: "5gold",
                    instant: "5gold"
                },
                image: "/res/fbproducts/gold2_200.png?v=3"
            },
            gold10: {
                title: "Shop.Gold10.Title",
                description: "Shop.Gold10.Description",
                price: 9.99,
                reward: {
                    hard: 1000
                },
                icon: "shop_gold_small_png",
                id: {
                    android: "10gold",
                    amazon: "10gold",
                    ios: "10gold",
                    instant: "10gold"
                },
                image: "/res/fbproducts/gold3_200.png?v=2"
            },
            gold20: {
                title: "Shop.Gold20.Title",
                description: "Shop.Gold20.Description",
                price: 19.99,
                reward: {
                    hard: 2220
                },
                icon: "shop_gold_medium_png",
                id: {
                    android: "20gold",
                    amazon: "20gold",
                    ios: "20gold",
                    instant: "20gold"
                },
                image: "/res/fbproducts/heap_gold.png?v=4"
            },
            gold50: {
                title: "Shop.Gold50.Title",
                description: "Shop.Gold50.Description",
                price: 49.99,
                reward: {
                    hard: 7145
                },
                icon: "shop_gold_large_png",
                id: {
                    android: "50gold",
                    amazon: "50gold",
                    ios: "50gold",
                    instant: "50gold"
                },
                image: "/res/fbproducts/gold4_200.png?v=1"
            },
            gold100: {
                title: "Shop.Gold100.Title",
                description: "Shop.Gold100.Description",
                price: 99.99,
                reward: {
                    hard: 14285
                },
                icon: "shop_gold_huge_png",
                id: {
                    android: "100gold",
                    amazon: "100gold",
                    ios: "100gold",
                    instant: "100gold"
                },
                image: "/res/fbproducts/gold5_200.png?v=1"
            }
        });
    }

    Object.keys(Products.DEPRECATED).forEach(function (key) {
        var data = Products.DEPRECATED[key];

        if (data.projects && data.projects.indexOf(cleverapps.config.name) === -1) {
            delete Products.DEPRECATED[key];
        }
    });

    Object.keys(Products.ACTIVE).forEach(function (key) {
        var data = Products.ACTIVE[key];

        if (["klondike"].indexOf(cleverapps.config.name) !== -1) {
            delete Products.ACTIVE[key];
            return;
        }

        if (data.projects && data.projects.indexOf(cleverapps.config.name) === -1) {
            delete Products.ACTIVE[key];
        }
    });

    var MyMailRuIds = {
        buyExp10: 1,
        buyExp150: 2,

        addMoves1: 8,
        addMoves2: 9,
        addMoves3: 10,
        addMoves5: 11,

        piggybank500: 12,
        piggybank1800: 13,
        piggybank6000: 14,
        piggybank25000: 15,

        addMoves: 20,

        gold500: 21,
        gold1800: 22,
        gold3800: 39,
        gold6000: 23,
        gold25000: 24,

        starterPack0: 25,
        starterPack: 26,
        starterPack2: 27,

        subsWeek: 31,
        subsMonth: 32,
        subsWeekTest: 33,
        subsMonthTest: 34,

        sweetPack: 35,
        jamPack: 36,
        tastyPack: 40,
        honeyPack: 37,
        epicPack: 38,

        unlimitedLives: 64,

        growthFund: 73,
        expeditionPack: 74,

        coins350: 75,
        coins1100: 76,
        coins3000: 77,
        coins7000: 78
    };

    Object.keys(Products.ACTIVE).concat(Object.keys(Products.MBGA_COIN_PRODUCTS), Object.keys(Products.DEPRECATED)).forEach(function (key) {
        var data = Products.MBGA_COIN_PRODUCTS[key] || Products.ACTIVE[key] || Products.DEPRECATED[key];

        if (["macos", "ios"].indexOf(cleverapps.config.source) !== -1) {
            if (data.price >= 100) {
                data.price = 99.99;
            }
        }

        data.key = key;
        data.id = data.id || {};

        var platforms = ["android", "amazon", "ios", "instant", "yandex", "samsung", "rustore"];

        if (data.type === "subscription") {
            platforms.push("ok");
        }

        platforms.forEach(function (platform) {
            var id = key.toLowerCase();
            if (data.id[platform] === undefined) {
                data.id[platform] = id;
            }
        });

        if (data.id.facebook === undefined) {
            data.id.facebook = key.toLowerCase() + ".html";
        }

        if (data.id.wortal === undefined) {
            data.id.wortal = "jp.rgames.testcrocword.purchase." + key.toLowerCase();
        }

        if (MyMailRuIds[key]) {
            data.id.mymailru = MyMailRuIds[key];
            data.id.mbga = MyMailRuIds[key];
        }

        if (data.image === undefined) {
            data.image = "/res/fbproducts/" + key.toLowerCase() + ".png";
        }

        ["android", "amazon", "ios"].forEach(function (platform) {
            var iap = cleverapps.config[platform] && cleverapps.config[platform].iap || {};
            var items = iap.items || {};
            var prefix = iap.prefix || (platform === "android" ? "" : "com.cleverapps." + cleverapps.config.name + ".");
            data.id[platform] = items[key] || (prefix + data.id[platform]);
        });
    });

    var products = cleverapps.clone(Products.DEPRECATED, true);
    Object.assign(products, cleverapps.clone(Products.ACTIVE, true));

    if (cleverapps.platform && cleverapps.platform.oneOf(Mobage, SPMobage)) {
        Object.assign(products, cleverapps.clone(Products.MBGA_COIN_PRODUCTS));
    }

    cleverapps.config.products = products;
};

if (typeof cc === "undefined") {
    Products.initialize();
    module.exports = Products;
}
