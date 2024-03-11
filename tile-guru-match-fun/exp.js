/**
 * Created by vladislav on 18/05/2023
 */

var Exp = function (slot) {
    cleverapps.EventEmitter.call(this);

    this.slot = slot;
};

Exp.prototype = Object.create(cleverapps.EventEmitter.prototype);
Exp.prototype.constructor = Exp;

Exp.prototype.isAvailable = function () {
    return typeof match3 !== "undefined" && match3.heroes && match3.heroes.available() || cleverapps.config.type === "merge";
};

Exp.prototype.load = function (exp, isNewGame) {
    if (isNewGame) {
        this.exp = 0;
        this.save();

        return;
    }

    this.exp = Math.floor(exp) || 0;
};

Exp.prototype.save = function () {
    if (cleverapps.gameLevel && cleverapps.gameLevel.withOwnLevel) {
        Game.currentGame.storeSave();
    } else {
        cleverapps.user.save();
    }
};

Exp.prototype.getExp = function () {
    return this.exp;
};

Exp.prototype.setExp = function (exp, silent) {
    exp = Math.floor(exp);

    if (this.exp !== exp) {
        if (cleverapps.isNumber(this.exp) && !cleverapps.isNumber(exp)) {
            cleverapps.throwAsync("Try set non number exp - " + exp);
            return;
        }

        this.exp = exp;
        this.save();

        if (!silent) {
            this.onChange();
        }
    }
};

Exp.prototype.onChange = function () {
    this.trigger("changeExp");
};

Exp.prototype.canTakeExp = function (exp) {
    return this.exp >= exp;
};

Exp.prototype.takeExp = function (exp, silent) {
    if (exp === 0) {
        return true;
    }

    if (this.canTakeExp(exp)) {
        this.setExp(this.exp - exp, silent);
        return true;
    }

    return false;
};

Exp.Switch = function (slot) {
    if (cleverapps.gameLevel.withOwnLevel) {
        cleverapps.exp = cleverapps.expBySlots[slot];
    } else {
        cleverapps.exp = cleverapps.expBySlots[CustomSyncers.SLOT_MAIN];
    }
};