/**
 * Created by vladislav on 13.11.2020
 */

var FlyingAd = function () {
    cleverapps.EventEmitter.call(this);

    this.nextTime = 0;
    
    cleverapps.meta.registerControl("flyingAd", function (visible) {
        if (this.enabled) {
            this.trigger("toggle", visible);
        }
    }.bind(this));
};

FlyingAd.prototype = Object.create(cleverapps.EventEmitter.prototype);
FlyingAd.prototype.constructor = FlyingAd;

FlyingAd.prototype.setGame = function (game) {
    game.userStatus.on("inactive_very_short", this.update.bind(this));
};

FlyingAd.prototype.reset = function () {
    this.disable();

    this.purge();

    this.type = undefined;

    if (cleverapps.environment.isGameScene() && cleverapps.config.type === "board") {
        this.setDelay(cleverapps.parseInterval(FlyingAd.GAMESCENE_DELAY));
    }
};

FlyingAd.prototype.getSkin = function () {
    return FlyingAd.DATA[this.type].skin;
};

FlyingAd.prototype.needUpdate = function () {
    return !this.enabled && this.isReady();
};

FlyingAd.prototype.setDelay = function (delay) {
    this.nextTime = Date.now() + delay;
};

FlyingAd.prototype.isReady = function () {
    return Date.now() >= this.nextTime;
};

FlyingAd.prototype.update = function () {
    if (this.enabled) {
        return;
    }

    if (!this.isReady()) {
        return;
    }

    var type = this.selectType();
    if (type !== undefined) {
        this.setType(type);

        this.enable();
    } else {
        this.disable();
    }
};

FlyingAd.prototype.isClickAvailable = function () {
    if (!this.enabled) {
        return false;
    }

    if (Game.currentGame && Game.currentGame.counter.isActive()) {
        return false;
    }

    return true;
};

FlyingAd.prototype.onClick = function () {
    if (this.isClickAvailable()) {
        this.playAds();
    }
};

FlyingAd.prototype.selectType = function () {
    if (cleverapps.config.debugMode && FlyingAd.DEBUG_TYPE !== undefined) {
        var debugType = FlyingAd.DEBUG_TYPE;
        delete FlyingAd.DEBUG_TYPE;

        return debugType;
    }

    var availableTypes = cleverapps.values(FlyingAd.TYPES).filter(function (type) {
        return FlyingAd.DATA[type] && cleverapps.adsLimits.state(FlyingAd.DATA[type].limit) === AdsLimits.STATE_READY && FlyingAd.DATA[type].filter();
    });

    return cleverapps.Random.mathChoose(availableTypes);
};

FlyingAd.prototype.setType = function (type) {
    if (this.type === type) {
        return;
    }

    this.type = type;

    this.trigger("changeType");
};

FlyingAd.prototype.playAds = function () {
    var data = FlyingAd.DATA[this.type];

    cleverapps.rewardedAdsManager.loadAndPlay({
        type: RewardedAdsManager.REWARDED,
        adLimit: data.limit,
        callback: function () {
            cleverapps.adsLimits.watch(data.limit);

            this.reward();
        }.bind(this)
    });

    this.clearTimeout();

    this.setDelay(cleverapps.parseInterval(FlyingAd.COOLDOWN));

    this.enabled = false;

    this.trigger("disappear");
};

FlyingAd.prototype.enable = function () {
    if (this.enabled) {
        return;
    }

    if (cleverapps.meta.isFocused()) {
        return;
    }

    this.enabled = true;

    if (cleverapps.environment.isGameScene()) {
        this.timeout = cleverapps.timeouts.setTimeout(function () {
            this.setDelay(cleverapps.parseInterval(FlyingAd.DIDNT_CLICK_COOLDOWN));

            this.clearTimeout();

            this.enabled = false;

            this.trigger("disappear");
        }.bind(this), cleverapps.parseInterval(FlyingAd.DURATION));
    }

    this.trigger("enable");
};

FlyingAd.prototype.disable = function () {
    if (!this.enabled) {
        return;
    }

    this.clearTimeout();

    this.enabled = false;

    this.trigger("disable");
};

FlyingAd.prototype.clearTimeout = function () {
    if (this.timeout) {
        clearTimeout(this.timeout);
        delete this.timeout;
    }
};

FlyingAd.prototype.giveHint = function () {
    var boosters = {};
    boosters[cleverapps.Boosters.TYPE_HINT] = 1;

    this.rewardProcess({
        boosters: boosters
    }, function () {
        cleverapps.timeouts.setTimeout(function () {
            cleverapps.boosters.take(cleverapps.Boosters.TYPE_HINT);

            if (Game.currentGame && Game.currentGame.outcome === GameBase.OUTCOME_UNKNOWN) {
                var hint = Game.currentGame.hintBooster.findHint();
                if (hint) {
                    Game.currentGame.hintBooster.addHint(hint);
                }
            }
        }, 300);
    });
};

FlyingAd.prototype.giveCombo = function () {
    var boosters = {};
    boosters[cleverapps.Boosters.TYPE_COMBO] = 1;

    this.rewardProcess({
        boosters: boosters
    }, function () {
        cleverapps.boosters.take(cleverapps.Boosters.TYPE_COMBO);

        if (Game.currentGame) {
            Game.currentGame.field.addRandomCombo(1);
        }
    }, "field");
};

FlyingAd.prototype.giveDiscover = function () {
    var boosters = {};
    boosters[cleverapps.Boosters.TYPE_DISCOVER] = 1;

    this.rewardProcess({
        boosters: boosters
    }, function () {
        cleverapps.timeouts.setTimeout(function () {
            cleverapps.boosters.take(cleverapps.Boosters.TYPE_DISCOVER);

            if (Game.currentGame) {
                Game.currentGame.boosterDiscover();
            }
        }, 300);
    });
};

