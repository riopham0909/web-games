/**
 * Created by andrey on 18.08.17.
 */

cleverapps.Lives = function (isNewUser, slot) {
    this.slot = slot;
    if (isNewUser) {
        this.init();
    } else {
        this.load();
    }

    this.onChangeAmountListeners = {};

    this.onStartRegenerateListener = function () {};
    this.onBuyUnlimitedLivesListener = function () {};
    this.onFullListener = function () {};

    this.processRegenerateState();
};

cleverapps.Lives.TIMEOUT = cleverapps.parseInterval(cleverapps.config.debugMode ? "1 minute" : "30 minutes");

cleverapps.Lives.prototype.init = function () {
    this.amount = this.getMaxLives();
    this.whenStart = undefined;
    this.save();
};

cleverapps.Lives.prototype.getMaxLives = function () {
    if (cleverapps.config.name === "olympics") {
        return 3;
    }

    if (cleverapps.config.name === "zenmatch") {
        return 3;
    }

    return 5;
};

cleverapps.Lives.prototype.processRegenerateState = function (silent) {
    this.stopRegenerateTimeout();

    var changed, needSave;
    while (this.amount < this.getMaxLives() && this.whenStart && (this.whenStart + cleverapps.Lives.TIMEOUT) <= Date.now()) {
        this.amount++;
        this.whenStart += cleverapps.Lives.TIMEOUT;
        changed = true;
        needSave = true;
    }

    var unlimited = cleverapps.unlimitedLives && cleverapps.unlimitedLives.checkBuyed();

    if (changed && !silent && !unlimited) {
        this.runListeners();
    }

    if (changed && this.amount >= this.getMaxLives()) {
        this.onFullListener();
    }

    if (this.amount >= this.getMaxLives()) {
        delete this.whenStart;
    } else {
        if (!this.whenStart) {
            this.whenStart = Date.now();
            needSave = true;
        }

        this.startRegenerateTimeout(silent !== undefined ? silent : unlimited);
    }

    if (needSave) {
        this.save();
    }

    this.processLocalPushes();
};

cleverapps.Lives.prototype.startRegenerateTimeout = function (silent) {
    if (this.finishRegenerateTimeout === undefined) {
        console.log("startRegenerateTimeout", this.calcTimeLeft());
        this.finishRegenerateTimeout = new cleverapps.LongTimeout(this.processRegenerateState.bind(this), this.calcTimeLeft());
        if (!silent) {
            this.onStartRegenerateListener();
        }
    }
};

cleverapps.Lives.prototype.stopRegenerateTimeout = function () {
    clearTimeout(this.finishRegenerateTimeout);
    this.finishRegenerateTimeout = undefined;
};

cleverapps.Lives.prototype.isRegenerateRunning = function () {
    return this.finishRegenerateTimeout !== undefined;
};

cleverapps.Lives.prototype.calcTimeLeft = function () {
    var start = this.whenStart || Date.now();
    var finish = start + cleverapps.Lives.TIMEOUT;
    var timeout = finish - Date.now();
    if (timeout < 0) {
        timeout = 0;
    }
    if (timeout > cleverapps.Lives.TIMEOUT) {
        timeout = cleverapps.Lives.TIMEOUT;
    }
    return timeout;
};

cleverapps.Lives.prototype.isEmpty = function () {
    return this.amount === 0 && !cleverapps.unlimitedLives.checkBuyed();
};

cleverapps.Lives.prototype.isFull = function () {
    return this.amount >= this.getMaxLives() || cleverapps.unlimitedLives && cleverapps.unlimitedLives.checkBuyed();
};

cleverapps.Lives.prototype.give = function (amount, event, silent) {
    amount = amount === undefined ? 1 : amount;
    if (event) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.EARN.LIVES + this.slot + "_" + event, { value: amount });
    }
    this.setAmount(this.amount + amount, silent);
};

cleverapps.Lives.prototype.setAmount = function (amount, silent) {
    if (amount < 0) {
        amount = 0;
    }

    if (this.amount - amount > 0) {
        var mission = cleverapps.missionManager.findByType(Mission.TYPE_LIVESFEAST);
        if (mission) {
            mission.update(this.amount - amount);
        }
    }

    if (this.amount !== amount) {
        this.amount = amount;
        this.save();

        if (!silent) {
            this.runListeners();
        }
    }

    this.processRegenerateState(true);

    if (this.amount < this.getMaxLives() * 0.2) {
        this.showForce();
    }
};

cleverapps.Lives.prototype.processLocalPushes = cleverapps.timeredThrottle(cleverapps.parseInterval("1 minute"), function () {
    if (this.isFull()) {
        cleverapps.localPushes.cancelPush(cleverapps.LocalPushes.TYPES.LIVES);
        return;
    }

    var amount = this.getMaxLives() - this.amount;
    var whenStart = this.whenStart || Date.now();
    var timeout = whenStart + cleverapps.Lives.TIMEOUT * amount - Date.now();
    cleverapps.localPushes.sendPush(cleverapps.LocalPushes.TYPES.LIVES, timeout);
});

cleverapps.Lives.prototype.reset = function () {
    this.amount = this.getMaxLives();
    this.whenStart = undefined;
    this.processRegenerateState();
    this.save();
};

cleverapps.Lives.prototype.canTake = function (amount) {
    return this.amount >= amount;
};

cleverapps.Lives.prototype.take = function (silent) {
    if (cleverapps.config.editorMode) {
        return;
    }

    if (this.amount >= this.getMaxLives()) {
        delete this.whenStart;
    }

    if (this.amount > 0) {
        this.setAmount(this.amount - 1, silent);
    }
};

cleverapps.Lives.prototype.getInfo = function () {
    return {
        a: this.amount,
        wc: this.whenStart && cleverapps.compactTime(this.whenStart, { seconds: true })
    };
};

cleverapps.Lives.prototype.updateInfo = function (data, fromServer) {
    this.load(data);
    this.processRegenerateState();
    this.save(fromServer);
};

cleverapps.Lives.prototype.runListeners = function () {
    cleverapps.values(this.onChangeAmountListeners).forEach(function (listener) {
        listener();
    });
};

cleverapps.Lives.prototype.save = function (fromServer) {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.LIVES + this.slot, this.getInfo());
    if (!fromServer) {
        cleverapps.synchronizer.addUpdateTask("lives" + this.slot);
    }
};
 
cleverapps.Lives.prototype.load = function (save) {
    save = save || cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.LIVES + this.slot);
    if (save) {
        this.amount = save.a || save.amount || 0;
        this.whenStart = save.wc && cleverapps.expandTime(save.wc, { seconds: true }) || save.ws || save.whenStart;
    } else {
        this.amount = this.getMaxLives();
        this.whenStart = undefined;
    }
};

cleverapps.Lives.prototype.showForce = function () {

};

cleverapps.Lives.Switch = function (slot, isNewGame) {
    cleverapps.lives = cleverapps.livesBySlots[slot];
    if (isNewGame) {
        cleverapps.lives.init();
    }
};

CustomSyncers.registerBySlots("lives", function (slot) {
    return cleverapps.livesBySlots[slot] ? cleverapps.livesBySlots[slot].getInfo() : {};
}, function (slot, serverData) {
    if (cleverapps.livesBySlots[slot]) {
        cleverapps.livesBySlots[slot].updateInfo(serverData, true);
    }
});
