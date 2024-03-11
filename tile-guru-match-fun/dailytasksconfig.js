/**
 * Created by andrey on 26.06.2021.
 */

DailyTasks.PASS_LEVEL = 4;
DailyTasks.WATCH_ADS = 7;
DailyTasks.USE_MULTI_COLOR_CELL = 8;
DailyTasks.USE_BOOSTER = 9;
DailyTasks.COLLECT_COLOR_CELLS = 10;
DailyTasks.SPEND_HARD = 13;

DailyTasks.GUESS_WORDS_WITH_LETTER = 16;
DailyTasks.COLLECT_HERO_CELLS = 24;

DailyTasks.COLLECT_CARDS_BY_VALUE = 25;
DailyTasks.COLLECT_CARDS_BY_SUIT = 26;

DailyTasks.DESTROY_ENT = 28;
DailyTasks.MAKE_ORDER = 29;
DailyTasks.USE_RAINBOW = 30;
DailyTasks.MERGE_SOLDIERS = 31;
DailyTasks.HARVEST_FRUITS = 32;
DailyTasks.USE_WORKER = 33;
DailyTasks.OPEN_CHEST = 34;
DailyTasks.COLLECT_PIXEL = 35;
DailyTasks.MERGE = 36;
DailyTasks.BUY_UNITS_SHOP_ITEMS = 37;
DailyTasks.PLAY_MINESWEEPER = 38;
DailyTasks.SPEND_SOFT = 39;
DailyTasks.CREATE_SOURCE = 40;
DailyTasks.COMPLETE_ALL = 41;
DailyTasks.BUILD = 43;
DailyTasks.GROW_PLANT = 44;

DailyTasks.PASS_DAILY_CUP_LEVEL = 45;
DailyTasks.PASS_LEVEL_HARD = 46;
DailyTasks.GUESS_LONG_WORDS = 47;
DailyTasks.GET_FULL_COMBO = 48;
DailyTasks.USE_BOOSTER_BEFORE = 49;

DailyTasks.PASS_KNOCKOUT = 50;
DailyTasks.PLAY_MINI_GAME = 51;

DailyTasks.ENERGY_LOTTERY = 52;
DailyTasks.OPEN_FOG = 53;
DailyTasks.FINISH_QUEST = 54;
DailyTasks.USE_UP_INSTANT_WORKER = 55;
DailyTasks.LEVEL_UP = 56;
DailyTasks.FINISH_EXPEDITION = 57;

DailyTasks.OPEN_STAR_CHEST = 58;
DailyTasks.UPGRADE_HERO = 59;

DailyTasks.CELL_COLORS = ["a", "b", "d"];
DailyTasks.CARD_VALUES = ["j", "q", "k", "a"];

DailyTasks.CONFIG = {};

DailyTasks.CONFIG[DailyTasks.WATCH_ADS] = {
    generate: function () {
        if (!cleverapps.rewardedAdsManager.isAvailable(RewardedAdsManager.REWARDED) || cleverapps.paymentsHistory.isVIP()) {
            return;
        }

        return {
            goal: cleverapps.Random.random(10, 15),
            difficulty: DailyTask.EASY
        };
    },

    icon: "daily_task_icon_watch_ads_png"
};

DailyTasks.CONFIG[DailyTasks.SPEND_SOFT] = {
    generate: function () {
        if (!cleverapps.config.soft) {
            return;
        }

        return {
            goal: 35,
            customReward: { soft: 40 },
            difficulty: DailyTask.EASY
        };
    },

    icon: "daily_task_icon_spend_coins_png"
};

DailyTasks.CONFIG[DailyTasks.SPEND_HARD] = {
    generate: function () {
        if (cleverapps.config.soft !== false) {
            return {
                customReward: { hard: 18 },
                goal: 15,
                difficulty: DailyTask.EASY
            };
        }
        var randomGoal = Math.floor(cleverapps.Random.random(500, 750) / 50) * 50;
        return [{
            goal: 200,
            customReward: { hard: 150 },
            difficulty: DailyTask.EASY
        }, {
            goal: randomGoal,
            customReward: { hard: Math.floor(randomGoal * 0.75 / 50) * 50 },
            difficulty: DailyTask.HARD
        }];
    },

    icon: "daily_task_icon_spend_gold_png"
};

DailyTasks.CONFIG[DailyTasks.PASS_LEVEL] = {
    generate: function () {
        if (cleverapps.config.type === "merge") {
            return;
        }

        return {
            goal: cleverapps.Random.random(12, 15),
            difficulty: DailyTask.MEDIUM
        };
    },

    icon: "daily_task_icon_pass_level_png"
};

