/**
 * Created by andrey on 01.08.2022
 */

var SaveFinalResultsAction = function (f) {
    if (this.game.outcome === GameBase.OUTCOME_VICTORY && this.level.episode.isDailyCup()) {
        cleverapps.dailyCup.addAmount(this.game.getDailyCupStars());
        cleverapps.dailyCup.reload(true);
        cleverapps.playSession.set(cleverapps.EVENTS.CUP_PLAYERS + cleverapps.dailyCup.type, true);
        cleverapps.eventBus.trigger("taskEvent", DailyTasks.PASS_DAILY_CUP_LEVEL);
    }

    if (this.game.outcome === GameBase.OUTCOME_VICTORY && cleverapps.config.type === "match3") {
        if (!cleverapps.user.isPassedAll()) {
            var levelNo = this.level.getHumanReadableNumber();
            cleverapps.social.sendActivity(cleverapps.Social.ACTIVITY.LVL_PASSED, {
                userName: cleverapps.friends.getPlayer().name,
                score: this.game.score.getPoints(),
                levelNo: levelNo
            });
        }

        if (this.level.isRegular() && this.level.isNew() && cleverapps.exp.isAvailable() && !this.game.rewards[GameBase.REWARD_EXP]) {
            this.game.rewards[GameBase.REWARD_EXP] = this.level.isHard() ? GameBase.HARD_LEVEL_EXP_PRIZE : GameBase.EXP_PRIZE;
        }

        if (this.level.episode.isRegular() && this.level.isNew() || this.level.episode.isDailyCup()) {
            this.game.rewards.stars = this.game.score.stars;
        }

        if (this.level.isRegular()) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.LEVEL_STARS, {
                hash: this.level.hash,
                stars: this.game.score.stars
            });
        }
    }

    if (this.game.rewards[GameBase.REWARD_BOOSTERS]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.BOOSTER_CELL_RECEIVED);
    }

    f();
};