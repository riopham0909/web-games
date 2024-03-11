/**
 * Created by razial on 19.01.2023
 */

var ExtraPrize = function (type, value) {
    this.type = type;
    this.amount = value;

    if (this.type === "mission") {
        this.amount = value.amount;
        this.missionType = value.type;
    } else if (this.type === "lantern") {
        var lantern = Lantern.Get();
        this.amount = lantern && lantern.streak || 0;
        this.total = Lantern.getMaxStreak();
    }
};

ExtraPrize.prototype.getIcon = function () {
    var params = {
        open: "open",
        idle: "idle"
    };

    if (this.type === "mission") {
        if (this.missionType === Mission.TYPE_SLOT_MACHINE) {
            params.json = bundles.extra_prizes.jsons.slot_machine_ticket_json;
        } else if (this.missionType === Mission.TYPE_TREASURE_SEARCH) {
            params.json = bundles.extra_prizes.jsons.treasure_search_shovel_json;
        } else if (this.missionType === Mission.TYPE_STICKERS_COLLECTION) {
            params.json = bundles.extra_prizes.jsons.sticker_json;
        } else {
            params.json = Missions[this.missionType].sideBarJson;
            params.open = undefined;
            params.idle = "animation";
            params.repeat = false;
        }
    } else if (this.type === "lantern") {
        params.json = bundles.sidebar.jsons.lantern_icon_json;
        params.open = undefined;
        params.idle = "animation";
        params.repeat = false;
    }

    return params;
};

ExtraPrize.prototype.getText = function () {
    return {
        text: "" + (this.total ? this.amount + "/" + this.total : this.amount)
    };
};

ExtraPrize.prototype.getDelta = function () {
    return this.delta || 0;
};
