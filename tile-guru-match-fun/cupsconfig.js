/**
 * Created by r4zi4l on 22.08.2022
 */

if (typeof cc === "undefined") {
    var cleverapps = require("../utils");

    cleverapps.Environment = {};

    cleverapps.Availables = {
        CLANS: {}
    };

    var RewardsConfig = {};
    var Forces = {};
}

var CupsConfig = {};

CupsConfig.TYPE_DAILY = "daily";
CupsConfig.TYPE_WEEKLY = "weekly";
CupsConfig.TYPE_CLAN = "clan";
CupsConfig.TYPE_CLAN_INNER = "claninner";

CupsConfig.TYPES = {};

CupsConfig.TYPES[CupsConfig.TYPE_DAILY] = {
    available: {
        level: 10,
        registered: "7 days",
        projectName: ["riddles", "heroes", "adventure", "runes", "wordsoup", "crocword", "magicwords", "olympics", "scramble", "tripeaks", "spades"]
    },
    scenes: [cleverapps.Environment.SCENE_MAIN, cleverapps.Environment.SCENE_DAILY_CUP],
    rewards: RewardsConfig.DailyCup,
    force: Forces.DAILY_CUP,
    duration: cleverapps.parseInterval("1 hour"),
    cooldown: 0,
    topLimit: 25,
    statsLimit: 25
};

if (["wordsoup", "scramble", "magicwords", "crocword"].indexOf(cleverapps.config.name) !== -1) {
    CupsConfig.TYPES[CupsConfig.TYPE_DAILY].duration = cleverapps.parseInterval("3 hours");
}

if (cleverapps.config.debugMode) {
    CupsConfig.TYPES[CupsConfig.TYPE_DAILY].duration = cleverapps.parseInterval("3 minutes");
}

CupsConfig.TYPES[CupsConfig.TYPE_WEEKLY] = {
    available: {
        level: 0,
        projectName: ["olympics"]
    },
    scenes: [cleverapps.Environment.SCENE_LOADER, cleverapps.Environment.SCENE_MAIN],
    rewards: RewardsConfig.WeeklyCup,
    duration: cleverapps.parseInterval("1 week"),
    cooldown: 0,
    restartAfter: cleverapps.parseInterval("1 minute"),
    topLimit: 25
};

if (cleverapps.config.debugMode) {
    CupsConfig.TYPES[CupsConfig.TYPE_WEEKLY].duration = cleverapps.parseInterval("3 minutes");
}

CupsConfig.TYPES[CupsConfig.TYPE_CLAN] = {
    available: Object.assign({}, cleverapps.Availables.CLANS, {
        projectName: [],
        disabled: true
    }),
    scenes: [cleverapps.Environment.SCENE_MAIN],
    rewards: RewardsConfig.ClanCup,
    origin: new Date("2022-10-06T00:00:00+00:00").getTime(),
    duration: cleverapps.parseInterval("4 days"),
    cooldown: cleverapps.parseInterval("10 days"),
    restartAfter: cleverapps.parseInterval("1 day"),
    participateAsClan: true,
    topLimit: 50
};

if (cleverapps.config.debugMode) {
    CupsConfig.TYPES[CupsConfig.TYPE_CLAN].duration = cleverapps.parseInterval("4 minutes");
    CupsConfig.TYPES[CupsConfig.TYPE_CLAN].cooldown = cleverapps.parseInterval("1 minute");
    CupsConfig.TYPES[CupsConfig.TYPE_CLAN].restartAfter = cleverapps.parseInterval("30 seconds");
}

CupsConfig.TYPES[CupsConfig.TYPE_CLAN_INNER] = Object.assign({}, CupsConfig.TYPES[CupsConfig.TYPE_CLAN], {
    master: CupsConfig.TYPE_CLAN,
    rewards: [],
    participateAsClan: false,
    topLimit: 50
});

CupsConfig.IsEnabled = function (type) {
    var config = CupsConfig.TYPES[type];
    return config && config.available && config.available.projectName && config.available.projectName.indexOf(cleverapps.config.name) !== -1;
};

if (typeof cc === "undefined") {
    module.exports = CupsConfig;
}
