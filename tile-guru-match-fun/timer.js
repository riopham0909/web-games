/**
 * Created by vladislav on 19.09.2022
 */

var Timer = cleverapps.Layout.extend({
    ctor: function (timeLeft, onFinish, options) {
        options = options || {};

        var styles = cleverapps.styles.Timer;

        var width = options.width || styles.width;
        var height = styles.height;

        var bg = new cc.Scale9Sprite(bundles.big_timer.frames.big_timer_bg_png);
        bg.setContentSize2(width, height);

        var icon = new cc.Sprite(bundles.big_timer.frames.big_timer_png);
        icon.setLocalZOrder(1);

        var countDown = timeLeft <= 0 ? timeLeft : new cleverapps.CountDown(timeLeft, {
            onFinish: onFinish
        });

        var countDownView = new cleverapps.CountDownView(countDown, {
            font: cleverapps.styles.FONTS.TIMER_TEXT
        });
        bg.addChild(countDownView);
        countDownView.setPositionRound(styles.timer);
        countDownView.fitTo(width - 2 * styles.padding.x);

        this._super([icon, bg], {
            margin: styles.margin,
            direction: cleverapps.UI.HORIZONTAL
        });
    }
});

cleverapps.styles.Timer = {
    width: 300,
    height: 60,

    margin: -40,

    timer: {
        x: { align: "center", dx: 16 },
        y: { align: "center", dy: 0 }
    },

    padding: {
        x: 36
    },

    icon: {
        x: { align: "left", dx: -25 },
        y: { align: "center", dy: 3 }
    }
};
