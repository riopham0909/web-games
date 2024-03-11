/**
 * Created by andrey on 14.09.2022
 */

var PaymentOverlay = cc.Scale9Sprite.extend({
    ctor: function () {
        var winSize = cleverapps.UI.getSceneSize();

        this._super(bundles.pixel.frames.pixel_png);
        this.setContentSize2(winSize.width, winSize.height);
        this.setAnchorPoint2();
        this.setLocalZOrder(TransitionAnimation.ZORDER + 1);
        this.setPositionRound(winSize.width / 2, winSize.height / 2);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function () {
                return true;
            },
            onTouchEnded: function () {
                if (this.closeText.isVisible()) {
                    this.startCancel();
                }
                return true;
            }.bind(this)
        }, this);

        cleverapps.UI.disableHover = true;
        this.addCleaner(function () {
            cleverapps.UI.disableHover = false;
        });

        this.addText();
        this.addCloseText();

        this.setOpacity(0);

        this.showLoading();

        this.runAction(new cc.Sequence(
            new cc.DelayTime(4),
            new cc.CallFunc(function () {
                this.hideLoading();

                if (!PaymentOverlay.isCancelAvailable()) {
                    this.removeFromParent();
                    return;
                }

                this.setColor(cleverapps.styles.COLORS.BLACK);
            }.bind(this)),
            new cc.FadeTo(0.3, 80)
        ));
    },

    showLoading: function () {
        var loading = this.loading = WaitWindow.prototype.showLoading.call(this);
        loading.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(loading);

        loading.visible = false;
        loading.runAction(new cc.Sequence(
            new cc.DelayTime(0.2),
            new cc.CallFunc(function () {
                loading.visible = true;
            })
        ));
    },

    hideLoading: function () {
        if (this.loading) {
            this.loading.removeFromParent();
            delete this.loading;
        }
    },

    updatePosition: function () {
        var winSize = cleverapps.UI.getSceneSize();
        this.setContentSize2(winSize.width, winSize.height);
        this.setPositionRound(winSize.width / 2, winSize.height / 2);

        if (this.loading && this.loading.visible) {
            this.hideLoading();
            this.showLoading();
        }

        if (this.text) {
            this.text.setPositionRound(cleverapps.styles.RewardedAdOverlay.text);
        }

        if (this.closeText) {
            this.closeText.setDimensions(winSize.width, 0);
            this.closeText.fitTo(winSize.width);
            this.closeText.setPositionRound(cleverapps.styles.PaymentOverlay.closeText);
        }
    },

    addText: function () {
        var text = this.text = cleverapps.UI.generateOnlyText("ProcessingInProgress", cleverapps.styles.FONTS.REWARDED_AD_OVERLAY_TEXT);
        text.setPositionRound(cleverapps.styles.RewardedAdOverlay.text);
        this.addChild(text);
        text.setOpacity(0);
        text.runAction(new cc.Sequence(
            new cc.DelayTime(4),
            new cc.FadeIn(0.3)
        ));
    },

    addCloseText: function () {
        var closeText = this.closeText = cleverapps.UI.generateOnlyText("Window.ClickToClose", cleverapps.styles.FONTS.PAYMENT_OVERLAY_CLOSE_TEXT);
        closeText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        closeText.setDimensions(cleverapps.UI.getSceneSize().width, 0);
        closeText.fitTo(cleverapps.UI.getSceneSize().width);
        closeText.setPositionRound(cleverapps.styles.PaymentOverlay.closeText);
        this.addChild(closeText);
        closeText.setOpacity(0);
        closeText.setVisible(false);
        closeText.runAction(new cc.Sequence(
            new cc.DelayTime(PaymentOverlay.CLOSE_AVAILABLE / 1000),
            new cc.Show(),
            new cc.FadeIn(0.3)
        ));
    },

    startCancel: function () {
        this.text.visible = false;
        this.closeText.visible = false;

        this.showLoading();

        var delay = PaymentOverlay.CANCEL_DURATION / 1000;
        if (cleverapps.payments.getPurchaseState() === PaymentsManager.STATE_VALIDATE) {
            delay += 5;
        }

        this.runAction(new cc.Sequence(
            new cc.DelayTime(delay),
            new cc.CallFunc(function () {
                this.hideLoading();

                cleverapps.paymentsManager.stopPurchasePlayer();
            }.bind(this))
        ));
    },

    onEnter: function () {
        this._super();

        console.log("PaymentsManager overlay created");
    },

    onExit: function () {
        this._super();

        console.log("PaymentsManager overlay closed");
    }
});

PaymentOverlay.isCancelAvailable = function () {
    return !cleverapps.platform.oneOf(Draugiem, Microsoft, Amazon);
};

PaymentOverlay.initialize = function () {
    var closeAvailable = "15 seconds";
    var cancelDuration = "10 seconds";

    if (cleverapps.platform.oneOf(MobileMyMailRu)) {
        closeAvailable = "5 seconds";
    }
    if (cleverapps.platform.oneOf(CleverApps, MSStart)) {
        closeAvailable = "30 seconds";
    }
    if (cleverapps.platform.oneOf(Apple)) {
        closeAvailable = "30 seconds";
        cancelDuration = "20 seconds";
    }
    if (cleverapps.payments instanceof YooKassaPayments) {
        closeAvailable = "5 seconds";
        cancelDuration = "2 seconds";
    }

    PaymentOverlay.CLOSE_AVAILABLE = cleverapps.parseInterval(closeAvailable);
    PaymentOverlay.CANCEL_DURATION = cleverapps.parseInterval(cancelDuration);
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    PAYMENT_OVERLAY_TEXT: {
        size: 60,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    },

    PAYMENT_OVERLAY_CLOSE_TEXT: {
        size: 30,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.PaymentOverlay = {
    text: {
        x: { align: "center" },
        y: { align: "center" }
    },

    closeText: {
        x: { align: "center" },
        y: { align: "center", dy: -100 }
    }
};
