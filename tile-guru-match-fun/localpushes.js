/**
 * Created by andrey on 10.01.18.
 */

if (typeof cc === "undefined") {
    var cleverapps = require("../utils");
}

cleverapps.LocalPushes = function () {
    this.initSender();
    this.load();

    this.queue = {};

    this.initialized = false;

    cleverapps.platform.nativeEventListeners.LocalPushes = this.onNativeEvent.bind(this);
};

cleverapps.LocalPushes.prototype.processQueue = function () {
    var queue = this.queue;
    for (var id in queue) {
        var timeout = queue[id];
        var push = cleverapps.LocalPushes.GetTypeById(id);
        if (push) {
            this.sendPush(push, timeout);
        }
    }

    this.queue = {};
};

cleverapps.LocalPushes.prototype.initialize = function () {
    this.initialized = true;

    this.processQueue();
    this.onShow();
    cleverapps.timeouts.setInterval(this.cancelSoonPushes.bind(this), cleverapps.parseInterval("1 minutes"));
};

cleverapps.LocalPushes.prototype.onShow = cleverapps.throttle(1000, function () {
    if (!this.sender) {
        return;
    }
    this.cancelSoonPushes();

    Object.keys(cleverapps.LocalPushes.TYPES).forEach(function (key) {
        if (!key.startsWith("LETS_PLAY_")) {
            return;
        }

        var timeout = key.replace("LETS_PLAY_", "") + " days";
        this.sendPush(cleverapps.LocalPushes.TYPES[key], cleverapps.parseInterval(timeout));
    }.bind(this));
});

cleverapps.LocalPushes.prototype.initSender = function () {
    var classes = [MicrosoftSender, MSStartSender, WebViewSender, SocialSender, FakeSender];

    for (var i = 0; i < classes.length; i++) {
        if (classes[i].isAppropriate()) {
            this.sender = new classes[i]();

            break;
        }
    }

    var config = cleverapps.LocalPushes.GetSenderBySource(cleverapps.platform.source) || {};
    var days = config.days || 30;
    this.maxTimeout = cleverapps.parseInterval((days + 1) + " days");
};

cleverapps.LocalPushes.prototype.reset = function () {
    this.onShow();

    for (var id in this.data) {
        var push = cleverapps.LocalPushes.GetTypeById(id);
        if (push) {
            this.cancelPush(push);
        }
    }
};

cleverapps.LocalPushes.prototype.load = function () {
    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.LOCAL_PUSHES) || {};
    this.permitted = data.permitted;

    data = cleverapps.clone(data);
    delete data.permitted;
    this.data = data;
};

cleverapps.LocalPushes.prototype.save = function () {
    var data = cleverapps.clone(this.data);
    data.permitted = this.permitted;
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.LOCAL_PUSHES, data);
};

cleverapps.LocalPushes.prototype.askPermission = function (callback) {
    if (this.sender && this.sender.askPermissions) {
        this.sender.askPermissions(callback);
    } else {
        callback();
    }
};

cleverapps.LocalPushes.prototype.setPermitted = function (permitted) {
    if (this.permitted !== permitted) {
        this.permitted = permitted;
        this.save();
    }
};

cleverapps.LocalPushes.ONE_MINUTE = cleverapps.parseInterval("1 minute");

cleverapps.LocalPushes.prototype.sendPush = function (info, timeout) {
    if (!this.sender) {
        return;
    }

    var id = info.id;

    if (!this.initialized) {
        this.queue[id] = timeout;
        return;
    }

    if (this.sender.getId) {
        id = this.sender.getId(info);
    }

    timeout = timeout || 0;

    var curValue = this.data[id] ? this.data[id].when : 0;
    var nextValue = timeout ? Date.now() + timeout : 0;

    if (Math.abs(curValue - nextValue) < cleverapps.LocalPushes.ONE_MINUTE || this.maxTimeout <= timeout) {
        return;
    }

    if (timeout < cleverapps.LocalPushes.TIMEOUT_THRESHOLD) {
        if (curValue) {
            this.cancelPush(info);
        }
    } else {
        this.data[id] = {
            when: nextValue
        };
        this.save();

        this.sender.sendPush(info, timeout);
    }
};

