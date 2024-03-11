/**
 * Created by vladislav on 1/30/19
 */

var DailyCupScene = cleverapps.FixedWidthScene.extend({
    onSceneLoaded: function () {
        this._super(cleverapps.Environment.SCENE_DAILY_CUP);
        cleverapps.environment.episodeNo = Episode.Types.DAILYCUP;

        var dailyCupView = new DailyCupView(cleverapps.dailyCup);
        this.addChild(dailyCupView);

        cleverapps.playSession.set(cleverapps.EVENTS.CUP_DAU + cleverapps.dailyCup.type, true);
        cleverapps.placements.run(Placements.INTERMEDIATE);
    },

    getBackgroundStyles: function () {
        return {
            bundle: "daily_cup",
            patternId: bundles.daily_cup.urls.daily_cup_pattern && "daily_cup_pattern",
            backgroundId: "daily_cup_bg"
        };
    },

    playIntro: function (f) {
        var wasShown = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.CUP_RULES + cleverapps.dailyCup.type);
        if (wasShown) {
            f();
            return;
        }

        new GuideWindow({ name: "DailyCupRulesWindow" });
        cleverapps.meta.onceNoWindowsListener = function () {
            cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.CUP_RULES + cleverapps.dailyCup.type, true);
            f();
        };
    },

    listBundles: function () {
        return ["daily_cup"];
    }
});
