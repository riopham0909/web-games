/**
 * Created by andrey on 30.05.2023.
 */

if (typeof cc === "undefined") {
    var cleverapps = require("./localpushes");
}

cleverapps.LocalPushes.SENDERS = {
    fb: {
        sources: ["facebook"],
        mass: 10000,
        days: 10,
        rate: {
            playReset: true,
            limit: 5,
            interval: cleverapps.parseInterval("10 days")
        }
    },

    // Пользователь не может получать более одного уведомления от приложения за 3 дня
    mw: {
        sources: ["web_mm", "mobile_mm"],
        mass: 10000,
        rate: {
            limit: 1,
            interval: cleverapps.parseInterval("3 days")
        }
    },

    ok: {
        sources: ["web_ok", "mobile_ok"],
        length: 100,
        days: 14,
        rate: {
            limit: 5,
            interval: cleverapps.parseInterval("1 day")
        }
    },

    // Обратите внимание, нельзя отправлять пользователю более 1 уведомления в час (3 в сутки).
    vk: {
        sources: ["web_vk", "mobile_vk"],
        mass: 100000,
        rate: {
            limit: 1,
            interval: cleverapps.parseInterval("8 hours")
        }
    },

    ya: {
        sources: ["yandex"]
    },

    in: {
        sources: ["instant"],
        mass: 100000,
        days: 10,
        rate: {
            playReset: true,
            limit: 5,
            interval: cleverapps.parseInterval("10 days")
        }
    },

    mb: {
        sources: ["mbga", "sp_mbga"],
        mass: 10000
    },

    kg: {
        sources: ["kongregate"]
    }
};

(function () {
    for (var code in cleverapps.LocalPushes.SENDERS) {
        var sender = cleverapps.LocalPushes.SENDERS[code];
        sender.code = code;

        sender.days = sender.days || 30;
    }
}());

cleverapps.LocalPushes.GetSenderBySource = function (source) {
    for (var code in cleverapps.LocalPushes.SENDERS) {
        var sender = cleverapps.LocalPushes.SENDERS[code];
        if (sender.sources.includes(source)) {
            return sender;
        }
    }
};

cleverapps.LocalPushes.GetPushUserId = function (userid, source) {
    var sender = cleverapps.LocalPushes.GetSenderBySource(source);
    return sender ? (sender.code + "_" + userid) : userid;
};

if (typeof cc === "undefined") {
    module.exports = cleverapps;
}
