/**
 * Created by slava on 2/9/19
 */

if (typeof cc === "undefined") {
    var cleverapps = require("../utils");

    var Mission = require("./mission").Mission;
}

Mission.TYPE_COMBO = 0;
Mission.TYPE_COLLECT_MARK = 1;
Mission.TYPE_BURN_NEARBY = 2;
Mission.TYPE_LETTER = 3;
Mission.TYPE_TREASURE_SEARCH = 7;
Mission.TYPE_LANTERN = 9;
Mission.TYPE_LEVELPASS = 15;
Mission.TYPE_BUILDPASS = 15;
Mission.TYPE_STICKERS_COLLECTION = 18;
Mission.TYPE_BONUS_WORLD = 19;
Mission.TYPE_LIVESFEAST = 20;
Mission.TYPE_SLOT_MACHINE = 21;
Mission.TYPE_SOFTFEAST = 22;
Mission.TYPE_BOOSTTIME = 23;
Mission.TYPE_CHESTTIME = 24;
Mission.TYPE_SALEPASS = 25;
Mission.TYPE_KRAKENFEAST = 26;
Mission.TYPE_SLOT2_PASS = 28;
Mission.TYPE_SLOT1_FEAST = 30;
Mission.TYPE_DRAGONIA_EXPEDITION = "32v1";
Mission.TYPE_SLOT2_FEAST = 33;
Mission.TYPE_SLOT1_PASS = 34;
Mission.TYPE_UNDERSEA_EXPEDITION = "40v1";
Mission.TYPE_CARAVAN = 42;
Mission.TYPE_EXPEDITION_PASS = 44;
Mission.TYPE_EXPEDITION_FEAST = 45;
Mission.TYPE_UNDERSEA2_EXPEDITION = "46v1";
Mission.TYPE_SNAIL_FEAST = 47;
Mission.TYPE_RAPUNZEL_EXPEDITION = 48;
Mission.TYPE_DRAGONIA2_EXPEDITION = 49;
Mission.TYPE_HALLOWEEN_EXPEDITION = 50;
Mission.TYPE_RAPUNZEL2_EXPEDITION = 52;
Mission.TYPE_PERIODIC_PACK = 53;
Mission.TYPE_PERIODIC_SALE = 54;
Mission.TYPE_EASTER_EXPEDITION = 55;
Mission.TYPE_ADVENTURE_EXPEDITION = 58;
Mission.TYPE_DRAGONIA3_EXPEDITION = 59;
Mission.TYPE_HALLOWEEN_2023_EXPEDITION = 60;
Mission.TYPE_RAPUNZEL3_EXPEDITION = 62;
Mission.TYPE_XMAS_EXPEDITION = "61v1";
Mission.TYPE_CHINA_EXPEDITION = 63;
Mission.TYPE_CHAIN_SALE = 64;

Mission.OLD_VERSIONS = {};

Object.keys(Mission).forEach(function (name) {
    if (name.indexOf("TYPE_") === 0) {
        var currentVersionType = Mission[name];
        var match = String(currentVersionType).match(/^(\d+)v(\d+)$/);
        if (match) {
            for (var version = Mission.ParseTypeVersion(currentVersionType) - 1; version >= 0; --version) {
                Mission.OLD_VERSIONS[Mission.VersionType(currentVersionType, version)] = currentVersionType;
            }
        }
    }
});

Mission.OBSOLETE_TYPES = [4, 5, 6, 8, 11, 12, 13, 14, 16, 17, 27, 29, 35, 36, 37, 38, 39, 41, 43, 51, 56,
    Mission.TYPE_EASTER_EXPEDITION, Mission.TYPE_HALLOWEEN_EXPEDITION, Mission.TYPE_PERIODIC_SALE];

var Missions = {};

Missions.SEMAPHORE_ALWAYS = 0;
Missions.SEMAPHORE_PRIMARY = 1;
Missions.SEMAPHORE_SECONDARY = 2;
Missions.SEMAPHORE_CUSTOM_LANTERN = 4;

