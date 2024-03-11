/**
 * Created by andrey on 20.08.2021.
 */

var RewardedAdOverlay = cc.Scale9Sprite.extend({
    ctor: function (onFinish) {
        this._super(bundles.pixel.frames.pixel_png);

        this.setColor(cleverapps.styles.COLORS.BLACK);
        this.setOpacity(80);
        this.setLocalZOrder(TransitionAnimation.ZORDER + 1);

        this.timeLeft = cleverapps.parseInterval(RewardedAdOverlay.TIMEOUT);

        var countdown = new cleverapps.CountDown(this.timeLeft, {
            onTick: this.onTick.bind(this),
            onFinish: function () {
                if (this.isAutoCloseAvailable()) {
                    onFinish();
                }
            }.bind(this),
            ignorePaused: true
        });

        addCleaner(this, function () {
            countdown.remove();
        });

        cleverapps.UI.onClick(this, function () {
            if (this.isCloseAvailable()) {
                onFinish({ cancel: cleverapps.platform.oneOf(Yandex, GDCom, FacebookCanvas, TestPlatform) });
            }
        }.bind(this), {
            ignoreScale: true,
            swallowEvents: true
        });

        this.addLoadText();
        this.addAutoCloseText();
        this.addCloseText();
        this.updatePosition();
    },

    updatePosition: function () {
        var bgSize = cleverapps.UI.getBgSize();

        this.setContentSize2(bgSize.width + 4, bgSize.height + 4);
        this.setPositionRound(bgSize.width / 2, bgSize.height / 2 - cleverapps.UI.getBgOffset());
        this.setAnchorPoint2();

        if (this.autoCloseText) {
            this.autoCloseText.setPositionRound(cleverapps.styles.RewardedAdOverlay.autoClose);
        }

        if (this.loadText) {
            this.loadText.setPositionRound(cleverapps.styles.RewardedAdOverlay.text);
        }

        if (this.closeText) {
            this.closeText.setDimensions(bgSize.width, 0);
            this.closeText.fitTo(bgSize.width);
            this.closeText.setPositionRound(cleverapps.styles.RewardedAdOverlay.text);
        }
    },

    onTick: function (timeLeft) {
        this.timeLeft = timeLeft;

        if (this.isAutoCloseAvailable() && this.autoCloseText) {
            if (!this.autoCloseText.visible) {
                this.showAutoCloseText();
            }
            this.autoCloseText.setString("RewardAutoClose", { timeout: Math.ceil(timeLeft / 1000) });
        }

        if (this.loadText && this.isCloseAvailable()) {
            this.loadText.runAction(new cc.Sequence(
                new cc.FadeOut(0.3),
                new cc.CallFunc(this.showCloseText.bind(this)),
                new cc.RemoveSelf()
            ));
            this.loadText = undefined;
        }
    },

    addAutoCloseText: function () {
        var autoCloseText = cleverapps.UI.generateOnlyText("", cleverapps.styles.FONTS.REWARDED_AD_OVERLAY_AUTO_CLOSE_TEXT);
        autoCloseText.setPositionRound(cleverapps.styles.RewardedAdOverlay.autoClose);
        autoCloseText.visible = false;
        this.autoCloseText = autoCloseText;
        this.addChild(autoCloseText);
    },

    showAutoCloseText: function () {
        var autoCloseText = this.autoCloseText;
        if (autoCloseText && !autoCloseText.visible) {
            autoCloseText.visible = true;
            autoCloseText.setOpacity(0);
            autoCloseText.runAction(new cc.Sequence(
                new cc.DelayTime(1),
                new cc.FadeIn(0.3)
            ));
        }
    },

    addLoadText: function () {
        var loadText = this.loadText = cleverapps.UI.generateOnlyText("Loading", cleverapps.styles.FONTS.REWARDED_AD_OVERLAY_TEXT);
        loadText.setPositionRound(cleverapps.styles.RewardedAdOverlay.text);
        this.addChild(loadText);
        loadText.setOpacity(0);
        loadText.runAction(new cc.FadeIn(0.3));
    },

    addCloseText: function () {
        var closeText = this.closeText = cleverapps.UI.generateOnlyText("Window.ClickToClose", cleverapps.styles.FONTS.REWARDED_AD_OVERLAY_TEXT);
        closeText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        closeText.setDimensions(cleverapps.UI.getSceneSize().width, 0);
        closeText.fitTo(cleverapps.UI.getSceneSize().width);
        closeText.setPositionRound(cleverapps.styles.RewardedAdOverlay.text);
        closeText.visible = false;
        this.addChild(closeText);
    },

    showCloseText: function () {
        var closeText = this.closeText;
        if (closeText && !closeText.visible) {
            closeText.visible = true;
            closeText.setOpacity(0);
            closeText.runAction(new cc.FadeIn(0.3));
        }
    },

    isCloseAvailable: function () {
        return this.timeLeft <= cleverapps.parseInterval(RewardedAdOverlay.CLOSE_AVAILABLE);
    },

    isAutoCloseAvailable: function () {
        return !cleverapps.platform.oneOf(Instant, GDCom, Yandex) && this.isCloseAvailable();
    }
});

RewardedAdOverlay.initialize = function () {
    var timeout = "65 seconds";
    var closeAvailable = "60 seconds";

    if (cleverapps.platform.oneOf(GDCom)) {
        closeAvailable = "50 seconds";
    }

    RewardedAdOverlay.TIMEOUT = timeout;
    RewardedAdOverlay.CLOSE_AVAILABLE = closeAvailable;
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    REWARDED_AD_OVERLAY_AUTO_CLOSE_TEXT: {
        size: 30,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    },

    REWARDED_AD_OVERLAY_TEXT: {
        size: 60,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.RewardedAdOverlay = {
    text: {
        x: { align: "center" },
        y: { align: "center" }
    },

    autoClose: {
        x: { align: "center" },
        y: { align: "center", dy: -100 }
    }
};
