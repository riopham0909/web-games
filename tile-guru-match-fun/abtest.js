/**
 * Created by slava on 4/4/17.
 */

if (typeof cc === "undefined") {
    var cleverapps = require("../utils");
}

cleverapps.ABTest = function () {
    this.groups = {};

    this.updateGroups();
};

cleverapps.ABTest.A = 0;
cleverapps.ABTest.B = 1;
cleverapps.ABTest.C = 2;
cleverapps.ABTest.D = 3;

cleverapps.ABTest.groupEventNames = {};

Object.keys(cleverapps.ABTest).forEach(function (name) {
    var group = cleverapps.ABTest[name];
    if (typeof group === "number") {
        cleverapps.ABTest.groupEventNames[group] = name.toLowerCase();
    }
});

cleverapps.ABTest.prototype.updateGroups = function (userId) {
    this.groups = {};

    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.ABTEST) || {};

    for (var id in cleverapps.ABTest.Tests) {
        var test = cleverapps.ABTest.Tests[id];

        if (cleverapps.user.checkAvailable(test.available)) {
            if (data[id] !== undefined) {
                this.setGroup(test, data[id]);
                continue;
            }

            if (cleverapps.isLocalhost()) {
                this.setGroup(test, cleverapps.ABTest.A);
            } else {
                var group = cleverapps.ABTest.A;
                var rnd = cleverapps.Random.seededDouble((userId || cleverapps.platform.getUserID()) + test.id);
                if (rnd > test.AWeight) {
                    group = cleverapps.ABTest.B;
                }
                this.setGroup(test, group);
            }
        }
    }
};

cleverapps.ABTest.prototype.forceGroup = function (test, group) {
    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.ABTEST) || {};
    data[test.id] = group;
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.ABTEST, data);

    this.updateGroups();
};

cleverapps.ABTest.prototype.getGroup = function (test) {
    return this.groups[test.id];
};

cleverapps.ABTest.prototype.setGroup = function (test, group) {
    this.groups[test.id] = group;
};

cleverapps.ABTest.prototype.logEvent = function (test, event, params) {
    var group = this.getGroup(test);
    if (group !== undefined) {
        group = cleverapps.ABTest.groupEventNames[group];
        cleverapps.eventLogger.logEvent("ab_" + test.id + "_" + group + "_" + event, params);
    }
};

cleverapps.ABTest.prototype.allLogEvent = function (event, params) {
    params = params || {};

    var page = cleverapps.travelBook.getCurrentExpedition();
    var expedition = params.expedition || page && page.id;

    for (var id in this.groups) {
        var test = cleverapps.ABTest.Tests[id];

        if (test.expeditions && test.expeditions.indexOf(expedition) === -1) {
            continue;
        }

        var group = cleverapps.ABTest.groupEventNames[this.getGroup(test)];
        cleverapps.eventLogger.logEvent("ab_" + test.id + "_" + group + "_" + event, params);
    }
};

cleverapps.ABTest.HIGH_MONETIZATION = function () {
    return cleverapps.abTest.getGroup(cleverapps.ABTest.Tests.highMonet) === cleverapps.ABTest.A;
};

cleverapps.ABTest.APP_LOVIN = function () {
    return cleverapps.abTest.getGroup(cleverapps.ABTest.Tests.appLovin) === cleverapps.ABTest.A;
};

cleverapps.ABTest.BUY_INGREDIENTS = function () {
    return cleverapps.abTest.getGroup(cleverapps.ABTest.Tests.buyIng) === cleverapps.ABTest.A;
};

cleverapps.ABTest.Tests = {
    highMonet: {
        AWeight: 0.3,
        available: {
            registeredDate: "2024-01-10",
            source: ["instant", "yandex", "web_ok", "mobile_ok", "test"],
            projectName: ["riddles", "heroes", "woodenblock", "tripeaks"]
        }
    },

    appLovin: {
        available: {
            source: ["android"],
            projectName: ["mergecraft", "wondermerge"],
            paymentsCountry: "other"
        }
    },

    buyIng: {
        expeditions: ["dragonia3"],
        available: {
            projectName: ["mergecraft", "wondermerge", "fairy"]
        }
    }
};

cleverapps.ABTest.ChangeConfigsForAB = function () {
    // console.log("Change configs for AB, ", expedition);
    // FamiliesHelper.unoverrideFamilies();
};

(function () {
    for (var name in cleverapps.ABTest.Tests) {
        var test = cleverapps.ABTest.Tests[name];
        test.id = name;
        test.groups = test.groups || [cleverapps.ABTest.A, cleverapps.ABTest.B];
        test.AWeight = test.AWeight || 0.5;
    }
}());

if (typeof cc === "undefined") {
    module.exports = cleverapps.ABTest.Tests;
}
