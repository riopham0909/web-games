/**
 * Created by vladislav on 29/03/2023
 */

var PauseControlButton = {
    onClicked: function () {
        Game.currentGame.pause();

        new PauseWindow();
    },

    isAvailableInEpisode: function () {
        return cleverapps.config.type === "battlefield"
            && Game.currentGame && Game.currentGame.mode === Epicart.MODE_BATTLE;
    }
};
