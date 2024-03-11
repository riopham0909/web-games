/**
 * Created by r4zi4l on 04.05.2022
 */

var Offers = {
    TYPES: {}
};

Offers.TYPES.LIVESFEAST = 1;
Offers.TYPES.SOFTFEAST = 2;
Offers.TYPES.KRAKENFEAST = 3;
Offers.TYPES.BUILDPASS = 4;
Offers.TYPES.SALEPASS = 5;
Offers.TYPES.DRAGONIA = 6;
Offers.TYPES.UNDERSEA = 7;
Offers.TYPES.UNDERSEA2 = 8;
Offers.TYPES.SNAILFEAST = 9;
Offers.TYPES.HALLOWEEN = 10;
Offers.TYPES.SNAILFEAST_DRAGONIA2 = 11;
Offers.TYPES.RAPUNZEL = 12;
Offers.TYPES.XMAS = 13;
Offers.TYPES.RAPUNZEL2 = 14;
Offers.TYPES.PERIODIC_PACK = 15;
Offers.TYPES.EASTER = 16;
Offers.TYPES.DRAGONIA2 = 17;
Offers.TYPES.DRAGONIA3 = 18;
Offers.TYPES.SNAILFEAST_DRAGONIA3 = 19;
Offers.TYPES.CHINA = 20;

