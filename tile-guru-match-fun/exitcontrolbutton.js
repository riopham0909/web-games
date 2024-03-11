/**
 * Created by mac on 3/2/21
 */

var ExitControlButton = {
    onClicked: function () {
        if (cleverapps.config.demoMode) {
            window.location.search = "";
        } else {
            cleverapps.scenes.getRunningScene().closeAction();
        }
    },

    isAvailableInEpisode: function () {
        if (cleverapps.environment.isMainScene()) {
            if (cleverapps.platform.oneOf(SPMobage, Mobage)) {
                return false;
            }

            return cleverapps.administrator && AdministratorScene.IsAvailable();
        }

        if (cleverapps.config.type === "battlefield" && Game.currentGame && Game.currentGame.mode === Epicart.MODE_BATTLE) {
            return false;
        }

        if (cleverapps.environment.hasScene([cleverapps.Environment.SCENE_ATLAS_ANALYZER]) || cleverapps.config.adminMode) {
            return true;
        }

        if (cleverapps.environment.hasScene([cleverapps.Environment.SCENE_CHAT])
            || (cleverapps.environment.isGameScene() && ["riddles", "heroes", "zenmatch"].indexOf(cleverapps.config.name) !== -1)) {
            return false;
        }

        return levels && levels.user && levels.user.checkAvailable(cleverapps.config.type === "merge" ? { level: 1 } : { level: 0.07 });
    }
};