Missions.SEMAPHORE_CUSTOM_SALE = 16;
Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT1 = 32;
Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT2 = 64;
Missions.SEMAPHORE_PERIODIC_SALE = 128;

Missions.SEMAPHORE_COOLDOWNS = {};
Missions.SEMAPHORE_COOLDOWNS[Missions.SEMAPHORE_PRIMARY] = "1 hour";
Missions.SEMAPHORE_COOLDOWNS[Missions.SEMAPHORE_SECONDARY] = "2 day";
Missions.SEMAPHORE_COOLDOWNS[Missions.SEMAPHORE_CUSTOM_LANTERN] = "5 day";
Missions.SEMAPHORE_COOLDOWNS[Missions.SEMAPHORE_CUSTOM_SALE] = "7 day";
Missions.SEMAPHORE_COOLDOWNS[Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT1] = "0";
Missions.SEMAPHORE_COOLDOWNS[Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT2] = "0";
Missions.SEMAPHORE_COOLDOWNS[Missions.SEMAPHORE_PERIODIC_SALE] = "0";

Missions.initialize = function () {
    var BaseMissionData = {
        available: {
            level: 3.45
        },
        view: MissionWindow,
        duration: "1 day",
        semaphore: Missions.SEMAPHORE_SECONDARY,
        startWindow: MissionRulesOptionsBuilder,
        prize: RewardsConfig.Tournament.places,
        teaser: true
    };

    Missions[Mission.TYPE_COMBO] = Object.assign({}, BaseMissionData, {
        available: {
            level: 4.93
        },
        name: "MagicTournament",
        collectIcon: bundles.tournament_icon.frames.clover_png,
        competition: {
            step: [1, 4],
            amount: [20, 30]
        },
        bundle: "magic_tournament",
        sideBarJson: bundles.sidebar.jsons.tournament_magic_icon_json,
        finishWindow: MissionWindow
    });

    Missions[Mission.TYPE_COLLECT_MARK] = Object.assign({}, BaseMissionData, {
        available: {
            level: 3.6
        },
        name: "RoseTournament",
        collectIcon: bundles.tournament_icon.frames.rose_png,
        competition: {
            step: [10, 40],
            amount: [20, 30]
        },
        bundle: "rose_tournament",
        sideBarJson: bundles.sidebar.jsons.tournament_rose_icon_json,
        finishWindow: MissionWindow
    });

    Missions[Mission.TYPE_BURN_NEARBY] = Object.assign({}, BaseMissionData, {
        available: {
            level: 4.4
        },
        name: "TulpanTournament",
        collectIcon: bundles.tournament_icon.frames.tulpan_png,
        competition: {
            step: [3, 10],
            amount: [20, 30]
        },
        bundle: "tulpan_tournament",
        sideBarJson: bundles.sidebar.jsons.tournament_tulpan_icon_json,
        finishWindow: MissionWindow
    });

    Missions[Mission.TYPE_LETTER] = Object.assign({}, BaseMissionData, {
        name: "LetterTournament",
        collectIcon: bundles.tournament_icon.frames.mission_letter_png,
        competition: {
            step: [2, 6],
            amount: [20, 30]
        },
        sideBarJson: bundles.sidebar.jsons.mission_letter_icon_json,
        finishWindow: MissionWindow,
        bundle: "letter_tournament",
        STAR_TYPES_AMOUNT: 2
    });

    var features = cleverapps.config.features || [];

    if (features.includes("treasure_search")) {
        Missions[Mission.TYPE_TREASURE_SEARCH] = Object.assign({}, BaseMissionData, {
            available: {
                level: 4.93
            },
            name: "TreasureSearch",
            view: TreasureSearchWindow,
            minigame: {
                price: 1
            },
            prize: RewardsConfig.TreasureSearch,
            startWindow: TreasureSearchWindow,
            nudgeWindow: TreasureSearchWindow,
            duration: "3 days",
            semaphore: Missions.SEMAPHORE_PRIMARY,
            bundle: "treasuresearch",
            sideBarJson: bundles.sidebar.jsons.treasure_search_icon_json,
            logic: TreasureSearchMissionLogic
        });
    }

    if (features.includes("stickers_collection")) {
        Missions[Mission.TYPE_STICKERS_COLLECTION] = Object.assign({}, BaseMissionData, {
            available: {
                level: 4.93
            },
            name: "StickersCollection",
            view: StickersCollectionWindow,
            minigame: {
                price: 1
            },
            prize: RewardsConfig.StickersCollection,
            startWindow: StickersCollectionWindow,
            nudgeWindow: StickersCollectionWindow,
            duration: "3 days",
            semaphore: Missions.SEMAPHORE_PRIMARY,
            bundle: "stickers_collection",
            sideBarJson: bundles.sidebar.jsons.stickers_collection_icon_json,
            logic: StickersCollectionLogic,
            startCurrency: 0,
            tournament: true
        });
    }

    if (typeof LanternWindow !== "undefined") {
        Missions[Mission.TYPE_LANTERN] = Object.assign({}, BaseMissionData, {
            available: {
                level: 8.26
            },
            name: "Lantern",
            view: LanternWindow,
            duration: "2 day",
            semaphore: Missions.SEMAPHORE_CUSTOM_LANTERN,
            startWindow: LanternWindow,
            sideBarJson: bundles.sidebar.jsons.lantern_icon_json,
            iconForce: Forces.LANTERN,
            logic: LanternMissionLogic,
            prize: undefined
        });
    }

    if (features.includes("bonus_world")) {
        Missions[Mission.TYPE_BONUS_WORLD] = Object.assign({}, BaseMissionData, {
            name: "BonusWorld",
            startWindow: BonusWorldWindow,
            view: BonusWorldScene,
            semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT1,
            available: {
                level: 3.85
            },
            logic: BonusWorldMissionLogic,
            sideBarJson: BonusWorldConfig.xmas.sideBarJson,
            feature: "bonusworld",
            oncePerEvent: !cleverapps.config.debugMode,
            iconForce: Forces.BONUS_WORLD
        });
    }

    Missions[Mission.TYPE_PERIODIC_SALE] = {
        available: {
            level: 5
        },
        name: "PeriodicSale",
        feature: "periodic_sale",
        semaphore: Missions.SEMAPHORE_PERIODIC_SALE,
        oncePerEvent: true,
        logic: PeriodicSaleLogic,
        bundle: "periodic_sale",
        sideBarJson: bundles.sidebar.jsons.periodic_sale_json,
        view: PeriodicSaleWindow,
        iconForce: Forces.PERIODIC_SALE
    };

    Missions[Mission.TYPE_CHAIN_SALE] = {
        available: {
            level: 5
        },
        name: "ChainSale",
        feature: "chain_sale",
        semaphore: Missions.SEMAPHORE_PERIODIC_SALE,
        oncePerEvent: true,
        logic: ChainSaleLogic,
        bundle: "chain_sale",
        sideBarJson: bundles.sidebar.jsons.chain_sale_json,
        view: ChainSaleWindow,
        iconForce: Forces.CHAIN_SALE
    };

    if (cleverapps.config.type === "merge") {
        Missions[Mission.TYPE_LIVESFEAST] = Object.assign({}, BaseMissionData, {
            available: {
                level: 5
            },
            name: "LivesFeast",
            duration: "3 day",
            semaphore: Missions.SEMAPHORE_PRIMARY,
            competition: {
                step: [3, 3, 3, 5, 5, 5, 10, 10, 15, 20, 25],
                forceCoef: 0.45,
                amount: [20, 30],
                noPlayerEpisodeCoef: true,
                botAheadPlayerCoef: 0.5,
                botAheadPlayerBigDifferenceCoef: 0.2,
                bigDistanceLength: 100
            },
            logic: LivesFeast,
            prize: RewardsConfig.LivesFeast.places,
            bundle: "lives_feast",
            collectIcon: bundles.reward_icons.frames.reward_energy_png,
            sideBarJson: bundles.sidebar.jsons.lives_feast_icon_json,
            view: LivesFeastMissionWindow,
            startWindow: LivesFeastMissionWindow,
            finishWindow: LivesFeastMissionWindow
        });

        Missions[Mission.TYPE_BUILDPASS] = Object.assign({}, BaseMissionData, {
            name: "BuildPass",
            view: BuildPassWindow,
            semaphore: Missions.SEMAPHORE_PRIMARY,
            startWindow: BuildPassWindow,
            finishWindow: BuildPassWindow,
            rulesOptions: PassRulesOptions,
            logic: PassMissionLogic,
            sideBarJson: bundles.sidebar.jsons.buildpass_icon_json,
            lastChanceView: PassLastChanceWindow,
            collectItemName: "star",
            duration: "3 days",
            cooldown: "28 days",
            available: {
                level: 5
            }
        });

        Missions[Mission.TYPE_SALEPASS] = Object.assign({}, BaseMissionData, {
            name: "SalePass",
            view: SalePassWindow,
            semaphore: Missions.SEMAPHORE_PRIMARY,
            startWindow: SalePassWindow,
            finishWindow: SalePassWindow,
            rulesOptions: SalePassRulesOptions,
            logic: PassMissionLogic,
            sideBarJson: bundles.sidebar.jsons.salepass_icon_json,
            lastChanceView: PassLastChanceWindow,
            collectItemName: "crystal",
            duration: "3 days",
            cooldown: "28 days",
            tutorial: MergeTutorials.salepass,
            available: {
                level: 5
            }
        });

        Missions[Mission.TYPE_CHESTTIME] = Object.assign({}, BaseMissionData, {
            available: {
                level: 9.5
            },
            logic: ChestTime,
            name: "ChestTime",
            duration: "1 day",
            semaphore: Missions.SEMAPHORE_SECONDARY,
            bundle: "chesttime",
            sideBarJson: bundles.sidebar.jsons.chesttime_icon_json,
            view: ChestTimeMissionWindow,
            startWindow: ChestTimeMissionWindow,
            finishWindow: ChestTimeMissionWindow
        });

        Missions[Mission.TYPE_SOFTFEAST] = Object.assign({}, BaseMissionData, {
            available: {
                level: 5
            },
            name: "SoftFeast",
            duration: "3 day",
            semaphore: Missions.SEMAPHORE_PRIMARY,
            competition: {
                step: [5, 50],
                forceCoef: 0.1,
                amount: [20, 30],
                noPlayerEpisodeCoef: true,
                botAheadPlayerCoef: 0.5,
                botAheadPlayerBigDifferenceCoef: 0.2,
                bigDistanceLength: 500
            },
            logic: SoftFeast,
            prize: RewardsConfig.SoftFeast.places,
            bundle: "lives_feast",
            collectIcon: bundles.reward_icons.frames.reward_coin_png,
            sideBarJson: bundles.sidebar.jsons.soft_feast_icon_json,
            view: SoftFeastMissionWindow,
            startWindow: SoftFeastMissionWindow,
            finishWindow: SoftFeastMissionWindow
        });

        Missions[Mission.TYPE_KRAKENFEAST] = Object.assign({}, BaseMissionData, {
            available: {
                level: 5
            },
            name: "KrakenFeast",
            duration: "3 day",
            semaphore: Missions.SEMAPHORE_PRIMARY,
            competition: {
                step: [5, 5, 5, 5, 5, 10, 10, 10, 10, 15, 15, 20, 20, 25, 30],
                forceCoef: 0.2,
                amount: [20, 30],
                noPlayerEpisodeCoef: true,
                botAheadPlayerCoef: 0.5,
                botAheadPlayerBigDifferenceCoef: 0.2,
                bigDistanceLength: 90
            },
            logic: KrakenFeast,
            prize: RewardsConfig.KrakenFeast.places,
            bundle: "lives_feast",
            collectIcon: bundles.reward_icons.frames.tentacle_png,
            sideBarJson: bundles.sidebar.jsons.kraken_feast_icon_json,
            view: KrakenFeastMissionWindow,
            startWindow: KrakenFeastMissionWindow,
            finishWindow: KrakenFeastMissionWindow
        });

        Missions[Mission.TYPE_BOOSTTIME] = Object.assign({}, BaseMissionData, {
            available: {
                level: 9.5
            },
            name: "BoostTime",
            duration: "1 day",
            semaphore: Missions.SEMAPHORE_SECONDARY,
            bundle: "boosttime",
            sideBarJson: bundles.sidebar.jsons.boosttime_icon_json,
            view: BoostTimeMissionWindow,
            startWindow: BoostTimeMissionWindow,
            finishWindow: BoostTimeMissionWindow
        });

        Missions[Mission.TYPE_CARAVAN] = Object.assign({}, BaseMissionData, {
            available: {
                level: 8
            },
            logic: Caravan,
            name: "Caravan",
            ship: "caravanship",
            duration: "3 day",
            semaphore: Missions.SEMAPHORE_SECONDARY,
            bundle: "unitssale",
            startWindow: CaravanMissionWindow,
            view: CaravanMissionWindow,
            finishWindow: CaravanMissionWindow,
            sideBarJson: bundles.sidebar.jsons.caravan_icon_json
        });

        Missions[Mission.TYPE_EXPEDITION_PASS] = {
            name: "ExpeditionPass",
            view: ExpeditionPassWindow,
            startWindow: ExpeditionPassWindow,
            finishWindow: ExpeditionPassWindow,
            rulesOptions: ExpeditionPassRulesOptions,
            sideBarJson: bundles.sidebar.jsons.expedition_buildpass_icon_json,
            logic: PassMissionLogic,
            sideBarSlotName: "expeditionBuildPassSideBarIcon",
            lastChanceView: PassLastChanceWindow,
            collectItemName: "star",
            manualStart: ManualStarters.MissionTreeStarter,
            manualFinish: true,
            mainWorldReward: true
        };

        Missions[Mission.TYPE_EXPEDITION_FEAST] = {
            name: "ExpeditionFeast",
            view: ExpeditionFeastWindow,
            startWindow: ExpeditionFeastWindow,
            finishWindow: ExpeditionFeastWindow,
            manualStart: ManualStarters.ExpeditionFeastStarter,
            logic: FeastExpeditionLogic,
            duration: "1 hour",
            bundle: "lives_feast",
            prize: RewardsConfig.ExpeditionFeast.places,
            mainWorldReward: true,
            sideBarJson: bundles.sidebar.jsons.expedition_feast_icon_json,
            collectIcon: bundles.reward_icons.frames.expedition_feast_icon,
            sideBarSlotName: "expeditionFeastSideBarIcon",
            competition: {
                step: [2, 2, 2, 3, 3, 3, 5, 5, 5, 10, 10, 12, 12, 15],
                forceCoef: 2,
                amount: [20, 30],
                noPlayerEpisodeCoef: true,
                botAheadPlayerCoef: 0.5,
                offlineCoef: 0.8,
                botAheadPlayerBigDifferenceCoef: 0.3,
                bigDistanceLength: 50
            }
        };

        Missions[Mission.TYPE_SNAIL_FEAST] = {
            name: "SnailFeast",
            view: SnailFeastWindow,
            startWindow: SnailFeastWindow,
            finishWindow: SnailFeastWindow,
            manualStart: ManualStarters.SnailFeastStarter,
            logic: FeastExpeditionLogic,
            duration: "6 hour",
            bundle: "snail_feast",
            prize: RewardsConfig.SnailFeast.places,
            mainWorldReward: true,
            sideBarJson: bundles.sidebar.jsons.snail_feast_icon_json,
            collectIcon: bundles.reward_icons.frames.snail_feast_icon,
            sideBarSlotName: "expeditionFeastSideBarIcon",
            competition: {
                step: [3, 3, 3, 3, 10, 10, 10, 65, 65],
                forceCoef: 0.45,
                amount: 5,
                noPlayerEpisodeCoef: true,
                botAheadPlayerCoef: 0.3,
                offlineCoef: 0.8,
                botAheadPlayerBigDifferenceCoef: 0.1,
                bigDistanceLength: 50
            }
        };

        Missions[Mission.TYPE_PERIODIC_PACK] = {
            available: {
                level: 5
            },
            name: "PeriodicPack",
            feature: "periodic_pack",
            semaphore: Missions.SEMAPHORE_PERIODIC_SALE,
            oncePerEvent: true,
            sideBarJson: false,
            logic: PeriodicPackLogic
        };

        TravelBook.INIT_EXPEDITIONS();
    }

    if (typeof SlotMachineScene !== "undefined") {
        Missions[Mission.TYPE_SLOT_MACHINE] = Object.assign({}, BaseMissionData, {
            name: "SlotMachine",
            startWindow: undefined,
            view: SlotMachineScene,
            semaphore: Missions.SEMAPHORE_PRIMARY,
            available: {
                level: 3.85
            },
            logic: SlotMachineMissionLogic,
            sideBarJson: bundles.sidebar.jsons.slot_machine_json,
            duration: "3 days",
            iconForce: Forces.SLOT_MACHINE_ICON
        });
    }

    if (cleverapps.config.type === "match3") {
        Missions[Mission.TYPE_LEVELPASS] = Object.assign({}, BaseMissionData, {
            priority: 4,
            name: "LevelPass",
            view: LevelPassWindow,
            semaphore: Missions.SEMAPHORE_PRIMARY,
            iconForce: Forces.LEVELPASS,
            startWindow: LevelPassWindow,
            finishWindow: LevelPassWindow,
            rulesOptions: {
                name: "PassRulesWindow"
            },
            logic: PassMissionLogic,
            sideBarJson: bundles.sidebar.jsons.levelpass_icon_json,
            sideBarProgressIconJson: bundles.sidebar.jsons.levelpass_star_json,
            lastChanceView: PassLastChanceWindow,
            collectItemName: "star",
            duration: "7 days",
            available: {
                level: 14
            }
        });

        if (Missions[Mission.TYPE_BONUS_WORLD]) {
            Missions[Mission.TYPE_BONUS_WORLD].available = {
                level: 4.13
            };
        }
    }

    if (cleverapps.config.name === "hustlemerge") {
        StopHustlemergeMissions();
    }

    Missions.afterInitialize();
};

