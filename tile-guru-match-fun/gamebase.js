/**
 * Created by andrey on 10.08.18.
 */

var GameBase = function (level, options) {
    cleverapps.EventEmitter.call(this);

    Game.currentGame = this;

    this.levelContent = level.content;
    this.level = level;
    this.options = options || {};

    this.slot = cleverapps.GameSaver.getStoreSlot(this.level.episodeNo, this.level.levelNo);
    this.savedGame = this.loadSave();

    this.score = new Score(this.savedGame.score);
    this.moves = this.savedGame.moves || 0;
    this.timer = new GameTimer(this);
    this.counter = new Counter();
    this.boostersBefore = this.options.boostersBefore || [];

    if (this.level.isRegular() && this.level.isNew()) {
        this.primaryMission = cleverapps.missionManager.findRunningMission([Mission.TYPE_TREASURE_SEARCH, Mission.TYPE_STICKERS_COLLECTION, Mission.TYPE_SLOT_MACHINE, Mission.TYPE_LEVELPASS]);
    }

    if (this.level.isRegular() && this.level.isNew() && cleverapps.config.type !== "merge") {
        this.secondaryMission = cleverapps.missionManager.findRunningMission([Mission.TYPE_COMBO, Mission.TYPE_COLLECT_MARK, Mission.TYPE_BURN_NEARBY, Mission.TYPE_LETTER]);
    }

    this.userStatus = new UserStatus();

    this.rewards = {};

    if (this.secondaryMission) {
        this.rewards[GameBase.REWARD_SECONDARY] = 0;
    }

    if (this.primaryMission) {
        var rewardData = this.primaryMission.getLevelReward();
        var missionReward = rewardData[0];
        if (this.level.isHard()) {
            missionReward = rewardData[1];
        }
        if (this.level.isTricky()) {
            missionReward = rewardData[2];
        }
        this.rewards[GameBase.REWARD_PRIMARY] = missionReward;
    }

    if (cleverapps.piggyBank && cleverapps.piggyBank.isActive() && !cleverapps.piggyBank.isFull()) {
        this.rewards[GameBase.REWARD_PIGGY_BANK] = cleverapps.piggyBank.getAddAmount();
    }

    if (this.level.isRegular() && this.level.isNew() && cleverapps.exp.isAvailable()) {
        this.rewards[GameBase.REWARD_EXP] = this.level.isHard() ? GameBase.HARD_LEVEL_EXP_PRIZE : GameBase.EXP_PRIZE;
    }

    this.setBasicReward();

    this.rewards[GameBase.REWARD_HARD] = 0;

    if (this.level.episode.isBonusRound()) {
        this.rewards[GameBase.REWARD_HARD] = cleverapps.BonusRoundChest.REWARD;
    }

    var lantern = Lantern.Get();
    if (lantern && lantern.isActive(this.level)) {
        this.rewards.lantern = lantern.savedStreak >= Lantern.getMaxStreak() ? 0 : 1;
        lantern.onStart();
    }

    if (this.savedGame.rewards) {
        this.rewards = cleverapps.override(this.rewards, this.savedGame.rewards);
    }

    if (this.levelWithTutorial() && cleverapps.config.type !== "merge") {
        cleverapps.Random.seed(this.level.getHumanReadableNumber() - 1);
    } else {
        cleverapps.Random.randomSeed();
    }

    this.outcome = GameBase.OUTCOME_UNKNOWN;

    if (cleverapps.flyingAd) {
        cleverapps.flyingAd.setGame(this);
    }

    this.counter.turnOff();
    if (cleverapps.config.type !== "merge") {
        this.counter.registerStage(-1, this.begin.bind(this));
    }

    if (typeof Prolongation !== "undefined") {
        this.prolongation = new Prolongation();
    }
};

GameBase.prototype = Object.create(cleverapps.EventEmitter.prototype);
GameBase.prototype.constructor = GameBase;

