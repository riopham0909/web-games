/**
 * Created by andrey on 04.07.17.
 */

var CrossPromoWindow = Window.extend({
    onWindowLoaded: function (promotion) {
        this.promotion = promotion;

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.PROMO_SHOW + this.promotion.id);

        cleverapps.crossPromo.setProcessed(this.promotion);

        var styles = cleverapps.styles.CrossPromoWindow;

        var image = new cc.Sprite(bundles[promotion.bundleName].urls.image);

        cleverapps.UI.onClick(image, this.onPressed.bind(this));

        var text = cleverapps.UI.wrapWithPadding(this.createText(), {
            bottom: styles.text.padding
        });

        var content = new cleverapps.Layout([image, text], {
            margin: styles.margin,
            direction: cleverapps.UI.VERTICAL
        });

        this._super({
            title: promotion.title,
            name: "crosspromowindow",
            content: content,
            button: {
                width: styles.button.width,
                height: styles.button.height,

                text: "Play",
                onPressed: this.onPressed.bind(this)
            }
        });

        this.addBadge();
    },

    createText: function () {
        var styles = cleverapps.styles.CrossPromoWindow;

        var text = cleverapps.UI.generateOnlyText(this.promotion.description, cleverapps.styles.FONTS.PROMOTION_TEXT);
        text.setDimensions(styles.text.width, 0);
        text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);

        return text;
    },

    isRewardAvailable: function () {
        return !(cleverapps.platform instanceof MobileVk);
    },

    onPressed: function () {
        var target = this.promotion.link;

        if (!cleverapps.platform.oneOf(Instant)) {
            cc.sys.openURL(target);
        } else {
            FBInstant.switchGameAsync(target, { channel: cleverapps.config.name })
                .catch(function (e) {
                    console.log("FBInstant.switchGameAsync error", e);
                    var code = e.code === "USER_INPUT" ? "cancel" : "error";
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.PROMO + code + "_" + this.promotion.id);
                    if (code === "error") {
                        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.PROMO_ERROR + cleverapps.config.platform);
                    }
                }.bind(this));
        }

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.PROMO + this.promotion.id);

        if (this.isRewardAvailable()) {
            new RewardWindow({ hard: cleverapps.CrossPromo.BONUS }, { event: cleverapps.EVENTS.EARN.PROMO });
        }

        this.close();
    },

    addBadge: function () {
        if (!this.isRewardAvailable()) {
            return;
        }

        var badge = new cc.Sprite(bundles.crosspromo_window.frames.badge);
        var reward = new TextWithIcon("+" + cleverapps.CrossPromo.BONUS + "$$", {
            font: cleverapps.styles.FONTS.BADGE_TEXT
        });

        var styles = cleverapps.styles.CrossPromoWindow;
        reward.setPositionRound(badge.width / 2 + styles.badge.price.dx, badge.height / 2 + styles.badge.price.dy);
        reward.setRotation(styles.badge.rotation);
        badge.addChild(reward);

        badge.setPositionRound(this.buttons.width + styles.badge.dx, this.buttons.height + styles.badge.dy);
        this.buttons.addChild(badge);
    },

    listBundles: function (promotion) {
        return [promotion.bundleName];
    }
});

cleverapps.styles.FONTS = cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    PROMOTION_TEXT: {
        size: 30,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR
    },

    BADGE_TEXT: {
        size: 28,
        color: cleverapps.styles.COLORS.WHITE
    }
});

cleverapps.styles.CrossPromoWindow = {
    margin: 40,

    text: {
        width: 620,
        margin: 20,
        padding: 60
    },

    button: {
        width: 250,
        height: 80,
        margin: 0
    },

    badge: {
        dx: 20,
        dy: -33,
        rotation: 34,

        price: {
            dx: 10,
            dy: 0
        }
    }
};
