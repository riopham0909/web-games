/**
 * Created by andrey on 01.08.2022
 */

var VictoryMessageAction = function (f) {
    if (Game.currentGame.outcome !== GameBase.OUTCOME_VICTORY || cleverapps.config.type === "blocks") {
        f();
        return;
    }

    cleverapps.audio.playSound(bundles.main.urls.congratulate_sfx);

    if (["heroes", "runes", "adventure"].includes(cleverapps.config.name)) {
        cleverapps.exclamation.show("message.YouWin", Exclamation.Types.Congrats);
        Game.currentGame.counter.setTimeout(f, 1200);
        return;
    }

    Game.currentGame.counter.inc();

    cleverapps.gameMessage.showMessage("GameMessage.Victory", {
        json: bundles.gamemessage.jsons.game_message_victory_json,
        direction: GameMessageView.DIRECTION_TOP_DOWN,
        rays: true,
        callbackDelay: 0.7,
        callback: function () {
            Game.currentGame.counter.dec();

            f();
        }
    });
};