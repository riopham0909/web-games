/**
 * Created by andrey on 24.07.2020
 */

var BoosterBeforeBonusView = cc.Sprite.extend({
    ctor: function () {
        this._super(bundles.boosters_before.frames.booster_before_green_button_png);

        this.icon = new cc.Sprite(bundles.boosters_before.frames.booster_before_lantern_icon_png);
        this.icon.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(this.icon);
    },

    lanternAnimation: function () {
        this.scale = 0;
        this.runAction(new cc.Sequence(
            new cc.DelayTime(1.1),
            new cc.ScaleTo(0.2, 1, 1)
        ));
    }
});
