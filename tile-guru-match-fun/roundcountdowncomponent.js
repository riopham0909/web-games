/**
 * Created by vladislav on 03.03.2020
 */

var RoundCountdownComponent = cc.Node.extend({
    ctor: function (callback) {
        this._super();

        this.text = cleverapps.UI.generateTTFText("RoundCountdownComponent.text", cleverapps.styles.FONTS.WHITE_TEXT);
        this.addChild(this.text);

        this.countdown = new AnimatedCounterComponent({
            from: 3,
            to: 1,
            font: cleverapps.styles.FONTS.WHITE_TEXT,
            scale: 1.5,
            sfx: true,
            onFinish: function () {
                callback();
                this.countdown.setVisible(false);
            }.bind(this)
        });
        this.addChild(this.countdown);

        cleverapps.UI.wrap(this);
        cleverapps.UI.wrapWithPadding(this, cleverapps.styles.RoundCountdownComponent.padding, true);
    },

    showUp: function () {
        this.text.setVisible(false);
        this.countdown.setVisible(false);

        this.runAction(new cc.Sequence(
            new cc.DelayTime(3),
            new cc.CallFunc(function () {
                this.text.setVisible(true);
            }.bind(this)),
            new cc.DelayTime(1.5),
            new cc.CallFunc(function () {
                this.text.setVisible(false);

                this.countdown.setVisible(true);

                this.countdown.runAnimation();
            }.bind(this))
        ));
    }
});

cleverapps.styles.RoundCountdownComponent = {
    padding: {
        bottom: 30
    }
};