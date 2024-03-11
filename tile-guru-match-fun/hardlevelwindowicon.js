/**
 * Created by decipaliz on 02.08.22.
 */

var HardLevelWindowIcon = cc.Sprite.extend({
    ctor: function () {
        this._super(bundles.hard_level_icon.frames.hard_level_icon);

        var styles = cleverapps.styles.HardLevelWindowIcon;
        if (styles.rotation) {
            this.setRotation(styles.rotation);
        }
    },

    pulseAnimation: function () {
        this.stopAllActions();
        this.setScale(0.1);
        this.setVisible(false);
        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.4),
            new cc.CallFunc(function () {
                this.setVisible(true);
            }.bind(this)),
            new cc.ScaleTo(0.5, 1.1).easing(cc.easeBackOut()),
            new cc.CallFunc(function () {
                this.runAction(
                    new cc.RepeatForever(
                        new cc.Sequence(
                            new cc.ScaleTo(0.5, 0.9).easing(cc.easeIn(1)),
                            new cc.ScaleTo(0.5, 1.1)
                        )
                    )
                );
            }.bind(this))
        ));
    }
});

cleverapps.styles.HardLevelWindowIcon = {
    rotation: -18
};