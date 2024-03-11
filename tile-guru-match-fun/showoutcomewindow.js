/**
 * Created by andrey on 02.08.2022
 */

var ShowOutcomeWindow = function (f) {
    var outcome = this.game.outcome;

    if (outcome === GameBase.OUTCOME_GAVEUP) {
        f();
    } else if (this.level.episode.isBonusRound()) {
        ShowBonusRoundWindow.call(this, f);
    } else if (outcome === GameBase.OUTCOME_LOST && cleverapps.config.type !== "battlefield") {
        ShowLoseWindow.call(this, f);
    } else {
        ShowVictoryWindow.call(this, f);
    }
};

var ShowVictoryWindow = function (f) {
    new VictoryWindow(this.game, this.boatswain);
    cleverapps.meta.onceNoWindowsListener = f;
};

var ShowBonusRoundWindow = function (f) {
    new BonusRoundWindow(this.game);
    cleverapps.meta.onceNoWindowsListener = f;
};

var ShowLoseWindow = function (f) {
    cleverapps.meta.compound(f, [
        function (f) {
            if (cleverapps.isRumble() && cleverapps.config.name !== "differences") {
                new BeforeLoseWindow(this.game);
                cleverapps.meta.onceNoWindowsListener = f;
            } else {
                f();
            }
        }.bind(this),

        function (f) {
            new LoseWindow(this.game, this.boatswain);
            cleverapps.meta.onceNoWindowsListener = f;
        }.bind(this)
    ]);
};