cleverapps.LocalPushes.prototype.cancelPush = function (info) {
    if (!this.sender) {
        return;
    }

    var id = info.id;
    delete this.queue[id];

    if (this.sender.getId) {
        id = this.sender.getId(info);
    }

    if (!this.data[id]) {
        return;
    }

    if (this.data[id].when) {
        if (this.data[id].when > Date.now()) {
            this.sender.cancelPush(info);
        } else {
            this.logSendEvent(info);
        }
    }
    
    delete this.data[id];
    this.save();
};

cleverapps.LocalPushes.prototype.cancelSoonPushes = function () {
    for (var id in this.data) {
        var timeout = this.data[id].when - Date.now();

        if (timeout <= cleverapps.LocalPushes.TIMEOUT_THRESHOLD) {
            var push = cleverapps.LocalPushes.GetTypeById(id);
            if (push) {
                this.cancelPush(push);
            }
        }
    }
};

cleverapps.LocalPushes.prototype.logSendEvent = function (info) {
    var isClientSender = cleverapps.platform.oneOf(AndroidBase, Apple, MSStart);
    if (!isClientSender) {
        return;
    }

    var code = info && info.code;
    if (code) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.PUSHES.SEND + code);
    }
};

cleverapps.LocalPushes.prototype.onNativeEvent = function (event, options) {
    console.log("LocalPushes.onNativeEvent - " + event);

    switch (event) {
        case "clickEvent":
            this.logClickEvent(options.code);
            break;
    }
};

cleverapps.LocalPushes.prototype.logClickEvent = function (code, event) {
    console.log("LocalPushes.logClickEvent " + code);

    cleverapps.eventLogger.logEvent((event || cleverapps.EVENTS.STATS.PUSHES.CLICK) + code);

    if (cleverapps.config.debugMode) {
        var text = "Source Push: ";

        if (event === cleverapps.EVENTS.STATS.PUSHES.CLICK_ANDROID) {
            text = "Android_OK. " + text;
        }

        cleverapps.timeouts.setTimeout(function () {
            cleverapps.notification.create(text + code);
        }, 5000);
    }
};

cleverapps.LocalPushes.GetPushData = function (data) {
    var texts = Messages.get(data.message);
    var titlesTexts = Messages.get(data.title, {
        gameTitle: Messages.get(cleverapps.config.title)
    });

    if (!Array.isArray(texts)) {
        texts = [texts];
    }
    if (!Array.isArray(titlesTexts)) {
        titlesTexts = [titlesTexts];
    }

    var index = cleverapps.Random.random(0, texts.length - 1);

    return {
        text: texts[index],
        title: titlesTexts[index] || cleverapps.Random.mathChoose(titlesTexts),
        index: index
    };
};

