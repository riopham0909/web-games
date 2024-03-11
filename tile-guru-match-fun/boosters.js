/**
 * Created by andrey on 31.08.17.
 */

cleverapps.Boosters = function (isNewUser) {
    this.boosterBeforeIds = cleverapps.Boosters.listBoostersBeforeIds();
    this.boosterIds = cleverapps.Boosters.listBoostersIds();

    this.boosters = {};
    this.changed = {};
    this.createBoosters();

    if (isNewUser) {
        this.initialize();
    } else {
        this.load();
    }
};

cleverapps.Boosters.prototype.initialize = function () {
    this.data = {};
    this.addInitAmount();
};

cleverapps.Boosters.prototype.createBoosters = function () {
    this.boosterIds.concat(this.boosterBeforeIds).forEach(function (id) {
        var Ctor = cleverapps.Boosters.CONFIG[id].model;
        this.boosters[id] = new (Ctor)(id);
    }, this);
};

cleverapps.Boosters.prototype.addInitAmount = function () {
    var changed = false;
    this.listAll().forEach(function (booster) {
        if (this.data[booster.id] === undefined) {
            this.data[booster.id] = cleverapps.Boosters.INIT_AMOUNT;
            changed = true;
        }
    }, this);

    if (changed) {
        this.save();
    }
};

cleverapps.Boosters.prototype.load = function () {
    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.BOOSTERS);
    this.data = data || {};
};

cleverapps.Boosters.prototype.save = function (updateServer) {
    if (cleverapps.Boosters.IsUnlimited()) {
        return;
    }

    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.BOOSTERS, this.data);

    if (updateServer !== false) {
        cleverapps.synchronizer.addUpdateTask("boosters");
    }
};

cleverapps.Boosters.prototype.getAmount = function (id) {
    return this.data[id] ? this.data[id] : 0;
};

cleverapps.Boosters.prototype.has = function (id) {
    return this.getAmount(id) > 0;
};

cleverapps.Boosters.prototype.take = function (id) {
    if (this.has(id)) {
        this.setAmount(id, this.getAmount(id) - 1);
    }
};

cleverapps.Boosters.prototype.add = function (id, count, silent) {
    count = count || 1;
    this.setAmount(id, this.getAmount(id) + count, silent);
};

cleverapps.Boosters.prototype.setAmount = function (id, amount, silent) {
    var oldAmount = this.getAmount(id);
    if (oldAmount !== amount) {
        this.data[id] = amount;
        this.changed[id] = true;
        this.save();

        if (!silent) {
            this.onChange();
        }
    }
};

cleverapps.Boosters.prototype.onChange = function () {
    var changed = this.changed;
    this.changed = {};

    for (var id in changed) {
        this.boosters[id].trigger("changeAmount");
    }
};

cleverapps.Boosters.prototype.getBoosterById = function (id) {
    return this.boosters[id];
};

cleverapps.Boosters.prototype.listBoosters = function () {
    return this.boosterIds.map(function (id) {
        return this.boosters[id];
    }, this);
};

cleverapps.Boosters.prototype.listBoostersBefore = function () {
    return this.boosterBeforeIds.map(function (id) {
        return this.boosters[id];
    }, this);
};

cleverapps.Boosters.prototype.listAll = function () {
    return this.listBoostersBefore().concat(this.listBoosters());
};

cleverapps.Boosters.listBoostersIds = function () {
    if (cleverapps.config.name === "scramble") {
        return [cleverapps.Boosters.TYPE_HINT, cleverapps.Boosters.TYPE_SHUFFLE];
    }
    if (cleverapps.config.type === "match3") {
        return [cleverapps.Boosters.TYPE_CELL, cleverapps.Boosters.TYPE_LINE, cleverapps.Boosters.TYPE_COLOR];
    }
    if (cleverapps.config.type === "board") {
        return [cleverapps.Boosters.TYPE_HINT];
    }
    if (cleverapps.config.type === "solitaire") {
        return [cleverapps.Boosters.TYPE_WILDCARD, cleverapps.Boosters.TYPE_UNDO];
    }
    if (cleverapps.config.name === "differences") {
        return [cleverapps.Boosters.TYPE_BRUSH, cleverapps.Boosters.TYPE_DISCOVER];
    }
    if (cleverapps.config.type === "tile3") {
        return [cleverapps.Boosters.TYPE_TILE_SHUFFLE, cleverapps.Boosters.TYPE_UNDO, cleverapps.Boosters.TYPE_VACUUM];
    }
    if (cleverapps.config.type === "klondike") {
        return [cleverapps.Boosters.TYPE_UNDO, cleverapps.Boosters.TYPE_HINT];
    }
    if (cleverapps.config.type === "blocks") {
        return [cleverapps.Boosters.TYPE_REPLACE_ALL, cleverapps.Boosters.TYPE_CLEAR_PIECES, cleverapps.Boosters.TYPE_UNDO_PIECE];
    }

    return [];
};

cleverapps.Boosters.listBoostersBeforeIds = function () {
    if (cleverapps.config.type === "match3") {
        return [cleverapps.Boosters.TYPE_COMBO, cleverapps.Boosters.TYPE_MOVES, cleverapps.Boosters.TYPE_MULTICOLOR];
    }

    if (cleverapps.config.type === "solitaire") {
        return [cleverapps.Boosters.TYPE_MAGNET, cleverapps.Boosters.TYPE_DICE, cleverapps.Boosters.TYPE_JOKERS];
    }

    if (cleverapps.config.subtype === "stacks") {
        return [cleverapps.Boosters.TYPE_HIGHLIGHT, cleverapps.Boosters.TYPE_EYE, cleverapps.Boosters.TYPE_MAGNIFIER];
    }

    return [];
};

cleverapps.Boosters.IsUnlimited = function () {
    return cleverapps.config.type === "klondike";
};

cleverapps.Boosters.INIT_AMOUNT = 1;

cleverapps.Boosters.TYPE_CELL = 0;
cleverapps.Boosters.TYPE_LINE = 1;
cleverapps.Boosters.TYPE_COLOR = 2;

cleverapps.Boosters.TYPE_HINT = 3;
cleverapps.Boosters.TYPE_WILDCARD = 4;
cleverapps.Boosters.TYPE_SHUFFLE = 16;
cleverapps.Boosters.TYPE_BRUSH = 8;
cleverapps.Boosters.TYPE_DISCOVER = 9;

cleverapps.Boosters.TYPE_COMBO = 5;
cleverapps.Boosters.TYPE_MOVES = 6;
cleverapps.Boosters.TYPE_MULTICOLOR = 7;

cleverapps.Boosters.TYPE_MAGNET = 10;
cleverapps.Boosters.TYPE_DICE = 11;
cleverapps.Boosters.TYPE_JOKERS = 12;

cleverapps.Boosters.TYPE_HIGHLIGHT = 13;
cleverapps.Boosters.TYPE_EYE = 14;
cleverapps.Boosters.TYPE_MAGNIFIER = 15;

cleverapps.Boosters.TYPE_TILE_SHUFFLE = 17;
cleverapps.Boosters.TYPE_UNDO = 18;
cleverapps.Boosters.TYPE_RETURN = 19;
cleverapps.Boosters.TYPE_VACUUM = 23;

cleverapps.Boosters.TYPE_REPLACE_ALL = 20;
cleverapps.Boosters.TYPE_CLEAR_PIECES = 21;
cleverapps.Boosters.TYPE_UNDO_PIECE = 22;