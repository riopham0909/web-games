/**
 * Created by mac on 3/11/23
 */

var NoneMainGameScene = GameSceneBase.extend({
    ctor: function (options) {
        options = options || {};

        if (!options.level) {
            options.level = new Episode(0).getLevel(0);
        }

        this._super(options);
    },

    onSceneLoaded: function () {
        this._super(cleverapps.Environment.SCENE_MAIN);
    },

    _closeAction: function () {
        MainScene.prototype._closeAction.call(this);
    }
});