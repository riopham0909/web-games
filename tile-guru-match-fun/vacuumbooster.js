/**
 * Created by Ivan on 05.10.2023
 */

var VacuumBooster = function (id) {
    Booster.call(this, id);
    this.onDisableListener();
};

VacuumBooster.prototype = Object.create(Booster.prototype);
VacuumBooster.prototype.constructor = VacuumBooster;

VacuumBooster.prototype.calcBlowTriads = function () {
    var countOfCards = Game.currentGame.table.cards.length;

    if (countOfCards * 0.6 >= VacuumBooster.DEFAULT_BLOW_TRIADS * 3) {
        return VacuumBooster.DEFAULT_BLOW_TRIADS;
    }
    if (countOfCards * 0.8 >= VacuumBooster.DEFAULT_BLOW_TRIADS * 3) {
        return VacuumBooster.DEFAULT_BLOW_TRIADS - 1;
    }
    return VacuumBooster.DEFAULT_BLOW_TRIADS - 2;
};

VacuumBooster.prototype.onExecute = function () {
    Game.currentGame.table.blowCards(this.calcBlowTriads());
};

VacuumBooster.prototype.onGameStarted = function () {
    Game.currentGame.log.on("change", this.updateState.bind(this));
    Game.currentGame.table.on("blowCards", this.updateState.bind(this));
};

VacuumBooster.prototype.updateState = function () {
    if (Game.currentGame.table.findCardsToBlow()) {
        this.onEnableListener();
    } else {
        this.onDisableListener();
    }
};

VacuumBooster.DEFAULT_BLOW_TRIADS = 3;