FlyingAd.prototype.giveCards = function () {
    var amount = 2;

    this.rewardProcess({
        cards: amount
    });
};

FlyingAd.prototype.giveStar = function () {
    this.rewardProcess({
        simpleStar: 1
    });
};

FlyingAd.prototype.giveMoves = function () {
    var boosters = {};
    boosters[cleverapps.Boosters.TYPE_MOVES] = 1;

    this.rewardProcess({
        boosters: boosters
    }, function () {
        cleverapps.boosters.take(cleverapps.Boosters.TYPE_MOVES);

        if (Game.currentGame) {
            Game.currentGame.setMoves(Game.currentGame.moves + 3, {
                delay: 0
            });
        }
    }, "moves");
};

FlyingAd.prototype.giveSoftHardReward = function () {
    var type = cleverapps.config.soft ? "soft" : "hard";
    var reward = {};
    reward[type] = 10;
    this.rewardProcess(reward);
};

FlyingAd.prototype.rewardProcess = function (reward, finalAction, target) {
    cleverapps.meta.displayWhenFreeFocus({
        focus: "FlyingAdReward",
        action: function (f) {
            new RewardWindow(reward, {
                event: cleverapps.EVENTS.EARN.FLYING,
                target: target,
                onFinish: finalAction
            });
            cleverapps.meta.onceNoWindowsListener = f;
        }
    });
};

FlyingAd.prototype.reward = function () {
    if (this.type === FlyingAd.TYPES.TYPE_STAR) {
        this.giveStar();
    } else if (this.type === FlyingAd.TYPES.TYPE_HINT) {
        this.giveHint();
    } else if (this.type === FlyingAd.TYPES.TYPE_COMBO) {
        this.giveCombo();
    } else if (this.type === FlyingAd.TYPES.TYPE_DISCOVER) {
        this.giveDiscover();
    } else if (this.type === FlyingAd.TYPES.TYPE_CARDS) {
        this.giveCards();
    } else if (this.type === FlyingAd.TYPES.TYPE_MOVES) {
        this.giveMoves();
    } else if (this.type === FlyingAd.TYPES.TYPE_HARD_SOFT) {
        this.giveSoftHardReward();
    } else if (this.type === undefined) {
        cleverapps.throwAsync("flyingad reward is undefined");
    }
};

FlyingAd.IsAvailable = function () {
    return ["merge"].indexOf(cleverapps.config.type) === -1 && !cleverapps.config.wysiwygMode;
};

FlyingAd.COOLDOWN = "15 seconds";
FlyingAd.GAMESCENE_DELAY = "1 minute";
FlyingAd.DURATION = "45 seconds";
FlyingAd.DIDNT_CLICK_COOLDOWN = "1 minutes";

if (cleverapps.config.debugMode) {
    FlyingAd.DIDNT_CLICK_COOLDOWN = "30 seconds";
}

FlyingAd.TYPES = {
    TYPE_HINT: 0,
    TYPE_STAR: 1,
    TYPE_COMBO: 3,
    TYPE_DISCOVER: 4,
    TYPE_CARDS: 5,
    TYPE_HARD_SOFT: 7,
    TYPE_MOVES: 8
};

FlyingAd.DATA = {};
FlyingAd.DATA[FlyingAd.TYPES.TYPE_HINT] = {
    limit: AdsLimits.TYPES.FLYING_HINT,
    skin: "hint",
    filter: function () {
        return cleverapps.environment.isGameScene();
    }
};
FlyingAd.DATA[FlyingAd.TYPES.TYPE_STAR] = {
    limit: AdsLimits.TYPES.FLYING_STAR,
    skin: "star",
    filter: function () {
        return cleverapps.environment.isMainScene();
    }
};
FlyingAd.DATA[FlyingAd.TYPES.TYPE_COMBO] = {
    limit: AdsLimits.TYPES.FLYING_BOOSTER,
    skin: "heroes",
    filter: function () {
        var game = Game.currentGame;

        return cleverapps.environment.isGameScene() && game && game.beginMoves - game.moves >= 3;
    }
};
FlyingAd.DATA[FlyingAd.TYPES.TYPE_DISCOVER] = {
    limit: AdsLimits.TYPES.FLYING_DISCOVER,
    skin: "hint",
    filter: function () {
        var game = Game.currentGame;

        if (!cleverapps.environment.isGameScene() || !game || !game.discoverBooster) {
            return false;
        }
        if (game.inflamer.hasMistakes()) {
            return true;
        }
        return game.level.episodeNo >= 1 || game.level.levelNo >= 3;
    }
};
FlyingAd.DATA[FlyingAd.TYPES.TYPE_CARDS] = {
    limit: AdsLimits.TYPES.FLYING_MOVES,
    skin: "cards",
    filter: function () {
        return cleverapps.environment.isGameScene() && cleverapps.config.type === "solitaire";
    }
};

FlyingAd.DATA[FlyingAd.TYPES.TYPE_MOVES] = {
    limit: AdsLimits.TYPES.FLYING_MOVES,
    skin: "moves",
    filter: function () {
        var game = Game.currentGame;

        return cleverapps.environment.isGameScene()
            && cleverapps.config.type === "match3"
            && game && game.beginMoves - game.moves >= 3;
    }
};

FlyingAd.DATA[FlyingAd.TYPES.TYPE_HARD_SOFT] = {
    limit: AdsLimits.TYPES.FLYING_HARD_SOFT,
    skin: "coin",
    filter: function () {
        return cleverapps.environment.isMainScene();
    }
};
