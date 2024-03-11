/**
 * Created by andrey on 02.08.2022
 */

var PurgeOldGameAction = function (f) {
    if (this.game && !this.game.stopped) {
        cleverapps.throwAsync("purgeOldGame active game");
    }

    Game.currentGame = undefined;
    this.game = undefined;

    f();
};