GameBase.prototype.levelWithTutorial = function () {
    if (cleverapps.config.editorMode) {
        return false;
    }

    if (cleverapps.config.type === "blocks") {
        return BlocksTutorial.isAvailable() || this.savedGame.tutorial && this.savedGame.tutorial.step !== undefined;
    }

    if (cleverapps.config.type === "match3") {
        if (this.levelContent.tutorial) {
            if (this.level.episode.isBonusWorldLevel()) {
                return true;
            }

            if (cleverapps.user.isPassedAll() && this.level.isPassedLevel()) {
                return false;
            }

            if (this.level.isCurrentLevel()) {
                return true;
            }
        }
        return false;
    }

    if (cleverapps.config.type === "tile3" || cleverapps.config.type === "solitaire") {
        return TilesTutorial.IsAvailable(this.level);
    }

    if (cleverapps.config.type === "board") {
        return levels.user.episode === 0 && levels.user.level === 0 && this.level.isCurrentLevel() && !cleverapps.isKnockoutGame();
    }

    if (cleverapps.config.type === "merge") {
        return true;
    }
};

GameBase.prototype.displayTutorial = function (f) {
    f();
};

GameBase.prototype.hasBegan = function () {
    if (["battlefield"].includes(cleverapps.config.type)) {
        return true;
    }
    if (cleverapps.config.type === "match3") {
        return this.beginMoves !== this.moves;
    }
    if (["tile3", "klondike", "solitaire"].includes(cleverapps.config.type) && Boolean(this.move)) {
        return true;
    }

    return this.moves > 0 || this.getPercentOfCompletion() > 0;
};

GameBase.prototype.begin = function (force) {
    if (!this.began && (this.hasBegan() || force)) {
        this.began = true;

        if (this.level.isRegular() || this.level.episode.isBonusWorldLevel()) {
            if (levels.user.isUniqueStart(this.level.episodeNo, this.level.levelNo, this.level.content.version)) {
                this._churnActivated();
            }
        }
    }
};

GameBase.prototype.setBasicReward = function () {
    this.basicReward = 0;
    if (![Metha.HOMEFIX, Metha.SIMPLE, Metha.SHORTMETA, Metha.HOSE, Metha.FARM].includes(cleverapps.meta.getType())) {
        return;
    }
    if (cleverapps.config.type === "battlefield") {
        return;
    }
    if (this.rewards[GameBase.REWARD_EXP]) {
        return;
    }

    if (this.level.isCurrentLevel() || this.level.episode.isDailyCup() || this.level.episode.isDailyLevel() || this.level.episode.isAdsLevel()
        || this.level.episode.isBonusWorldLevel() || cleverapps.config.editorMode || cleverapps.config.wysiwygMode) {
        this.basicReward = 10;
        if (this.level.isTricky()) {
            this.basicReward = 20;
        }
        if (this.level.isHard()) {
            this.basicReward = 30;
        }
    }
};

GameBase.prototype.addBasicReward = function () {
    var currency = cleverapps.config.soft ? GameBase.REWARD_SOFT : GameBase.REWARD_HARD;

    if (currency === GameBase.REWARD_HARD) {
        this.addHardReward(this.basicReward);
    } else {
        this.addSoftReward(this.basicReward);
    }
};

GameBase.prototype.showStartGameMessage = function (f) {
    if (this.level.isHard()) {
        cleverapps.gameMessage.showMessage("message.hardLevel", { callback: f });
    } else {
        f();
    }
};

GameBase.prototype._churnActivated = function () {
    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.UNIQUE_START, {
        hash: this.level.hash
    });
};

GameBase.prototype.setTimeout = function (callback, timeout) {
    return setTimeout(function () {
        if (this.stopped) {
            return;
        }

        callback();
    }.bind(this), timeout);
};

GameBase.prototype.getInfo = function () {
    return {
        rewards: this.rewards
    };
};

GameBase.prototype.getInitialInfo = function () {
    return {};
};

GameBase.prototype.storeSave = function () {
    if (this.slot !== undefined) {
        var info = this.getInfo();
        console.log("storeSave");
        console.log(info);

        cleverapps.GameSaver.saveInfo(this.slot, info);
    }
};

GameBase.prototype.eraseSave = function () {
    cleverapps.GameSaver.removeSave(this.slot);
};

GameBase.prototype.loadSave = function () {
    if (this.slot !== undefined) {
        var stored = cleverapps.GameSaver.load(this.slot) || {};

        if (Object.keys(stored).length > 0) {
            return stored;
        }
    }

    return this.getInitialInfo();
};

