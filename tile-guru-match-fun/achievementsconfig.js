/**
 * Created by spepa on 10.04.2023
 */

var AchievementsConfig = [];

if (cleverapps.config.type === "merge") {
    AchievementsConfig = AchievementsConfig.concat(AchievementsConfig, [
        {
            type: Merge.MERGE,
            title: "combomaster",
            amount: 17,
            kongId: "Combo Master",
            vkId: 4
        },
        {
            type: DailyTasks.LEVEL_UP,
            title: "apprentice",
            level: 7,
            kongId: "Apprentice",
            vkId: 3
        },
        {
            type: DailyTasks.LEVEL_UP,
            title: "apprenticenomore",
            level: 11,
            kongId: "Apprentice No More",
            vkId: 5
        },
        {
            type: Merge.OPEN_UNIT,
            title: "charactercollector",
            unit: { code: "king", stage: 3 },
            kongId: "Character Collector",
            vkId: 6
        },
        {
            type: DailyTasks.FINISH_EXPEDITION,
            title: "greatexplorer",
            kongId: "Great Explorer",
            vkId: 7
        },
        {
            type: Merge.BUILD,
            title: "grandarchitect",
            castle: true,
            kongId: "Grand Architect",
            vkId: 8
        },
        {
            type: DailyTasks.LEVEL_UP,
            title: "mergechampion",
            level: 34,
            kongId: "Merge Champion",
            vkId: 9
        }
    ]);
}

if (cleverapps.config.type === "match3") {
    AchievementsConfig = AchievementsConfig.concat(AchievementsConfig, [
        {
            type: DailyTasks.PASS_LEVEL,
            title: "thirtyleveltriumph",
            level: 29,
            vkId: 21
        },
        {
            type: DailyTasks.USE_MULTI_COLOR_CELL,
            title: "rainbowrush",
            vkId: 22
        },
        {
            type: DailyTasks.OPEN_STAR_CHEST,
            title: "starchestsurprise",
            vkId: 23
        },
        {
            type: DailyTasks.UPGRADE_HERO,
            title: "redherounleashed",
            hero: { color: "d", level: 1 },
            vkId: 24
        },
        {
            type: DailyTasks.PASS_LEVEL,
            title: "level200achiever",
            level: 199,
            vkId: 25
        },
        {
            type: DailyTasks.UPGRADE_HERO,
            title: "herocollector",
            allOpen: true,
            vkId: 26
        },
        {
            type: DailyTasks.PASS_LEVEL,
            title: "level1000legend",
            level: 999,
            vkId: 27
        }
    ]);
}