DailyTasks.CONFIG[DailyTasks.PASS_LEVEL_HARD] = {
    generate: function () {
        if (cleverapps.config.type === "merge" || cleverapps.isKnockoutGame()) {
            return;
        }

        return {
            goal: cleverapps.Random.random(3, 4),
            difficulty: DailyTask.MEDIUM
        };
    },

    icon: "daily_task_icon_hard_level_png"
};

DailyTasks.CONFIG[DailyTasks.GUESS_WORDS_WITH_LETTER] = {
    generate: function () {
        var excludedLanguages = ["ko"];
        if (!(cleverapps.config.type === "board" && excludedLanguages.indexOf(cleverapps.settings.language) === -1)) {
            return;
        }

        var easyLetters = ["e", "o", "a"];
        var hardLetters = ["p", "c", "t"];
        if (cleverapps.settings.language === cc.sys.LANGUAGE_RUSSIAN) {
            easyLetters = ["е", "о", "а"];
            hardLetters = ["п", "с", "т"];
        } else if (cleverapps.settings.language === cc.sys.LANGUAGE_JAPANESE) {
            easyLetters = ["あ", "か", "ち"];
            hardLetters = ["は", "ラ", "わ"];
        }

        return [{
            letter: cleverapps.Random.choose(easyLetters),
            goal: Math.floor(cleverapps.Random.random(50, 75) / 5) * 5,
            difficulty: DailyTask.MEDIUM
        }, {
            letter: cleverapps.Random.choose(hardLetters),
            goal: Math.floor(cleverapps.Random.random(125, 150) / 5) * 5,
            difficulty: DailyTask.HARD
        }];
    }
};

DailyTasks.CONFIG[DailyTasks.COLLECT_CARDS_BY_VALUE] = {
    generate: function () {
        if (cleverapps.config.type !== "solitaire") {
            return;
        }

        return {
            goal: Math.floor(cleverapps.Random.random(25, 50) / 5) * 5,
            difficulty: DailyTask.HARD,
            cardValue: cleverapps.Random.choose(DailyTasks.CARD_VALUES)
        };
    },

    icon: {
        j: "daily_task_icon_cards_by_value_j_png",
        q: "daily_task_icon_cards_by_value_q_png",
        k: "daily_task_icon_cards_by_value_k_png",
        a: "daily_task_icon_cards_by_value_a_png"
    }
};

DailyTasks.CONFIG[DailyTasks.COLLECT_CARDS_BY_SUIT] = {
    generate: function () {
        if (cleverapps.config.type !== "solitaire") {
            return;
        }

        return {
            goal: Math.floor(cleverapps.Random.random(50, 75) / 5) * 5,
            difficulty: DailyTask.MEDIUM,
            cardSuit: cleverapps.Random.choose(Card.SUITS)
        };
    },

    icon: {
        c: "daily_task_icon_cards_by_suit_c_png",
        d: "daily_task_icon_cards_by_suit_d_png",
        h: "daily_task_icon_cards_by_suit_h_png",
        s: "daily_task_icon_cards_by_suit_s_png"
    }
};

DailyTasks.CONFIG[DailyTasks.GET_FULL_COMBO] = {
    generate: function () {
        if (cleverapps.config.type !== "solitaire") {
            return;
        }

        return {
            goal: 30,
            difficulty: DailyTask.HARD
        };
    },

    icon: "daily_task_icon_full_combo_png"
};

DailyTasks.CONFIG[DailyTasks.USE_MULTI_COLOR_CELL] = {
    generate: function () {
        if (cleverapps.config.type !== "match3") {
            return;
        }

        return {
            goal: cleverapps.Random.random(25, 30),
            difficulty: DailyTask.HARD
        };
    },

    icon: "daily_task_icon_multi_color_cell_png"
};

DailyTasks.CONFIG[DailyTasks.USE_BOOSTER] = {
    generate: function () {
        if (cleverapps.boosters.listBoosters().length === 0) {
            return;
        }

        return {
            goal: cleverapps.Random.random(3, 5),
            difficulty: DailyTask.EASY
        };
    },

    icon: "daily_task_icon_use_booster_png"
};

DailyTasks.CONFIG[DailyTasks.USE_BOOSTER_BEFORE] = {
    generate: function () {
        if (cleverapps.boosters.listBoostersBefore().length === 0) {
            return;
        }

        return {
            goal: cleverapps.Random.random(3, 5),
            difficulty: DailyTask.EASY
        };
    },

    icon: "daily_task_icon_booster_before_png"
};