Offers.initialize = function () {
    if (cleverapps.config.type === "merge") {
        Offers[Offers.TYPES.LIVESFEAST] = {
            mission: Mission.TYPE_LIVESFEAST,
            price: 250,
            reward: RewardsConfig.LivesFeast.offer,
            sideBarJson: bundles.sidebar.jsons.lives_feast_offer,
            name: "LivesFeastOffer",
            bundle: "lives_offer"
        };

        Offers[Offers.TYPES.BUILDPASS] = {
            mission: Mission.TYPE_BUILDPASS,
            price: 299,
            reward: RewardsConfig.BuildPass.offer,
            sideBarJson: bundles.sidebar.jsons.buildpass_offer,
            name: "BuildPassOffer",
            bundle: "buildpass_offer"
        };

        Offers[Offers.TYPES.SALEPASS] = {
            mission: Mission.TYPE_SALEPASS,
            price: 299,
            reward: RewardsConfig.SalePass.offer,
            sideBarJson: bundles.sidebar.jsons.salepass_offer,
            name: "SalePassOffer",
            bundle: "salepass_offer"
        };

        if (["mbga", "sp_mbga"].indexOf(cleverapps.config.source) === -1) {
            Offers[Offers.TYPES.SOFTFEAST] = {
                mission: Mission.TYPE_SOFTFEAST,
                price: 250,
                reward: RewardsConfig.SoftFeast.offer,
                sideBarJson: bundles.sidebar.jsons.soft_feast_offer,
                name: "SoftFeastOffer",
                bundle: "soft_offer"
            };
        }

        Offers[Offers.TYPES.KRAKENFEAST] = {
            mission: Mission.TYPE_KRAKENFEAST,
            reward: RewardsConfig.KrakenFeast.offer,
            price: 299,
            sideBarJson: bundles.sidebar.jsons.kraken_offer,
            name: "KrakenFeastOffer",
            bundle: "kraken_offer"
        };

        Offers[Offers.TYPES.DRAGONIA] = {
            mission: Mission.TYPE_DRAGONIA_EXPEDITION,
            hero: { code: "dragonpack", stage: 0 },
            product: "expeditionPack",
            force: Forces.OFFER_ICON_SLOT2,
            fog: "fog4",
            reward: RewardsConfig.DragoniaPack,
            sideBarJson: bundles.sidebar.jsons.dragonia_offer,
            name: "DragoniaPack",
            bundle: "dragonia_offer"
        };

        Offers[Offers.TYPES.UNDERSEA] = {
            mission: Mission.TYPE_UNDERSEA_EXPEDITION,
            hero: { code: "underseapack", stage: 0 },
            product: "expeditionPack",
            force: Forces.OFFER_ICON_SLOT2,
            fog: "fog4",
            reward: RewardsConfig.UnderseaPack,
            sideBarJson: bundles.sidebar.jsons.undersea_offer,
            name: "UnderseaPack",
            bundle: "undersea_offer"
        };

        Offers[Offers.TYPES.UNDERSEA2] = {
            mission: Mission.TYPE_UNDERSEA2_EXPEDITION,
            hero: { code: "sea2pack", stage: 0 },
            product: "expeditionPack",
            force: Forces.OFFER_ICON_SLOT2,
            fog: "fog4",
            reward: RewardsConfig.Undersea2Pack,
            sideBarJson: bundles.sidebar.jsons.undersea_offer,
            name: "Undersea2Pack",
            bundle: "undersea_offer"
        };

        Offers[Offers.TYPES.SNAILFEAST] = {
            mission: Mission.CompoundType(Mission.TYPE_SNAIL_FEAST, Mission.TYPE_UNDERSEA2_EXPEDITION),
            price: 49,
            force: Forces.OFFER_ICON_SLOT2,
            sideBarJson: bundles.sidebar.jsons.snailhouse_offer_json,
            reward: RewardsConfig.SnailPack,
            name: "SnailPack",
            bundle: "snailhouse_offer"
        };

        Offers[Offers.TYPES.SNAILFEAST_DRAGONIA2] = {
            mission: Mission.CompoundType(Mission.TYPE_SNAIL_FEAST, Mission.TYPE_DRAGONIA2_EXPEDITION),
            price: 49,
            force: Forces.OFFER_ICON_SLOT2,
            sideBarJson: bundles.sidebar.jsons.snailhouse_offer_json,
            reward: RewardsConfig.SnailHouseDragoniaPack,
            name: "SnailPack",
            bundle: "snailhouse_offer"
        };

        Offers[Offers.TYPES.SNAILFEAST_DRAGONIA3] = {
            mission: Mission.CompoundType(Mission.TYPE_SNAIL_FEAST, Mission.TYPE_DRAGONIA3_EXPEDITION),
            price: 49,
            force: Forces.OFFER_ICON_SLOT2,
            sideBarJson: bundles.sidebar.jsons.snailhouse_offer_json,
            reward: RewardsConfig.SnailHouseDragoniaPack,
            name: "SnailPack",
            bundle: "snailhouse_offer"
        };

        Offers[Offers.TYPES.HALLOWEEN] = {
            mission: Mission.TYPE_HALLOWEEN_2023_EXPEDITION,
            hero: { code: "hlpack", stage: 0 },
            product: "expeditionPack",
            force: Forces.OFFER_ICON_SLOT1,
            fog: "fog4",
            reward: RewardsConfig.HalloweenPack,
            sideBarJson: bundles.sidebar.jsons.halloween_offer,
            name: "HalloweenPack",
            bundle: "halloween_offer"
        };

        Offers[Offers.TYPES.RAPUNZEL] = {
            mission: Mission.TYPE_RAPUNZEL_EXPEDITION,
            product: "expeditionPack",
            force: Forces.OFFER_ICON_SLOT2,
            fog: "fog2",
            cooldown: cleverapps.config.debugMode ? "2 minutes" : "24 hours",
            reward: RewardsConfig.RapunzelPack,
            sideBarJson: bundles.sidebar.jsons.rapunzel_offer,
            name: "RapunzelPack",
            bundle: "rapunzel_offer"
        };

        Offers[Offers.TYPES.RAPUNZEL2] = {
            mission: Mission.TYPE_RAPUNZEL2_EXPEDITION,
            product: "expeditionPack",
            force: Forces.OFFER_ICON_SLOT2,
            fog: "fog2",
            cooldown: cleverapps.config.debugMode ? "2 minutes" : "24 hours",
            reward: RewardsConfig.RapunzelPack,
            sideBarJson: bundles.sidebar.jsons.rapunzel_offer,
            name: "Rapunzel2Pack",
            bundle: "rapunzel_offer"
        };

        Offers[Offers.TYPES.XMAS] = {
            mission: Mission.TYPE_XMAS_EXPEDITION,
            hero: { code: "xmpack", stage: 0 },
            product: "expeditionPack",
            force: Forces.OFFER_ICON_SLOT1,
            fog: "fog4",
            reward: RewardsConfig.XmasPack,
            sideBarJson: bundles.sidebar.jsons.xmas_offer,
            name: "XmasPack",
            bundle: "xmas_offer"
        };

        Offers[Offers.TYPES.PERIODIC_PACK] = {
            mission: Mission.TYPE_PERIODIC_PACK,
            product: "expeditionPack",
            reward: RewardsConfig.PeriodicPack,
            sideBarJson: bundles.sidebar.jsons.periodic_pack_json,
            name: "periodicOffer",
            bundle: "periodic_pack",
            force: Forces.PERIODIC_PACK
        };

        Offers[Offers.TYPES.EASTER] = {
            mission: Mission.TYPE_EASTER_EXPEDITION,
            product: "expeditionPack",
            force: Forces.OFFER_ICON_SLOT1,
            fog: "fog2",
            cooldown: cleverapps.config.debugMode ? "2 minutes" : "24 hours",
            reward: RewardsConfig.EasterPack,
            sideBarJson: bundles.sidebar.jsons.easter_offer,
            name: "EasterPack",
            bundle: "easter_offer"
        };

        Offers[Offers.TYPES.DRAGONIA2] = {
            mission: Mission.TYPE_DRAGONIA2_EXPEDITION,
            hero: { code: "dr2dragonpack", stage: 0 },
            product: "expeditionPack",
            force: Forces.OFFER_ICON_SLOT2,
            fog: "fog4",
            reward: RewardsConfig.Dragonia2Pack,
            sideBarJson: bundles.sidebar.jsons.dragonia_offer,
            name: "Dragonia2Pack",
            bundle: "dragonia_offer"
        };

        Offers[Offers.TYPES.DRAGONIA3] = {
            mission: Mission.TYPE_DRAGONIA3_EXPEDITION,
            hero: { code: "dr2dragonpack", stage: 0 },
            product: "expeditionPack",
            force: Forces.OFFER_ICON_SLOT2,
            fog: "fog10",
            reward: RewardsConfig.Dragonia2Pack,
            sideBarJson: bundles.sidebar.jsons.dragonia_offer,
            name: "Dragonia2Pack",
            bundle: "dragonia_offer"
        };

        Offers[Offers.TYPES.CHINA] = {
            mission: Mission.TYPE_CHINA_EXPEDITION,
            product: "expeditionPack",
            force: Forces.OFFER_ICON_SLOT1,
            fog: "fog2",
            cooldown: cleverapps.config.debugMode ? "2 minutes" : "24 hours",
            reward: RewardsConfig.ChinaPack,
            sideBarJson: bundles.sidebar.jsons.china_offer,
            name: "ChinaPack",
            bundle: "china_offer"
        };
    }

    Offers.offerByMission = {};
    Offers.offerByHero = {};
    Offers.offersByFog = {};

    for (var name in Offers.TYPES) {
        var type = Offers.TYPES[name];
        var offer = Offers[type];

        if (offer) {
            if (Missions.checkIllegal(offer.mission)) {
                cleverapps.throwAsync("Undefined offer mission " + offer.mission + " offer: " + name);
            }

            offer.type = type;

            Offers.offerByMission[offer.mission] = offer;

            if (offer.hero) {
                Offers.offerByHero[Unit.GetKey(offer.hero)] = offer;
            }

            if (offer.fog) {
                if (Offers.offersByFog[offer.fog]) {
                    Offers.offersByFog[offer.fog].push(offer);
                } else {
                    Offers.offersByFog[offer.fog] = [offer];
                }
            }
        }
    }
};
