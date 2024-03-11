/**
 * Created by andrey on 19.11.19.
 */

var MainScene = cleverapps.FixedWidthScene.extend({
    onSceneLoaded: function () {
        this._super(cleverapps.Environment.SCENE_MAIN);

        if (cleverapps.flyingAd) {
            this.addChild(new FlyingAdView());
        }

        cleverapps.environment.levelNo = levels.user.level;
        cleverapps.environment.episodeNo = levels.user.episode;

        cleverapps.placements.run(Placements.INTERMEDIATE);
    },

    _closeAction: function () {
        if (cleverapps.administrator && AdministratorScene.IsAvailable()) {
            cleverapps.flags.norest = false;
            cleverapps.DataLoader.setAlerted(false);
            cleverapps.DataLoader.setEnabled(true);
            cleverapps.setRestDummies(false);
            AdministratorScene.open();
            return;
        }

        if (cleverapps.config.wysiwygMode) {
            cleverapps.config.editorMode = false;
            WysiwygScene.open(cleverapps.wysiwyg);
            return;
        }

        if (cleverapps.platform.closeApplication) {
            cleverapps.meta.display({
                focus: "ConfirmExitWindow",
                action: function (f) {
                    new ConfirmExitWindow({
                        action: cleverapps.platform.closeApplication.bind(cleverapps.platform)
                    });

                    cleverapps.meta.onceNoWindowsListener = f;
                }
            });
        }
    }
});