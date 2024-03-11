/**
 * Created by razial on 27.03.2023
 */

if (typeof cc === "undefined") {
    var TravelBook = function () {};

    var Missions = require("../missions/missions");
    var Mission = Missions.Mission;
    Missions = Missions.Missions;

    var cleverapps = require("../utils");

    var CustomSyncers = {};
}

TravelBook.PAGES = [
    {
        id: "main",
        prefix: "main",
        slot: CustomSyncers.SLOT_MAIN,
        episode: "0"
    },
    {
        id: "collections",
        prefix: "cl",
        name: "CollectionsExpedition",
        episode: "collections",
        slot: CustomSyncers.EXPEDITION_SLOT3,
        permanent: true,
        gameLevel: true,
        available: {
            level: 8.1,
            projectName: ["mergecraft", "fairy"]
        }
    },
    {
        id: "dragonia",
        prefix: "dr",
        missionType: Mission.TYPE_DRAGONIA_EXPEDITION,
        name: "DragoniaExpedition",
        episode: "dragonia",
        slot: CustomSyncers.EXPEDITION_SLOT2,
        semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT2,
        duration: "20 days",
        oneShot: true,
        childMissions: [Mission.TYPE_EXPEDITION_PASS, Mission.TYPE_EXPEDITION_FEAST]
    },
    {
        id: "rapunzel",
        prefix: "rp",
        missionType: Mission.TYPE_RAPUNZEL_EXPEDITION,
        name: "RapunzelExpedition",
        episode: "rapunzel",
        slot: CustomSyncers.EXPEDITION_SLOT2,
        semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT2,
        duration: "6 days",
        energy: true,
        oneShot: true,
        childMissions: [Mission.TYPE_EXPEDITION_PASS]
    },
    {
        id: "undersea",
        prefix: "sea",
        missionType: Mission.TYPE_UNDERSEA_EXPEDITION,
        name: "UnderseaExpedition",
        episode: "undersea",
        slot: CustomSyncers.EXPEDITION_SLOT2,
        semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT2,
        duration: "20 days",
        oneShot: true,
        childMissions: [Mission.TYPE_EXPEDITION_PASS, Mission.TYPE_EXPEDITION_FEAST]
    },
    {
        id: "dragonia2",
        prefix: "dr2",
        missionType: Mission.TYPE_DRAGONIA2_EXPEDITION,
        name: "Dragonia2Expedition",
        episode: "dragonia",
        level: 1,
        slot: CustomSyncers.EXPEDITION_SLOT2,
        semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT2,
        available: {
            level: 7
        },
        duration: "20 days",
        energy: true,
        oneShot: true,
        childMissions: [Mission.TYPE_EXPEDITION_PASS, Mission.TYPE_SNAIL_FEAST]
    },
    {
        id: "rapunzel2",
        prefix: "rp2",
        missionType: Mission.TYPE_RAPUNZEL2_EXPEDITION,
        name: "Rapunzel2Expedition",
        episode: "rapunzel",
        level: 1,
        slot: CustomSyncers.EXPEDITION_SLOT2,
        semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT2,
        duration: "8 days",
        energy: true,
        oneShot: true,
        childMissions: [Mission.TYPE_EXPEDITION_PASS]
    },
    {
        id: "undersea2",
        prefix: "sea2",
        missionType: Mission.TYPE_UNDERSEA2_EXPEDITION,
        name: "Undersea2Expedition",
        episode: "undersea",
        level: 1,
        slot: CustomSyncers.EXPEDITION_SLOT2,
        semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT2,
        duration: "20 days",
        oneShot: true,
        childMissions: [Mission.TYPE_EXPEDITION_PASS, Mission.TYPE_SNAIL_FEAST]
    },
    {
        id: "xmas",
        prefix: "xm",
        missionType: Mission.TYPE_XMAS_EXPEDITION,
        name: "XmasExpedition",
        episode: "xmas",
        slot: CustomSyncers.EXPEDITION_SLOT1,
        semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT1,
        available: {
            level: 7,
            projectName: ["mergecraft", "wondermerge", "fairy"]
        },
        feature: "xmas_expedition",
        childMissions: [Mission.TYPE_EXPEDITION_PASS, Mission.TYPE_EXPEDITION_FEAST]
    },
    {
        id: "halloween",
        prefix: "hl",
        missionType: Mission.TYPE_HALLOWEEN_2023_EXPEDITION,
        name: "HalloweenExpedition",
        episode: "halloween",
        slot: CustomSyncers.EXPEDITION_SLOT1,
        semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT1,

        feature: "halloween",
        childMissions: [Mission.TYPE_EXPEDITION_PASS, Mission.TYPE_EXPEDITION_FEAST]
    },
    {
        id: "easter",
        prefix: "es",
        missionType: Mission.TYPE_EASTER_EXPEDITION,
        name: "EasterExpedition",
        episode: "easter",
        slot: CustomSyncers.EXPEDITION_SLOT1,
        semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT1,
        feature: "easter_expedition",
        available: {
            level: 6,
            projectName: ["mergecraft", "wondermerge", "fairy"]
        },
        energy: true,
        childMissions: [Mission.TYPE_EXPEDITION_PASS]
    },
    {
        id: "dragonia3",
        prefix: "dr3",
        missionType: Mission.TYPE_DRAGONIA3_EXPEDITION,
        name: "Dragonia3Expedition",
        episode: "dragonia",
        level: 2,
        slot: CustomSyncers.EXPEDITION_SLOT2,
        semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT2,
        available: {
            level: 7,
            projectName: ["mergecraft", "wondermerge"]
        },
        duration: "20 days",
        energy: true,
        oneShot: true,
        childMissions: [Mission.TYPE_EXPEDITION_PASS, Mission.TYPE_SNAIL_FEAST]
    },
    {
        id: "rapunzel3",
        prefix: "rp3",
        missionType: Mission.TYPE_RAPUNZEL3_EXPEDITION,
        name: "Rapunzel3Expedition",
        episode: "rapunzel",
        level: 2,
        slot: CustomSyncers.EXPEDITION_SLOT2,
        semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT2,
        duration: "8 days",
        energy: true,
        oneShot: true,
        available: {
            debugMode: true,
            level: 7,
            projectName: ["mergecraft"]
        },
        childMissions: [Mission.TYPE_EXPEDITION_PASS]
    },
    {
        id: "china",
        prefix: "ch",
        missionType: Mission.TYPE_CHINA_EXPEDITION,
        name: "ChinaExpedition",
        episode: "china",
        level: 0,
        slot: CustomSyncers.EXPEDITION_SLOT1,
        semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT1,
        feature: "china_expedition",
        available: {
            level: 6,
            projectName: ["mergecraft", "wondermerge", "fairy"]
        },
        energy: true,
        childMissions: [Mission.TYPE_EXPEDITION_PASS]
    },
    {
        id: "adventure",
        prefix: "av",
        missionType: Mission.TYPE_ADVENTURE_EXPEDITION,
        name: "AdventureExpedition",
        episode: "adventure",
        slot: CustomSyncers.EXPEDITION_SLOT2,
        semaphore: Missions.SEMAPHORE_CUSTOM_EXPEDITION_SLOT2,
        available: {
            level: 7,
            projectName: ["mergecraft"],
            debugMode: true
        },
        duration: "20 days",
        oneShot: true
    }
];

TravelBook.findPageById = function (expedition) {
    for (var i = 0; i < TravelBook.PAGES.length; ++i) {
        var page = TravelBook.PAGES[i];
        if (page.id === expedition) {
            return page;
        }
    }
};

TravelBook.LIST_IN_ORDER_EXPEDITIONS = function () {
    return TravelBook.PAGES.filter(function (page) {
        return page.id !== "main";
    }).map(function (page) {
        return page.missionType;
    });
};

TravelBook.INIT_EXPEDITIONS = function () {
    var ExpeditionMissionData = Object.assign({}, {
        level: 0,
        duration: "1 day",
        logic: ExpeditionMissionLogic,
        rewardShareId: "bonus_world",
        sideBarJson: false,
        rewardTitle: "ExpeditionRewardWindow.title",
        rewardText: "ExpeditionRewardWindow.description"
    });

    TravelBook.PAGES.filter(function (page) {
        return page.missionType !== undefined;
    }).forEach(function (page) {
        page.available = page.available || cleverapps.Availables.EXPEDITIONS;
        Missions[page.missionType] = Object.assign({}, ExpeditionMissionData, page);
    });
};

if (typeof cc === "undefined") {
    module.exports = TravelBook;
}