Missions.checkIllegal = function (type) {
    return type === undefined || (type.includes && type.includes("undefined"));
};

Missions.afterInitialize = function () {
    Object.keys(Missions).forEach(function (parentType) {
        parentType = cleverapps.castType(parentType);

        var parentMission = Missions[parentType];
        parentMission.type = parentType;
        var childMissions = parentMission.childMissions || [];

        childMissions.forEach(function (type) {
            var compoundType = Mission.CompoundType(type, parentType);

            Missions[compoundType] = Object.assign({}, Missions[type], {
                type: compoundType,
                parentType: parentType,
                implementations: undefined
            });

            if (!Missions[type].implementations) {
                Missions[type].implementations = [];
            }
            Missions[type].implementations.push(compoundType);
        });
    });

    [Mission.TYPE_RAPUNZEL_EXPEDITION, Mission.TYPE_RAPUNZEL2_EXPEDITION, Mission.TYPE_EASTER_EXPEDITION, Mission.TYPE_CHINA_EXPEDITION].forEach(function (type) {
        if (Missions[type]) {
            var pass = Mission.CompoundType(Mission.TYPE_EXPEDITION_PASS, type);
            Missions[pass] = Object.assign(Missions[pass], {
                manualStart: undefined,
                semaphore: Missions.SEMAPHORE_ALWAYS,
                available: {
                    fogId: "fog1"
                }
            });
        }
    });

    Object.keys(Missions).forEach(function (type, ind) {
        if (Missions.checkIllegal(type)) {
            cleverapps.throwAsync("Undefined mission type " + type + " ind: " + ind);
        }
    });
    Object.keys(PassLevelsConfig).forEach(function (type, ind) {
        if (Missions.checkIllegal(type)) {
            cleverapps.throwAsync("Undefined pass config type " + type + " ind: " + ind);
        }
    });
};

if (typeof cc === "undefined") {
    module.exports = {
        Missions: Missions,
        Mission: Mission
    };
}
