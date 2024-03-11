/**
 * Created by andrey on 17.07.2020
 */

var BoosterBeforeAmountView = cc.Node.extend({
    ctor: function (booster) {
        this._super();
        this.setAnchorPoint(0.5, 0.5);
        this.setCascadeOpacityEnabled(true);

        this.booster = booster;

        this.bg = new cc.Sprite(bundles.boosters_before.frames.booster_before_purple_button_png);
        this.addChild(this.bg);

        if (this.booster.isDisabled() && this.booster.getAmount() > cleverapps.Boosters.INIT_AMOUNT) {
            cleverapps.UI.convertToGrayScale(this.bg);
        }

        this.amount = cleverapps.UI.generateImageText("", cleverapps.styles.FONTS.BOOSTER_BEFORE_AMOUNT_TEXT);
        this.addChild(this.amount);

        this.icon = new cc.Sprite(bundles.boosters_before.frames.booster_before_check_icon_png);
        this.addChild(this.icon);

        this.update();
    },

    showActivated: function () {
        this.amount.visible = false;
        this.icon.visible = true;

        this.bg.setSpriteFrame(bundles.boosters_before.frames.booster_before_green_button_png);
        this.visible = true;
    },

    showAmount: function () {
        var styles = cleverapps.styles.BoosterBeforeAmountView;

        this.amount.visible = true;
        this.icon.visible = false;

        this.bg.setSpriteFrame(bundles.boosters_before.frames.booster_before_purple_button_png);
        this.visible = true;

        this.amount.setString(this.booster.getAmount());
        this.amount.fitTo(styles.amount.width);
    },

    update: function () {
        if (this.booster.isSelected()) {
            this.showActivated();
        } else if (this.booster.getAmount() > 0) {
            this.showAmount();
        } else {
            this.visible = false;
        }

        var styles = cleverapps.styles.BoosterBeforeAmountView;

        this.setContentSize2(
            Math.max(this.bg.width * this.bg.scale, this.amount.width * this.amount.scale),
            Math.max(this.bg.height * this.bg.scale, this.amount.height * this.amount.scale)
        );
        this.amount.setPositionRound(styles.amount);
        this.bg.setPositionRound(this.width / 2, this.height / 2);
        this.icon.setPositionRound(styles.icon);
    }
});

cleverapps.styles.BoosterBeforeAmountView = {
    amount: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 4 },
        width: 55
    },

    icon: {
        x: { align: "center" },
        y: { align: "center" }
    }
};