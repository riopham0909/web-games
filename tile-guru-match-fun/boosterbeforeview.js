/**
 * Created by andrey on 21.05.2020
 */

var BoosterBeforeView = cc.Scale9Sprite.extend({
    ctor: function (windowBooster, level) {
        this._super(bundles.boosters_before.frames.booster_before_bg_png);

        this.windowBooster = windowBooster;
        this.level = level;

        var styles = cleverapps.styles.BoosterBeforeView;

        this.setContentSize2(styles);

        this.createIcon();

        if (this.windowBooster.isUpcoming()) {
            this.createUpcomingText();
        }

        if (this.windowBooster.isLantern()) {
            var bonus = new BoosterBeforeBonusView();
            bonus.setPositionRound(styles.bonus);
            this.addChild(bonus);
            bonus.lanternAnimation();
        }

        if (!this.windowBooster.isDisabled() && !this.windowBooster.isLantern()) {
            this.amount = new BoosterBeforeAmountView(this.windowBooster);
            this.amount.setPositionRound(styles.amount);
            this.addChild(this.amount);
            this.createPrice();
        }

        this.windowBooster.on("update", this.createListener(this.update.bind(this)), this);
        this.windowBooster.on("showForce", this.createListener(this.showForce.bind(this)), this);
        this.windowBooster.on("changeAmount", this.createListener(this.update.bind(this)), this);
        cleverapps.adsLimits.on("update", this.createListener(this.update.bind(this)), this);
        if (cleverapps.config.soft) {
            cleverapps.user.on("changeSoft", this.update.bind(this), this);
        } else {
            cleverapps.user.on("changeHard", this.update.bind(this), this);
        }

        if (!this.windowBooster.isDisabled() && !this.windowBooster.isLantern()) {
            cleverapps.UI.applyHover(this);
            cleverapps.UI.onClick(this, this.onClick.bind(this));
        }

        this.update();
    },

    showUp: function (delay) {
        this.setVisible(false);
        this.runAction(
            new cc.Sequence(
                new cc.DelayTime(delay),
                new cc.CallFunc(function () {
                    cleverapps.audio.playSound(bundles.boosters_before.urls.appear_sfx, { throttle: 0 });
                    this.setScale(0.5);
                    this.setVisible(true);
                }.bind(this)),
                new cc.ScaleTo(0.4, 1, 1).easing(cc.easeBackOut(2))
            )
        );
    },

    createPrice: function () {
        var styles = cleverapps.styles.BoosterBeforeView.price;

        var content = new cc.Node();
        content.setAnchorPoint2();
        content.setContentSize2(styles.content.width, styles.content.height);

        var price = this.price = new TextWithIcon("$$" + this.windowBooster.getPrice(), {
            font: cleverapps.styles.FONTS.WHITE_TEXT
        });

        var ads = this.ads = new TextWithIcon("## x1", {
            font: cleverapps.styles.FONTS.WHITE_TEXT
        });

        content.addChild(price);
        price.setPosition(content.width / 2, content.height / 2);
        content.addChild(ads);
        ads.setPosition(content.width / 2, content.height / 2);

        var priceButton = this.priceButton = new cleverapps.UI.Button({
            content: content,
            width: styles.width,
            height: styles.height,
            type: cleverapps.styles.UI.Button.Images.small_button_green,
            keepRadius: true,
            onClicked: this.onClick.bind(this)
        });

        this.addChild(priceButton);
        priceButton.setPositionRound(styles);
    },

    createUpcomingText: function () {
        var styles = cleverapps.styles.BoosterBeforeView;

        var textBgImage = bundles.boosters_before.frames.booster_before_level_bg;
        this.textAvailableBg = cleverapps.UI.createScale9Sprite(textBgImage, styles.textAvailable.bg.rect);
        this.addChild(this.textAvailableBg);
        this.textAvailableBg.setContentSize2(styles.textAvailable.bg);
        this.textAvailableBg.setPositionRound(styles.textAvailable.bg);

        var text = cleverapps.UI.generateOnlyText(Messages.get("UnlockOnLevel", {
            level: this.windowBooster.getLevelAvailable()
        }), cleverapps.styles.FONTS.BOOSTERS_BEFORE_UNLOCK || cleverapps.styles.FONTS.WINDOW_SMALL_TEXT);
        this.addChild(text, 1);
        text.setPositionRound(styles.textAvailable);
        text.fitTo(styles.textAvailable.width);
    },

    createIcon: function () {
        var styles = cleverapps.styles.BoosterBeforeView;

        var dy = styles.icon[this.windowBooster.id] ? styles.icon[this.windowBooster.id].dy : styles.icon.dy;
        this.icon = new cc.Sprite(this.windowBooster.getIcon());

        if (this.windowBooster.isUpcoming()) {
            this.icon.setOpacity(150);
        } else {
            this.icon.setOpacity(255);
        }
        this.icon.setPositionRound(this.width / 2, this.height / 2 + dy);
        this.addChild(this.icon);
    },

    onClick: function () {
        this.windowBooster.onClick();

        this.icon.stopAllActions();
        this.icon.setScale(0.95);
        this.icon.runAction(
            new cc.ScaleTo(0.15, 1).easing(cc.easeBackInOut())
        );

        var sound = this.windowBooster.isSelected() ? bundles.main.urls.booster_before_cancel_effect
            : bundles.main.urls.booster_before_selection_effect;
        cleverapps.audio.playSound(sound);
    },

    updateBackground: function () {
        var bgImage = bundles.boosters_before.frames.booster_before_bg_png;
        if (this.windowBooster.isDisabled()) {
            bgImage = bundles.boosters_before.frames.booster_before_bg_off_png;
        } else if (this.windowBooster.isSelected() || this.windowBooster.isLantern()) {
            bgImage = bundles.boosters_before.frames.booster_before_bg_on_png;
        }
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(bgImage));
    },

    updateIcon: function () {
        this.icon.setSpriteFrame(this.windowBooster.getIcon());

        if (this.windowBooster.isUpcoming()) {
            this.icon.setOpacity(150);
        } else {
            this.icon.setOpacity(255);
        }
    },

    update: function () {
        this.updateBackground();

        if (this.amount) {
            this.amount.update();
        }

        if (this.priceButton) {
            this.priceButton.setVisible(this.windowBooster.isActive() && this.windowBooster.getAmount() <= 0);
            this.price.setVisible(!this.windowBooster.isAd());
            this.ads.setVisible(this.windowBooster.isAd());
        }

        if (this.windowBooster.isSelected() && Messages.has("BoosterBeforeUse_" + this.windowBooster.booster.id)) {
            cleverapps.notification.create("BoosterBeforeUse_" + this.windowBooster.booster.id, {
                image: this.windowBooster.booster.icon
            });
        }
    },

    showForce: function (f) {
        var force = this.windowBooster.getForce();
        if (cleverapps.forces.isAvailable(this, force)) {
            cleverapps.forces.create(this, force);
            cleverapps.forces.onceForceClosed = f;

            this.update();
        } else {
            f();
        }
    },

    onExit: function () {
        this.windowBooster.onExit();
    }
});

cleverapps.styles.BoosterBeforeView = {
    width: 186,
    height: 186,

    bonus: {
        x: { align: "right", dx: 18 },
        y: { align: "bottom", dy: -18 }
    },

    amount: {
        x: { align: "right", dx: 18 },
        y: { align: "bottom", dy: -18 }
    },

    price: {
        width: 160,
        height: 80,
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: -40 },

        content: {
            width: 115,
            height: 50
        }
    },

    textAvailable: {
        x: { align: "center" },
        y: { align: "bottom", dy: 8 },
        width: 170,

        bg: {
            x: { align: "center", dx: 0 },
            y: { align: "bottom", dy: -5 },
            width: 190,
            height: 55
        }
    },

    icon: {
        dy: 0
    }
};