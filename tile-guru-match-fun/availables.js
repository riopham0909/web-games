/**
 * Created by andrey on 27.04.18.
 */

cleverapps.Availables = {
    LEADER_BOARD: { level: 1.2 },
    BONUS_ROUND: { level: 0.67 },
    DAILY_TASKS: { level: 2.87 },
    INVITE_FRIENDS_ICON: { level: 0.93 },
    CREATE_SHORTCUT: { level: 0.33 },
    JOIN_GROUP: {
        level: 6
    },
    CLANS: {
        level: 8.5,
        source: ["facebook", "instant", "android", "amazon", "microsoft"],
        projectName: ["mergecraft", "wondermerge", "fairy"],
        cleverapps: {
            debugMode: true,
            level: 8.5,
            projectName: ["mergecraft", "wondermerge", "fairy"]
        }
    },
    EXPEDITIONS: {
        level: 7
    }
};

if (cleverapps.config.type === "merge") {
    cleverapps.Availables.DAILY_TASKS = { level: 6 };
    cleverapps.Availables.INVITE_FRIENDS_ICON = { level: 6.8 };
    cleverapps.Availables.CREATE_SHORTCUT = { level: 3 };
    cleverapps.Availables.PIXELS = { level: 4.5 };
}