GameBase.prototype.getDailyCupStars = function () {
    return 1;
};

GameBase.prototype.initPool = function () {

};

GameBase.prototype.stop = function () {
    this.counter.turnOff();
    this.timer.stop();
    levels.FPS.stop();

    runCleaners(this);

    this.userStatus.destructor();
    cleverapps.menuBar.stopItems();
    cleverapps.exclamation.remove();

    this.stopped = true;
    this.trigger("stop");
};

GameBase.prototype.animateBeforeWin = function (f) {
    f();
};

GameBase.prototype.needTapToSkip = function () {
};

GameBase.prototype.needAnimateBonus = function () {
    return false;
};

GameBase.prototype.animateBonus = function (f) {
    f();
};

GameBase.prototype.leave = function (f) {
    if (this.outcome !== GameBase.OUTCOME_UNKNOWN) {
        f();
        return;
    }

    if (this.stillNoPenalty()) {
        f();
        this.giveUp();
        return;
    }

    if (this.level.isBonus() && this.level.isNew()) {
        f();
        this.win();
        return;
    }

    var confirmed = false;
    new ConfirmExitWindow({
        action: function () {
            confirmed = true;
        }
    });
    cleverapps.meta.onceNoWindowsListener = function () {
        f();

        if (confirmed) {
            if (cleverapps.highscore && Game.currentGame.isMemorableGame()) {
                this.win();
            } else {
                this.lose();
            }
        }
    }.bind(this);
};

GameBase.prototype.setOutcome = function (outcome) {
    if (this.outcome !== GameBase.OUTCOME_UNKNOWN) {
        return;
    }
    this.outcome = outcome;

    cleverapps.user.incProgressCompare(outcome === GameBase.OUTCOME_VICTORY ? 30 : 1);

    if (cleverapps.config.debugMode) {
        console.log("OUTCOME: " + outcome);
    }

    this.trigger("outcome", outcome);
};

GameBase.prototype.win = function () {
    this.setOutcome(GameBase.OUTCOME_VICTORY);
};

GameBase.prototype.lose = function () {
    this.setOutcome(GameBase.OUTCOME_LOST);
};

GameBase.prototype.giveUp = function () {
    this.setOutcome(GameBase.OUTCOME_GAVEUP);
};

GameBase.prototype.playIntro = function (f, silent) {
    var actions = this.listIntroActions();

    if (silent) {
        actions = actions.map(function (action) {
            return function (f) {
                action(f, silent);
            };
        });
    }

    this.introPlaying = true;

    cleverapps.meta.compound(function () {
        this.introPlaying = false;
        f();
        this.counter.trigger();
    }.bind(this), actions);
};

GameBase.prototype.turnOffCounter = function (f) {
    if (!cleverapps.config.editorMode) {
        this.counter.turnOn();
    }
    this.counter.inc();
    f();
};

GameBase.prototype.turnOnCounter = function (f) {
    this.counter.dec();
    this.userStatus.reportUserAction();
    f();
};

GameBase.prototype.listIntroActions = function () {
    return [
        this.turnOffCounter.bind(this),
        this.introZoom.bind(this),
        this.prepareBoosters.bind(this),
        this.showScreen.bind(this),
        this.updateRestoreProgress.bind(this),
        this.beforeGameStart.bind(this),
        this.showStartGameMessage.bind(this),
        this.turnOnCounter.bind(this),
        this.startTutorial.bind(this),
        this.showDailyLevelWindow.bind(this),
        this.executeBoostersBefore.bind(this),
        this.runFPS.bind(this)
    ];
};

GameBase.prototype.startTutorial = function (f) {
    if (this.levelWithTutorial()) {
        this.displayTutorial(f);
    } else {
        f();
    }
};

GameBase.prototype.introZoom = function (f, silent) {
    var scene = cleverapps.scenes.getRunningScene();
    var isStart = this.outcome === GameBase.OUTCOME_UNKNOWN;

    var duration = silent ? 0 : 0.8;
    var scale = isStart ? 1 : 1 / scene.introScale;

    if (scene.animateZoom) {
        scene.animateZoom(scale, duration, f);
        if (!silent && isStart) {
            cleverapps.audio.playSound(bundles.game.urls.openlevel_effect);
        }
    } else {
        f();
    }
};

