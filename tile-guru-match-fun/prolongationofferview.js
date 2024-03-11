/**
 * Created by vladislav on 06.09.2021
 */

var ProlongationOfferView = cleverapps.Layout.extend({
    ctor: function (prolongation, offer) {
        var styles = cleverapps.styles.ProlongationOfferView;

        this.prolongation = prolongation;
        this.offer = offer;

        var items = [];

        this.useProlongationTimer = ["solitaire", "tile3", "blocks"].indexOf(cleverapps.config.type) !== -1
            && (cleverapps.forces.isShown(Forces.FREE_PROLONGATION_FORCE.id) || levels.user.getFloatLevel() >= 1.4);

        var withMoves = this.offer.moves;

        if (this.useProlongationTimer) {
            this.timer = new CircleCountdown(this.prolongation.onCompleteOffer, this.offer);
            items.push(this.timer);
        }
        if (withMoves || this.offer.magic) {
            this.label = this.createLabel();
            items.push(this.label);
        }

        if (withMoves && this.offer.bonus) {
            this.createBonusLabel();
        }

        if (this.offer.lottery) {
            Lottery.addIcon(this);
        }

        this.button = this.createButton();
        items.push(this.button);

        this._super(items, {
            direction: cleverapps.UI.VERTICAL,
            margin: styles.margin
        });
    },

    createButton: function () {
        var styles = cleverapps.styles.ProlongationOfferView.button;
        return new cleverapps.UI.Button({
            type: this.offer.magic && cleverapps.styles.UI.Button.Images.button_blue,
            content: new TextWithIcon(this.offer.priceType === "free" ? this.offer.text : Messages.get("PlayOn") + " " + this.offer.text),
            width: styles.width,
            height: styles.height,
            onClicked: this.onClick.bind(this)
        });
    },

    createLabel: function () {
        var styles = cleverapps.styles.ProlongationOfferView;

        var label;
        if (bundles.prolongation_window.jsons.label_moves_json) {
            label = this.label = new cleverapps.Spine(bundles.prolongation_window.jsons.label_moves_json);
            label.setAnimationAndIdleAfter("open", "idle");
        } else {
            label = this.label = new cc.Sprite(bundles.prolongation_window.frames.label_moves_png);
            if (!this.offer.magic) {
                var amount = cleverapps.UI.generateImageText("+" + this.offer.moves, cleverapps.styles.FONTS.PROLONG_BUTTON_AMOUNT_TEXT);
                label.addChild(amount);
                amount.setPositionRound(styles.label.amount);
            }
        }
        return label;
    },

    createBonusLabel: function () {
        var styles = cleverapps.styles.ProlongationOfferView;
        var bonusLabel = new cleverapps.Spine(bundles.prolongation_window.jsons.bonus_json);
        this.label.addChild(bonusLabel);
        bonusLabel.setLocalZOrder(-1);
        bonusLabel.setPositionRound(styles.bonusLabel);
        bonusLabel.runAction(new cc.Sequence(
            new cc.DelayTime(1),
            new cc.CallFunc(function () {
                bonusLabel.setAnimationAndIdleAfter("showUp", "idle");
            })
        ));
    },

    onShow: function () {
        this.setVisible(false);
        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.4),
            new cc.ScaleTo(0, 0.5),
            new cc.Show(),
            new cc.CallFunc(function () {
                if (this.useProlongationTimer) {
                    if (!this.timer.isShown) {
                        this.timer.show();
                    } else {
                        this.timer.resumeAction();
                    }
                    this.button.runAction(new cc.RepeatForever(
                        new cc.Sequence(
                            new cc.ScaleTo(0.5, 1.1).easing(cc.easeOut(2)),
                            new cc.ScaleTo(0.5, 1).easing(cc.easeIn(2))
                        )
                    ));
                }
            }.bind(this)),
            new cc.ScaleTo(0.3, 1).easing(cc.easeBackOut()),
            new cc.CallFunc(this.showForce.bind(this))
        ));
    },

    showForce: function () {
        if (this.offer.force) {
            cleverapps.forces.create(this.button, this.offer.force, {
                importantNodes: [this.button],
                actives: [this]
            });
        }
    },

    onClick: function () {
        if (this.useProlongationTimer && this.timer) {
            this.timer.pauseAction();
        }
        this.prolongation.acceptOffer(this.offer);
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    PROLONG_BUTTON_AMOUNT_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE
    }
});

cleverapps.styles.ProlongationOfferView = {
    margin: 20,
    button: {
        width: 350,
        height: 90
    },
    label: {
        amount: {
            x: { align: "center", dx: -3 },
            y: { align: "center", dy: -3 }
        }
    },

    bonusLabel: {
        x: { align: "center", dx: 125 },
        y: { align: "center", dy: 73 }
    }
};