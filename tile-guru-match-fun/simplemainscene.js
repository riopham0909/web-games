/**
 * Created by andrey on 19.11.19.
 */

var SimpleMainScene = MainScene.extend({
    onSceneLoaded: function () {
        this._super();

        this.progress = new ProgressView();
        this.addChild(this.progress);

        var playButton = this.playButton = new PlayButtonView();
        this.addChild(playButton, 1);
        playButton.addFinger();

        if (cleverapps.knockoutTutorial) {
            cleverapps.knockoutTutorial.onPlayButtonForceListener = this.createListener(this.showPlayButtonForce.bind(this));
        }
    },

    showPlayButtonForce: function (f) {
        if (cleverapps.forces.isAvailable(this.playButton, Forces.METHA_PLAY_BUTTON)) {
            cleverapps.forces.create(this.playButton, Forces.METHA_PLAY_BUTTON);
            cleverapps.forces.onceForceClosed = f;
        } else {
            f();
        }
    },

    getBackgroundStyles: function () {
        var bundleName = cleverapps.simple.getBackgroundBundle(cleverapps.simple.getCurrent());
        return {
            bundle: bundleName,
            backgroundId: "background"
        };
    },

    listBundles: function () {
        return cleverapps.simple.getBundles(cleverapps.simple.current);
    }
});
