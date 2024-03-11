/**
 * Created by Denis Kuzin on 27 july 2022
 */

cc.CollectEffect = cc.CallFunc.extend({
    ctor: function (target) {
        var scaleX = target.baseScaleX || target.baseScale || 1;
        var scaleY = target.baseScaleY || target.baseScale || 1;

        this._super(function () {
            if (!target.isRunning()) {
                return;
            }

            target.runAction(new cc.Sequence(
                new cc.ScaleTo(0.15, scaleX * 1.1, scaleY * 1.1).easing(cc.easeOut(2)),
                new cc.ScaleTo(0.15, scaleX, scaleY).easing(cc.easeInOut(2))
            ));
        });
    }
});

cleverapps.styles.CollectEffect = {
    sparks: {
        x: -7,
        y: 5
    }
};