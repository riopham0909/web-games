/**
 * Created by mac on 3/2/21
 */

var MenuControlButton = {
    onClicked: function () {
        cleverapps.meta.display({
            focus: "SettingsWindowFromMenu",
            action: function (f) {
                new SettingsWindow();
                cleverapps.meta.onceNoWindowsListener = f;
            }
        });
    },

    isAvailableInEpisode: function () {
        if (cleverapps.config.type === "battlefield" && Game.currentGame && Game.currentGame.mode === Epicart.MODE_BATTLE) {
            return false;
        }

        if (cleverapps.environment.hasScene([cleverapps.Environment.SCENE_EDITOR, cleverapps.Environment.SCENE_CHAT, cleverapps.Environment.SCENE_MINE])) {
            return false;
        }

        return true;
    },

    onUpdateAttention: function () {},

    updateAttention: function () {
        this.onUpdateAttention(cleverapps.chat.hasUnread && (cleverapps.config.type === "merge" || !Game.currentGame));
    }
};
