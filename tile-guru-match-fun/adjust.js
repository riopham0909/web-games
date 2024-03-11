/**
 * Created by andrey on 05.07.19.
 */

cleverapps.Adjust = function () {
    this.settings = cleverapps.config.adjust;

    this.eventsConfig = cleverapps.Adjust.EVENTS_BY_PROJECTS[cleverapps.config.name + "_" + cleverapps.platform.source]
        || cleverapps.Adjust.EVENTS_BY_PROJECTS[cleverapps.config.name] || {};
};

cleverapps.Adjust.IS_AVAILABLE = function () {
    return cleverapps.platform.oneOf(AndroidPlatform, Amazon, IOS, Microsoft) && cleverapps.config.adjust;
};

cleverapps.Adjust.prototype.logPurchase = function (transactionID, amount, currency) {
    if (!this.settings.purchaseToken) {
        return;
    }

    cleverapps.platform.callNative("AdjustPlugin.logPurchase", {
        eventToken: this.settings.purchaseToken,
        transactionID: transactionID,
        amount: amount,
        currency: currency
    });
};

cleverapps.Adjust.prototype.logEvent = function (eventName) {
    var eventToken = this.eventsConfig[eventName];
    if (!eventToken) {
        return;
    }

    cleverapps.platform.callNative("AdjustPlugin.logEvent", { eventToken: eventToken });
};

cleverapps.Adjust.prototype.logAdRevenue = function (amount, source) {
    cleverapps.platform.callNative("AdjustPlugin.logAdRevenue", {
        revenue: amount,
        source: source || "AdMobAds"
    });
};

