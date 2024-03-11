/**
 * Created by vladislav on 03.03.2020
 */

var AnimatedCounterComponent = cc.Node.extend({
    ctor: function (options) {
        this._super();

        this.setAnchorPoint2();

        this.options = options;
        this.options.scale = this.options.scale || 1.3;
        this.options.onFinish = this.options.onFinish || function () {};
        this.options.time = this.options.time || 0.3;

        var diff = this.options.to - this.options.from;
        if (diff > 0) {
            this.increment = 1;
        } else if (diff === 0) {
            this.increment = 0;
        } else {
            this.increment = -1;
        }

        this.text = cleverapps.UI.generateTTFText(this.options.from, this.options.font);
        this.addChild(this.text);
        this.setContentSize2(this.text.getContentSize());
        this.text.setPositionRound(this.width / 2, this.height / 2);

        this.current = this.options.from;

        this.paused = false;
        this.started = false;
    },

    runAnimation: function () {
        this.started = true;

        this.current = this.options.from;

        if (this.paused) {
            return;
        }

        this._animateStep();
    },

    _animateStep: function () {
        if (this.paused || !this.started) {
            return;
        }

        if (this.current === this.options.to + this.increment) {
            this.options.onFinish();
            return;
        }

        this.text.runAction(new cc.Sequence(
            new cc.ScaleTo(this.options.time, this.options.scale),
            new cc.CallFunc(function () {
                this.text.setString(this.current);

                if (this.options.sfx) {
                    cleverapps.audio.playSound(bundles.main.urls['countdown_effect_' + this.current]);
                }
            }.bind(this)),
            new cc.ScaleTo(this.options.time, 1.0),
            new cc.DelayTime(this.options.time),
            new cc.CallFunc(function () {
                this.current += this.increment;
                this._animateStep();
            }.bind(this))
        ));
    }
});

cleverapps.styles.AnimatedCounterComponent = {

};