DailyTasks.CONFIG[DailyTasks.COLLECT_COLOR_CELLS] = {
    generate: function () {
        if (cleverapps.config.type !== "match3") {
            return;
        }
        var colorMedium = cleverapps.Random.choose(DailyTasks.CELL_COLORS);
        return [{
            goal: Math.floor(cleverapps.Random.random(500, 1000) / 100) * 100,
            difficulty: DailyTask.MEDIUM,
            color: colorMedium
        }, {
            goal: Math.floor(cleverapps.Random.random(2500, 3000) / 100) * 100,
            difficulty: DailyTask.HARD,
            color: cleverapps.Random.choose(DailyTasks.CELL_COLORS.filter(function (color) {
                return color !== colorMedium;
            }))
        }];
    },

    icon: {
        a: "daily_task_icon_color_cells_a_png",
        b: "daily_task_icon_color_cells_b_png",
        d: "daily_task_icon_color_cells_d_png"
    }
};

DailyTasks.CONFIG[DailyTasks.COLLECT_HERO_CELLS] = {
    generate: function () {
        if (cleverapps.config.type !== "match3") {
            return;
        }

        return {
            goal: cleverapps.Random.random(25, 30),
            difficulty: DailyTask.HARD,
            color: cleverapps.Random.choose(DailyTasks.CELL_COLORS)
        };
    },

    icon: {
        a: "daily_task_icon_hero_cells_a_png",
        b: "daily_task_icon_hero_cells_b_png",
        d: "daily_task_icon_hero_cells_d_png"
    }
};

DailyTasks.CONFIG[DailyTasks.DESTROY_ENT] = {
    generate: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        return {
            goal: cleverapps.Random.random(3, 4),
            difficulty: DailyTask.EASY
        };
    },

    icon: "daily_task_icon_destroy_ent_png"
};

DailyTasks.CONFIG[DailyTasks.MAKE_ORDER] = {
    generate: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        return {
            goal: 3,
            difficulty: DailyTask.EASY
        };
    },

    icon: "daily_task_icon_make_order_png"
};

DailyTasks.CONFIG[DailyTasks.USE_RAINBOW] = {
    generate: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        return {
            goal: cleverapps.Random.random(1, 2),
            difficulty: DailyTask.MEDIUM
        };
    },

    icon: "daily_task_icon_use_rainbow_png"
};

DailyTasks.CONFIG[DailyTasks.MERGE_SOLDIERS] = {
    generate: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        return {
            goal: cleverapps.Random.random(10, 15),
            difficulty: DailyTask.HARD
        };
    },

    icon: "daily_task_icon_merge_soldiers_png"
};

DailyTasks.CONFIG[DailyTasks.HARVEST_FRUITS] = {
    generate: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        return {
            goal: cleverapps.Random.random(30, 40),
            difficulty: DailyTask.MEDIUM
        };
    },

    icon: "daily_task_icon_harvest_fruit_png"
};

DailyTasks.CONFIG[DailyTasks.USE_WORKER] = {
    generate: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        return {
            goal: cleverapps.Random.random(25, 50),
            difficulty: DailyTask.MEDIUM
        };
    },

    icon: "daily_task_icon_use_worker_png"
};

DailyTasks.CONFIG[DailyTasks.OPEN_CHEST] = {
    generate: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        return {
            goal: cleverapps.Random.random(20, 30),
            difficulty: DailyTask.HARD
        };
    },

    icon: "daily_task_icon_open_chest_png"
};

DailyTasks.CONFIG[DailyTasks.COLLECT_PIXEL] = {
    generate: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        return {
            goal: cleverapps.Random.random(40, 55),
            difficulty: DailyTask.HARD
        };
    },

    icon: "daily_task_icon_collect_pixel_png"
};

DailyTasks.CONFIG[DailyTasks.MERGE] = {
    generate: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        var data = { mergeAmount: cleverapps.Random.choose([9, 17]) };
        var goal = cleverapps.Random.random(5, 10);
        if (data.mergeAmount === 17) {
            goal = cleverapps.Random.random(3, 4);
        }
        return {
            mergeAmount: data.mergeAmount,
            goal: goal,
            difficulty: DailyTask.MEDIUM
        };
    },

    icon: "daily_task_icon_merge_png"
};

DailyTasks.CONFIG[DailyTasks.BUY_UNITS_SHOP_ITEMS] = {
    generate: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        return {
            goal: cleverapps.Random.random(1, 2),
            difficulty: DailyTask.EASY
        };
    },

    icon: "daily_task_icon_units_shop_png"
};