cleverapps.Adjust.EVENTS_BY_PROJECTS = {
    mergecraft: {
        day_1_watched_15_ads: "jbccgp",
        day_1_ads_count: "6xw1qz",
        day_1_ads_value: "kid7ic",

        base_watch_5: "u22jkd",
        base_reach_5: "6470zz",
        base_reach_6: "upyoby",
        base_reach_7: "wch8v0",
        base_reach_8: "97cixp",

        base_reach_10: "z14ntv",
        base_reach_15: "ezxyfw",
        base_reach_20: "1ir1u1",
        base_reach_25: "1xdrb6",
        base_reach_30: "abl702",
        base_reach_35: "irqus4",
        base_reach_40: "p3r40w",
        base_reach_45: "piecy9",
        base_reach_50: "t42txk",
        base_reach_60: "dhj4c6",
        base_reach_70: "lkx6h2",
        base_reach_80: "a36r2c",
        base_reach_90: "l1mdo9",
        base_reach_100: "fl6p6g",

        base_play_watch: "iqx5xq",
        ret1: "mbhq11",
        ret2: "rwcfsk",
        ret3: "snngl1",
        ad_start: "1t7xx4",

        watched5: "dct97c",
        watched10: "n7ogon",
        watched20: "xxuejp",
        watched30: "nucbks"
    },
    mergecraft_amazon: {
        day_1_watched_15_ads: "t78aq9",
        day_1_ads_count: "yxvwzo",
        day_1_ads_value: "yxvwzo",

        base_watch_5: "dw2scx",
        base_reach_5: "gfq0ra",
        base_reach_6: "5oktsr",
        base_reach_7: "91qkri",
        base_reach_8: "bl7nxj",

        base_reach_10: "j5fd5d",
        base_reach_15: "dl02xp",
        base_reach_20: "a9ig09",
        base_reach_25: "nv47wu",
        base_reach_30: "t3o08m",
        base_reach_35: "edxgho",
        base_reach_40: "la8vgi",
        base_reach_45: "bdhvz2",
        base_reach_50: "av0eyu",
        base_reach_60: "pj54xe",
        base_reach_70: "a6a2qq",
        base_reach_80: "dyg4pv",
        base_reach_90: "wnghr9",
        base_reach_100: "plu5in",

        base_play_watch: "vrsz17",
        ret1: "hy3og3",
        ret2: "x24une",
        ret3: "dd2acx",
        ad_start: "ema6q7",

        watched5: "e1b7j9",
        watched10: "3ojfl7",
        watched20: "1s4gw6",
        watched30: "o6gvsz"
    },
    wondermerge: {
        day_1_watched_15_ads: "htv2jn",
        day_1_ads_count: "wm0y8e",
        day_1_ads_value: "n1d7vq",

        base_watch_5: "9pf10s",
        base_reach_5: "vvln22",
        base_reach_6: "o6f6c2",
        base_reach_7: "br2kco",
        base_reach_8: "1jcqup",

        base_play_watch: "495gx2",
        ret1: "q6i4qx",
        ret2: "mqrqsj",
        ret3: "oq441s",
        ad_start: "kqjc7n",

        watched5: "za3dv7",
        watched10: "o2ob86",
        watched20: "93dpd6",
        watched30: "vq5ntb"
    },
    wondermerge_amazon: {
        day_1_watched_15_ads: "j4l46h",
        day_1_ads_count: "htw8p9",
        day_1_ads_value: "vv9j8k",

        base_watch_5: "hirymi",
        base_reach_5: "de7zzx",
        base_reach_6: "gvqmgi",
        base_reach_7: "t6dvno",
        base_reach_8: "s7zgqc",

        base_reach_10: "3skc8h",
        base_reach_15: "cjnerg",
        base_reach_20: "wppjs6",
        base_reach_25: "ymv5mq",
        base_reach_30: "aglrnj",

        base_play_watch: "qy65f3",
        ret1: "f1fmip",
        ret2: "4a4ydi",
        ret3: "gaxq5i",
        ad_start: "usikgx",

        watched5: "8tgmcb",
        watched10: "g3lnov",
        watched20: "b4rup8",
        watched30: "z78zix"
    },
    tripeaks: {
        day_1_watched_15_ads: "xu2pww",
        day_1_ads_count: "l4uq69",
        day_1_ads_value: "iiind3",

        base_watch_5: "gtw326",
        base_reach_5: "9fzsep",
        base_reach_6: "un4m72",
        base_reach_7: "ndo50w",
        base_reach_8: "m1lggx",

        base_play_watch: "n5v7ur",
        ret1: "f5a3kc",
        ret2: "b08jfl",
        ret3: "csmp5c",
        ad_start: "yp7j5w",

        watched5: "xyw6kg",
        watched10: "gs4evj",
        watched20: "ufoucq",
        watched30: "nvxdqh"
    },
    riddles: {
        day_1_watched_15_ads: "bp4gic",
        day_1_ads_count: "jbkg54",
        day_1_ads_value: "njwxz3",

        base_watch_5: "6poy4t",
        base_reach_5: "kyeedj",
        base_reach_6: "w4c4iw",
        base_reach_7: "3lvq8m",
        base_reach_8: "676jeo",

        base_play_watch: "3za8bl",
        ret1: "hbpmdx",
        ret2: "kkpft1",
        ret3: "p8maz9",
        ad_start: "jbyjm9",

        watched5: "y32egy",
        watched10: "3c629h",
        watched20: "jij40x",
        watched30: "k2s6x9"
    },
    riddles_amazon: {
        day_1_watched_15_ads: "vjnfxe",
        day_1_ads_count: "kr6niv",
        day_1_ads_value: "kq4qdb",

        base_watch_5: "81q5j2",
        base_reach_5: "mn0tug",
        base_reach_6: "neep25",
        base_reach_7: "23mdjd",
        base_reach_8: "86t38p",

        base_play_watch: "jdjv97",
        ret1: "egpjxk",
        ret2: "s1420b",
        ret3: "5n9lp5",
        ad_start: "j82z3x",

        watched5: "wcaewo",
        watched10: "lvp0zl",
        watched20: "xg4lbx",
        watched30: "q36uww"
    },
    heroes: {
        day_1_watched_15_ads: "w4pi8k",
        day_1_ads_count: "e1pr9m",
        day_1_ads_value: "sh0qzk",

        base_watch_5: "jesczs",
        base_reach_5: "ykgs4u",
        base_reach_6: "wo9lgc",
        base_reach_7: "e0bcw9",
        base_reach_8: "m9ktmt",

        base_play_watch: "d2l0bs",
        ret1: "fvnst9",
        ret2: "1ubgy5",
        ret3: "5oj8ed",
        ad_start: "23zri0",

        watched5: "qoiyrl",
        watched10: "9pp9na",
        watched20: "fdoo0k",
        watched30: "up54p9"
    },
    heroes_amazon: {
        day_1_watched_15_ads: "umx17z",
        day_1_ads_count: "ch1xib",
        day_1_ads_value: "z6uj1d",

        base_watch_5: "ekm4jo",
        base_reach_5: "kshark",
        base_reach_6: "1z4f8n",
        base_reach_7: "vckahk",
        base_reach_8: "50ggzr",

        base_play_watch: "w0h8qp",
        ret1: "gdhvmk",
        ret2: "hgyiyq",
        ret3: "1qht0h",
        ad_start: "2004lk",

        watched5: "x31rb5",
        watched10: "6kcjt5",
        watched20: "se0yoh",
        watched30: "7da1hh"
    },
    scramble: {
        day_1_watched_15_ads: "hbjznw",
        day_1_ads_count: "5795if",
        day_1_ads_value: "mvalf2",

        base_watch_5: "roxq3n",
        base_reach_5: "t1h31j",
        base_reach_6: "hxcvsu",
        base_reach_7: "4n71e2",
        base_reach_8: "4yh8ms",

        base_play_watch: "8q20g4",
        ret1: "hzo5xf",
        ret2: "dl3h35",
        ret3: "fadgvu",
        ad_start: "g9t6ci",

        watched5: "7y3w85",
        watched10: "36e3gz",
        watched20: "1nof2d",
        watched30: "j1t7mn"
    },
    fairy: {
        day_1_watched_15_ads: "oisl0k",
        day_1_ads_count: "g2wmie",
        day_1_ads_value: "1w4nky",

        base_watch_5: "xg6twq",
        base_reach_5: "k0kfhu",
        base_reach_6: "9jw3gk",
        base_reach_7: "yq3wqv",
        base_reach_8: "vjlqt0",

        base_play_watch: "i22f65",
        ret1: "amnxju",
        ret2: "8k14k4",
        ret3: "102weh",
        ad_start: "wvnqju",

        watched5: "t287oh",
        watched10: "pnwj95",
        watched20: "mzfp7z",
        watched30: "ldg8f3"
    }
};
