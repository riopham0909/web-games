/**
 * Created by razial on 19.01.2023
 */

cc.AnimateDelta = cc.CallFunc.extend({
    ctor: function (target, amount, options) {
        options = Object.assign({
            parent: target,
            font: cleverapps.styles.FONTS.SCENE_ANIMATE_DELTA_TEXT
        }, options);

        this._super(function () {
            if (!target.isRunning() || !amount) {
                return;
            }

            cleverapps.UI.animateDelta(amount, options);
        });
    }
});