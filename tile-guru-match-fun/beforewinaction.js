/**
 * Created by andrey on 02.08.2022
 */

var BeforeWinAction = function () {
    cleverapps.placements.run(Placements.AFTER_GAME_FINISH);

    var outcome = this.game.outcome;
    this.giveLife();

    if (this.controlsPanel) {
        this.controlsPanel.hide();
    }

    if (this.level.isRegular() && cleverapps.isKnockoutGame()) {
        cleverapps.meta.getRumble().moveNextRound(outcome);
    }

    if (cleverapps.config.type !== "solitaire") {
        this.game.addBasicReward();
    }

    if (this.level.isRegular()) {
        cleverapps.meta.getMainObject().gamePlayed(outcome, this.game);
    }

    if (cleverapps.meta.focus === "KeypadControl") {
        this.game.keypad.reset();
    }

    if (outcome === GameBase.OUTCOME_GAVEUP) {
        BeforeWinGaveUpAction.call(this);
    } else if (outcome === GameBase.OUTCOME_VICTORY) {
        BeforeWinVictoryAction.call(this);
    } else if (outcome === GameBase.OUTCOME_LOST) {
        BeforeWinLoseAction.call(this);
    }
};

var BeforeWinVictoryAction = function () {
    if (this.game.timer) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.LEVEL_PASSED_TIME, {
            hash: this.level.hash,
            passedTime: this.game.timer.getTime()
        });
    }

    var lantern = Lantern.Get();
    if (lantern && lantern.isActive(this.level)) {
        lantern.onWin();
    }

    if (this.level.isRegular() || this.level.episode.isBonusWorldLevel()) {
        if (this.game.leftMoves !== undefined) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.LEVEL_LEFT_MOVES, {
                hash: this.level.hash,
                leftMoves: this.game.leftMoves
            });
        }

        var levelFinish = true;
        if (cleverapps.config.type === "board" && this.game.timer) {
            levelFinish = this.game.timer.getTime() <= cleverapps.parseInterval("5 minutes");
        }
        if (levelFinish) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.LEVEL_FINISH, {
                hash: this.level.hash
            });
        }

        if (this.level.isNew() || this.level.episode.isBonusWorldLevel()) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.UNIQUE_FINISH, {
                hash: this.level.hash
            });
        }
    }

    var isCurrentLevelOld = this.level.isCurrentLevel();

    this.boatswain.level = this.level = Object.assign(cleverapps.clone(this.level), {
        isCurrentLevel: function () {
            return isCurrentLevelOld;
        }
    });

    if (this.level.episode.isDailyLevel()) {
        cleverapps.dailyLevel.onWin(this.level);
    }

    if (this.level.episode.isBonusWorldLevel()) {
        cleverapps.missionManager.dispatchEvent(Mission.TYPE_BONUS_WORLD, { level: this.level });
    }

    cleverapps.missionManager.refreshTeaser();

    if (cleverapps.config.type === "board") {
        BeforeWinVictoryWordAction.call(this);
    }

    this.game.eraseSave();
};

var BeforeWinVictoryWordAction = function () {
    levels.gameHints.reset();

    if (this.level.isCurrentLevel()) {
        if (this.game.tournament) {
            var place = this.game.competition.calcPlace() + 1;
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.TOURNAMENT_LEVEL_PLACE + "_" + place);
        }
    }

    this.game.updateRewards();

    if (this.game.competition && this.game.rewards[GameBase.REWARD_PRIMARY]) {
        this.game.competition.onAnimateResults(this.game.rewards[GameBase.REWARD_PRIMARY]);
    }
};

var BeforeWinLoseAction = function () {
    var lantern = Lantern.Get();
    if (lantern && lantern.isActive(this.level)) {
        lantern.onLose();
    }

    this.takeLife();
    this.game.eraseSave();
};

var BeforeWinGaveUpAction = function () {
    var lantern = Lantern.Get();
    if (lantern && lantern.isActive(this.level)) {
        lantern.restoreSavedStreak();
    }
};
