/**
 * Created by razial on 30.01.2023
 */

cc.SpineAction = cc.CallFunc.extend({
    ctor: function (spine, animation, duration, callback) {
        var timeScale;

        var data = spine.getAnimationData(animation);
        if (!data) {
            cleverapps.throwAsync("no animation '" + animation + "' for json '" + spine.spine.jsonName + "'");
        }

        this._super(function () {
            spine.setAnimation(0, animation, false);

            if (duration && duration !== spine.getTimeLeft()) {
                timeScale = spine.getTimeScale();
                spine.setTimeScale(spine.getTimeLeft() / duration);
            }

            spine.setCompleteListener(function () {
                spine.setCompleteListener();

                if (timeScale) {
                    spine.setTimeScale(timeScale);
                }

                if (callback) {
                    callback();
                }
            });
        });
    }
});
