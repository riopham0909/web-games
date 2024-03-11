/**
 * Created by mac on 3/2/21
 */

var FullscreenControlButton = {
    onClicked: function () {
        cleverapps.platform.toggleFullScreen();
    },

    isAvailableInEpisode: function () {
        if (cleverapps.config.wysiwygMode) {
            return false;
        }

        if (cleverapps.config.type === "battlefield" && Game.currentGame && Game.currentGame.mode === Epicart.MODE_BATTLE) {
            return false;
        }

        if (cleverapps.environment.hasScene([cleverapps.Environment.SCENE_CHAT, cleverapps.Environment.SCENE_MINE, cleverapps.Environment.SCENE_SLOT_MACHINE])) {
            return false;
        }

        return cleverapps.platform.isFullscreenAvailable();
    }
};