cleverapps.LocalPushes.TYPES = {
    BONUS_ROUND: {
        id: 2,
        title: "LocalPushes.BONUS_ROUND.Title",
        message: "LocalPushes.BONUS_ROUND"
    },

    LIVES: {
        id: 3,
        title: "LocalPushes.LIVES.Title",
        message: "LocalPushes.LIVES"
    },

    MINI_GAME: {
        id: 4,
        title: "LocalPushes.MINI_GAME.Title",
        message: "LocalPushes.MINI_GAME"
    },

    LETS_PLAY_1: 5,

    FREE_CHEST: {
        id: 6,
        title: "LocalPushes.FREE_CHEST.Title",
        message: "LocalPushes.FREE_CHEST"
    },

    ENERGY_LOTTERY: {
        id: 7,
        title: "LocalPushes.LIVES_LOTTERY.Title",
        message: "LocalPushes.LIVES_LOTTERY"
    },

    FRUIT_RIPE: {
        id: 8,
        title: "LocalPushes.FRUIT_RIPE.Title",
        message: "LocalPushes.FRUIT_RIPE"
    },

    CASTLE_PRIZE: {
        id: 9,
        title: "LocalPushes.CASTLE_PRIZE.Title",
        message: "LocalPushes.CASTLE_PRIZE"
    },

    ORDER_READY: {
        id: 10,
        title: "LocalPushes.ORDER_READY.Title",
        message: "LocalPushes.ORDER_READY"
    },

    TREE_CHOPPED: {
        id: 11,
        title: "LocalPushes.TREE_CHOPPED.Title",
        message: "LocalPushes.TREE_CHOPPED"
    },

    BUILDING_BUILT: {
        id: 12,
        title: "LocalPushes.BUILDING_BUILT.Title",
        message: "LocalPushes.BUILDING_BUILT"
    },

    MAGIC_PLANT_READY: {
        id: 13,
        title: "LocalPushes.MAGIC_PLANT_READY.Title",
        message: "LocalPushes.MAGIC_PLANT_READY"
    },

    MINI_GAME_PRIZE: {
        id: 14,
        title: "LocalPushes.MINI_GAME_PRIZE.Title",
        message: "LocalPushes.MINI_GAME_PRIZE"
    },

    DAILY_TASKS_UNCOMPLETED: {
        id: 15,
        title: "LocalPushes.DAILY_TASKS_UNCOMPLETED.Title",
        message: "LocalPushes.DAILY_TASKS_UNCOMPLETED"
    },

    PASS_UNCOMPLETED: {
        id: 16,
        title: "LocalPushes.PASS_UNCOMPLETED.Title",
        message: "LocalPushes.PASS_UNCOMPLETED"
    },

    PUMPKIN_RIPE: {
        id: 17,
        title: "LocalPushes.PUMPKIN_RIPE.Title",
        message: "LocalPushes.PUMPKIN_RIPE"
    },

    UNITLOCK_OPEN: {
        id: 18,
        title: "LocalPushes.UNITLOCK_OPEN.Title",
        message: "LocalPushes.UNITLOCK_OPEN"
    },

    EXPEDITION: {
        id: 19,
        title: "LocalPushes.EXPEDITION.Title",
        message: "LocalPushes.EXPEDITION"
    },

    EXPEDITION_TREE_CHOPPED: {
        id: 20,
        title: "LocalPushes.EXPEDITION_TREE_CHOPPED.Title",
        message: "LocalPushes.EXPEDITION_TREE_CHOPPED"
    },

    EXPEDITION_PERIODIC: {
        id: 21,
        title: "LocalPushes.EXPEDITION_PERIODIC.Title",
        message: "LocalPushes.EXPEDITION_PERIODIC"
    },

    LETS_PLAY_2: 22,
    LETS_PLAY_3: 23,
    LETS_PLAY_4: 24,
    LETS_PLAY_5: 25
};

(function () {
    Object.keys(cleverapps.LocalPushes.TYPES).forEach(function (key) {
        if (!key.startsWith("LETS_PLAY_")) {
            return;
        }
        
        var id = cleverapps.LocalPushes.TYPES[key];
        cleverapps.LocalPushes.TYPES[key] = {
            id: id,
            title: "LocalPushes.LETS_PLAY.Title",
            message: "LocalPushes.LETS_PLAY"
        };
    });

    cleverapps.LocalPushes.TypesById = {};

    for (var key in cleverapps.LocalPushes.TYPES) {
        var type = cleverapps.LocalPushes.TYPES[key];
        type.code = key.toLowerCase();

        cleverapps.LocalPushes.TypesById[type.id] = type;
    }
}());

cleverapps.LocalPushes.GetTypeById = function (id) {
    return cleverapps.LocalPushes.TypesById[id];
};

cleverapps.LocalPushes.GetTypeByCode = function (code) {
    return code && code.toUpperCase && cleverapps.LocalPushes.TYPES[code.toUpperCase()];
};

cleverapps.LocalPushes.TIMEOUT_THRESHOLD = cleverapps.parseInterval("3 minutes");

if (cleverapps.config.debugMode) {
    cleverapps.LocalPushes.TIMEOUT_THRESHOLD = cleverapps.parseInterval("10 seconds");
}

if (typeof cc === "undefined") {
    module.exports = cleverapps;
}