GameBase.prototype.prepareBoosters = function (f) {
    for (var id in cleverapps.boosters.boosters) {
        cleverapps.boosters.boosters[id].onGameStarted();
    }
    f();
};

GameBase.prototype.showScreen = function (f) {
    f();
};

GameBase.prototype.updateRestoreProgress = function (f) {
    cleverapps.restoreProgress.update();
    f();
};

GameBase.prototype.beforeGameStart = function (f) {
    if (this.competition) {
        this.competition.start();
    }
    f();
};

GameBase.prototype.runFPS = function (f) {
    if (this.level.isRegular()) {
        levels.FPS.run(this.level.episodeNo, this.level.levelNo);
    }

    f();
};

GameBase.prototype.showDailyLevelWindow = function (f) {
    if (cleverapps.config.wysiwygMode || !cleverapps.config.features.includes("dailylevel") || DailyLevelWindow.shown || !this.level.episode.isDailyLevel()
        || !["olympics", "crocword", "tripeaks", "spades"].includes(cleverapps.config.name)) {
        f();
        return;
    }

    DailyLevelWindow.shown = true;

    new DailyLevelWindow();
    cleverapps.meta.onceNoWindowsListener = f;
};

GameBase.EXP_PRIZE = 1;
GameBase.HARD_LEVEL_EXP_PRIZE = 3;

GameBase.REWARD_PRIMARY = "background_clover";
GameBase.REWARD_SECONDARY = "clover";
GameBase.REWARD_PIGGY_BANK = "piggyBank";
GameBase.REWARD_EXP = "exp";
GameBase.REWARD_HARD = "hard";
GameBase.REWARD_BOOSTERS = "boosters";
GameBase.REWARD_SOFT = "soft";

GameBase.OUTCOME_UNKNOWN = undefined;
GameBase.OUTCOME_VICTORY = 1;
GameBase.OUTCOME_LOST = 2;
GameBase.OUTCOME_GAVEUP = 3;

GameBase.prototype.stillNoPenalty = function () {
    if (cleverapps.isRumble()) {
        return false;
    }
    if (this.outcome !== GameBase.OUTCOME_UNKNOWN) {
        return false;
    }
    if (this.level.episode.isBonusRound()) {
        return false;
    }
    if (["board", "battlefield"].includes(cleverapps.config.type)) {
        return true;
    }
    if (cleverapps.config.type === "match3" && this.originalMoves === -1) {
        return true;
    }

    return !this.hasBegan();
};

GameBase.prototype.getMissionType = function () {
    if (this.secondaryMission) {
        return this.secondaryMission.type;
    }

    return undefined;
};

GameBase.prototype.addClover = function (missionType, amount, silent) {
    if (this.getMissionType() === missionType) {
        this.rewards[GameBase.REWARD_SECONDARY] = (this.rewards[GameBase.REWARD_SECONDARY] || 0) + amount;
        if (!silent) {
            this.trigger("rewardClover");
        }
    }
};

GameBase.prototype.addHardReward = function (amount, silent) {
    this.rewards[GameBase.REWARD_HARD] = (this.rewards[GameBase.REWARD_HARD] || 0) + amount;
    if (!silent) {
        this.trigger("rewardHard", amount);
    }
};

GameBase.prototype.addSoftReward = function (amount, options) {
    this.rewards[GameBase.REWARD_SOFT] = (this.rewards[GameBase.REWARD_SOFT] || 0) + amount;

    this.trigger("rewardSoft", amount, options);
};

GameBase.prototype.executeBoostersBefore = function (f, silent) {
    if (silent) {
        f();
        return;
    }

    cleverapps.meta.compound(f, this.boostersBefore.map(function (booster) {
        return function (f) {
            booster.execute();

            var duration = booster.getExecuteDuration();

            if (duration === 0) {
                f();
            } else {
                Game.currentGame.counter.setTimeout(f, duration * 1000);
            }
        };
    }));
};

GameBase.prototype.getPercentOfCompletion = function () {
    return 0;
};

GameBase.LEVEL_WITH_COINS_AVAILABLE = {
    level: 0.93
};