DailyTasks.CONFIG[DailyTasks.PLAY_MINESWEEPER] = {
    generate: function () {
        if (cleverapps.config.name !== "mergecraft") {
            return;
        }

        return {
            goal: cleverapps.Random.random(2, 3),
            difficulty: DailyTask.MEDIUM
        };
    },

    icon: "daily_task_icon_minesweeper_png"
};

DailyTasks.CONFIG[DailyTasks.CREATE_SOURCE] = {
    generate: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        return {
            goal: cleverapps.Random.random(10, 15),
            difficulty: DailyTask.HARD
        };
    },

    icon: "daily_task_icon_create_source_png"
};

DailyTasks.CONFIG[DailyTasks.ENERGY_LOTTERY] = {
    generate: function () {
        if (!(cleverapps.config.type === "merge" && cleverapps.user.level <= 8 && Game.currentGame && Game.currentGame.energyLottery && Game.currentGame.energyLottery.isAvailable())) {
            return;
        }

        return {
            goal: 1,
            difficulty: DailyTask.EASY
        };
    },

    icon: "daily_task_icon_energy_lottery_png"
};

DailyTasks.CONFIG[DailyTasks.OPEN_FOG] = {
    generate: function () {
        if (!(cleverapps.config.type === "merge" && cleverapps.user.level <= 8)) {
            return;
        }

        return {
            goal: 1,
            difficulty: DailyTask.MEDIUM
        };
    },

    icon: "daily_task_icon_open_fog_png"
};

DailyTasks.CONFIG[DailyTasks.FINISH_QUEST] = {
    generate: function () {
        if (!(cleverapps.config.type === "merge" && cleverapps.user.level <= 8)) {
            return;
        }

        return {
            goal: cleverapps.Random.random(3, 5),
            difficulty: DailyTask.MEDIUM
        };
    },

    icon: "daily_task_icon_finish_quest_png"
};

DailyTasks.CONFIG[DailyTasks.USE_UP_INSTANT_WORKER] = {
    generate: function () {
        if (!(cleverapps.config.type === "merge" && cleverapps.user.level <= 8)) {
            return;
        }

        return {
            goal: 1,
            difficulty: DailyTask.HARD
        };
    },

    icon: "daily_task_icon_instant_worker_png"
};

DailyTasks.CONFIG[DailyTasks.BUILD] = {
    generate: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        return {
            goal: cleverapps.Random.random(50, 65),
            difficulty: DailyTask.HARD
        };
    },

    icon: "daily_task_icon_build_png"
};

DailyTasks.CONFIG[DailyTasks.GROW_PLANT] = {
    generate: function () {
        if (cleverapps.config.type !== "merge") {
            return;
        }

        return {
            goal: cleverapps.Random.random(85, 100),
            difficulty: DailyTask.HARD
        };
    },

    icon: "daily_task_icon_grow_plant_png"
};

DailyTasks.CONFIG[DailyTasks.PASS_DAILY_CUP_LEVEL] = {
    generate: function () {
        if (!cleverapps.dailyCup.isAvailable()) {
            return;
        }

        return {
            goal: cleverapps.Random.random(2, 3),
            difficulty: DailyTask.EASY
        };
    },

    icon: "daily_task_icon_daily_cup_png"
};

DailyTasks.CONFIG[DailyTasks.GUESS_LONG_WORDS] = {
    generate: function () {
        if (cleverapps.config.type !== "board") {
            return;
        }

        return {
            goal: 20,
            difficulty: DailyTask.HARD
        };
    },

    icon: "daily_task_icon_long_words_png"
};

DailyTasks.CONFIG[DailyTasks.PASS_KNOCKOUT] = {
    generate: function () {
        if (!cleverapps.isKnockoutGame()) {
            return;
        }

        return {
            goal: 1,
            difficulty: DailyTask.MEDIUM
        };
    },

    icon: "daily_task_icon_knockout_png"
};

DailyTasks.CONFIG[DailyTasks.PLAY_MINI_GAME] = {
    generate: function () {
        if (bundles.dailytasks.frames.daily_task_icon_mini_game_png === undefined) {
            return;
        }

        return {
            goal: 1,
            difficulty: DailyTask.EASY
        };
    },

    icon: "daily_task_icon_mini_game_png"
};

DailyTasks.CONFIG[DailyTasks.COMPLETE_ALL] = {
    icon: "daily_task_icon_complete_all_png"
};
