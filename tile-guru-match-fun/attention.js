/**
 * Created by decipaliz on 14.09.2022
 */

var Attention = cc.Sprite.extend({
    ctor: function () {
        this._super(bundles.attention.frames.attention_png);

        this.setAnchorPoint2();
        this.setLocalZOrder(2);
    },

    pulse: function () {
        if (this.baseScale === undefined) {
            this.baseScale = this.scale;
        }

        this.runAction(
            new cc.RepeatForever(
                new cc.Sequence(
                    new cc.ScaleTo(0.2, this.baseScale * 1.3).easing(cc.easeOut(2)),
                    new cc.ScaleTo(0.15, this.baseScale).easing(cc.easeIn(2)),
                    new cc.ScaleTo(0.2, this.baseScale * 1.2).easing(cc.easeOut(2)),
                    new cc.ScaleTo(0.15, this.baseScale).easing(cc.easeIn(2)),
                    new cc.DelayTime(3)
                )
            )
        );
    },

    jump: function () {
        if (this.baseScale === undefined) {
            this.baseScale = this.scale;
        }

        this.runAction(
            new cc.Repeat(
                new cc.Sequence(
                    new cc.ScaleTo(0.4, this.baseScale * 1.15).easing(cc.easeOut(2)),
                    new cc.ScaleTo(0.3, this.baseScale).easing(cc.easeIn(2))
                ),
                3
            )
        );
    }
});