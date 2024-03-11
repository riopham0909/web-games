/**
 * Created by andrey on 01.09.17.
 */

var BoosterAmountView = cc.Node.extend({
    ctor: function (booster) {
        this._super();
        this.setAnchorPoint(0.5, 0.5);
        this.setCascadeOpacityEnabled(true);

        var styles = cleverapps.styles.BoosterAmountView;

        this.bg = bundles.game.frames.booster_amount_bg_png ? new cc.Sprite(bundles.game.frames.booster_amount_bg_png) : new cc.Sprite();
        this.bg.setScale(styles.background.scale);
        this.bg.setAnchorPoint2();
        this.addChild(this.bg);

        this.amount = cleverapps.UI.generateImageText('', cleverapps.styles.FONTS.WHITE_TEXT);
        this.addChild(this.amount);

        this.booster = booster;

        this.setAmount(booster.getAmount());
    },

    setAmount: function (amount) {
        if (amount > 0) {
            this.visible = true;
            this.bg.setVisible(true);
            this.amount.setVisible(true);
            this.amount.setString(amount);
            this.amount.fitTo((this.bg.width * this.bg.scale) * 0.85);
        } else {
            this.visible = false;
            this.bg.setVisible(false);
            this.amount.setVisible(false);
        }

        this.setContentSize2(
            Math.max(this.bg.width * this.bg.scale, this.amount.width * this.amount.scale),
            Math.max(this.bg.height * this.bg.scale, this.amount.height * this.amount.scale ));
        this.amount.setPositionRound(this.width / 2, this.height / 2 + cleverapps.styles.BoosterAmountView.amount.offsetY);
        this.bg.setPositionRound(this.width / 2, this.height / 2);
    },
});

cleverapps.styles.BoosterAmountView = {
    background: {
        scale: 1
    },
    amount: {
        offsetY: 0
    }
};