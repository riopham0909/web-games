/**
 * Created by slava on 15/12/17
 */

var PackManager = function (isNewUser) {
    if (isNewUser) {
        this.whenBuy = -1;
        this.used = 0;
        this.save();
    } else {
        this.load();
    }
};

PackManager.prototype.load = function () {
    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.PACK) || {};

    this.lastShown = data.lastShown || 0;
    this.whenBuy = (data.whenBuy && (data.whenBuy < Date.now())) ? data.whenBuy : -1;
    this.used = (data.used) ? data.used : 0;
};

PackManager.prototype.save = function (updateServer) {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.PACK, {
        lastShown: this.lastShown,
        whenBuy: this.whenBuy,
        used: this.used
    });

    if (updateServer !== false) {
        cleverapps.synchronizer.addUpdateTask("packs");
    }
};

PackManager.prototype.getTimeLeft = function () {
    return Math.max(0, this.whenBuy + cleverapps.parseInterval(PackManager.NEXT_STAGE_INTERVAL) - Date.now());
};

PackManager.prototype.get = function () {
    if (!PackManager.PACKS[this.used]) {
        return undefined;
    }

    return Product.Create(PackManager.PACKS[this.used]);
};

PackManager.prototype.nextPack = function () {
    this.used++;

    var amount = PackManager.PACKS.length;
    if (this.used > amount) {
        this.used = amount;
    }

    this.whenBuy = Date.now();
    this.save();

    cleverapps.sideBar.resetByClassName(PackIcon);

    clearTimeout(this.nextTimeout);
    this.nextTimeout = setTimeout(function () {
        cleverapps.sideBar.resetByClassName(PackIcon);
    }, this.getTimeLeft());
};

PackManager.prototype.isAvailable = function () {
    var pack = this.get();
    if (!pack) {
        return false;
    }

    if (cleverapps.flags.videoAdsMainMonetization) {
        return false;
    }

    if (pack.available) {
        var available = pack.available;

        if (!levels.user.checkAvailable(available)) {
            return false;
        }
    }

    if (this.getTimeLeft()) {
        return false;
    }

    if (cleverapps.config.type === "merge" && !(cleverapps.environment.isMainScene() && !cleverapps.travelBook.isExpedition())) {
        return false;
    }

    if (cleverapps.config.name === "woodenblock") {
        return false;
    }

    return true;
};

PackManager.prototype.updateShowTime = function () {
    this.lastShown = Date.now();
    this.save();
};

PackManager.prototype.needDisplayWindow = function () {
    if (!this.isAvailable()) {
        return false;
    }

    if (!cleverapps.sideBar.getIconByClassName(PackIcon)) {
        return false;
    }

    if (cleverapps.user.gold < 100 && this.lastShown + cleverapps.parseInterval(cleverapps.config.type === "merge" ? "1 hour" : "5 minute") < Date.now()) {
        return true;
    }

    return this.lastShown + cleverapps.parseInterval("3 day") < Date.now();
};

PackManager.OnRestoreSuccess = function (product) {
    var pack = cleverapps.packManager.get();
    if (pack && pack.itemId === product.itemId) {
        cleverapps.packManager.nextPack();
    }
};

PackManager.NEXT_STAGE_INTERVAL = "1 day";

if (cleverapps.config.debugMode) {
    PackManager.NEXT_STAGE_INTERVAL = "10 seconds";
}

PackManager.PACKS = ["starterPack0", "starterPack", "starterPack2"];