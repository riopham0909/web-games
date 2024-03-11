/**
 * Created by olga on 26.09.2023
 */

var CircleCountdown = cleverapps.Spine.extend({
    ctor: function (onComplete, offer) {
        this.onComplete = onComplete;
        this.withBomb = offer.type === Prolongation.TYPES.BOMB;
        var animation = this.withBomb ? bundles.prolongation_window.jsons.bomb_timer_json : bundles.prolongation_window.jsons.timer_json;
        this._super(animation);

        this.timeScale = 1;
        this.currentNum = 10;
        var font = this.withBomb ? cleverapps.styles.FONTS.CIRCLE_BOMB_COUNTDOWN_TEXT : cleverapps.styles.FONTS.CIRCLE_COUNTDOWN_TEXT;
        this.numberNode = cleverapps.UI.generateImageText("0", font);
        this.addChild(this.numberNode);
        this.numberNode.setPositionRound(this.width / 2, this.height / 2);

        this.isShown = false;
    },

    show: function () {
        this.isShown = true;
        if (cleverapps.settings.music) {
            cleverapps.settings.toggleMusic();
            this.toggledMusic = true;
        }
        this.setAnimation(0, "open", false);
        if (!this.withBomb) {
            cleverapps.audio.playSound(bundles.prolongation_window.urls.timer_start);
            this.numberNode.runAction(new cc.Sequence(
                new ImageFontCountTo(0.6, 10),
                new cc.ScaleTo(0.2, 1.3).easing(cc.easeOut(1)),
                new cc.ScaleTo(0.2, 1).easing(cc.easeOut(1))
            ));
        } else {
            this.numberNode.setString(this.currentNum.toString());
        }
        this.setCompleteListener(function () {
            this.isShown = true;
            this.setAnimation(0, "animation", false);
            this.setStartListener(function () {
                this.countDownAction();
            }.bind(this));
            this.setCompleteListener(this.onComplete);
        }.bind(this));
    },

    countDownAction: function () {
        this.numberNode.setString(this.currentNum.toString());

        var sound;
        if (this.currentNum > 0) {
            sound = this.withBomb ? "bomb_timer_tick" : "timer_tick";
        } else {
            sound = this.withBomb ? "bomb_timer_tick_zero" : "timer_tick_zero";
        }

        cleverapps.audio.playSound(bundles.prolongation_window.urls[sound]);

        if (!this.withBomb) {
            if (this.currentNum < 6 && this.currentNum > 3) {
                this.numberNode.setColor(cleverapps.styles.COLORS.ORANGE);
            } else if (this.currentNum < 3) {
                this.numberNode.setColor(cleverapps.styles.COLORS.COLOR_RED);
            }
        }
        this.numberNode.runAction(new cc.Sequence(
            new cc.ScaleTo(0.2, 1).easing(cc.easeCubicActionOut()),
            new cc.DelayTime(0.6).easing(cc.easeElasticIn(0.5)),
            new cc.ScaleTo(0.3, 0).easing(cc.easeCubicActionIn()),
            new cc.CallFunc(function () {
                this.currentNum--;
                if (this.currentNum >= 0) {
                    this.countDownAction();
                } else if (this.withBomb) {
                    this.numberNode.removeFromParent();
                    cleverapps.audio.playSound(bundles.prolongation_window.urls.bomb_timer_explosion);
                }
            }.bind(this))
        ));
    },

    pauseAction: function () {
        this.numberNode.pause();
        this.setTimeScale(0);
    },

    resumeAction: function () {
        this.setTimeScale(this.timeScale);
        this.numberNode.resume();
    },

    cleanup: function () {
        this._super();
        if (this.toggledMusic) {
            cleverapps.settings.toggleMusic();
        }
    }

});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    CIRCLE_COUNTDOWN_TEXT: {
        name: "nostroke",
        size: 80,
        color: cleverapps.styles.COLORS.COLOR_BROWN_2
    },

    CIRCLE_BOMB_COUNTDOWN_TEXT: {
        name: "nostroke",
        size: 80,
        color: cleverapps.styles.COLORS.WHITE
    }
});
