/**
 * Created by slava on 23/3/20
 */

var BaseButtonBooster = cleverapps.UI.Button.extend({
    ctor: function (options) {
        this.booster = options.booster;
        this.styles = options.styles;

        this.content = this.getContent();
        this.onChangeAmount();

        var buttonOptions = {
            onClicked: this.onPressed.bind(this),
            content: this.content,
            spine: options.spine
        };

        cleverapps.overrideStyles(buttonOptions, this.getSize());

        this._super(buttonOptions);

        this.setCascadeOpacityEnabled(true);
        this.setCascadeColorEnabled(true);

        this.updateSize();
        this.updatePosition();

        this.booster.on("changeAmount", this.createListener(this.onChangeAmount.bind(this)), this);
        cleverapps.adsLimits.on("update", this.onChangeAmount.bind(this), this);
        if (cleverapps.config.soft) {
            cleverapps.user.on("changeSoft", this.onChangeAmount.bind(this), this);
        } else {
            cleverapps.user.on("changeHard", this.onChangeAmount.bind(this), this);
        }

        this.booster.onToggleArrowListener = this.createListener(this.toggleArrow.bind(this));
        this.booster.onToggleTintListener = this.createListener(this.toggleTint.bind(this));
        this.booster.onForceListener = this.createListener(this.showForce.bind(this));
        this.booster.onExecuteListener = this.createListener(this.onExecute.bind(this));
        this.booster.onEnableListener = this.createListener(this.enable.bind(this));
        this.booster.onDisableListener = this.createListener(this.disable.bind(this));

        cleverapps.aims.registerTarget("boosters" + this.booster.id, this, {
            controls: this.getControlId(),
            flyingUnderShadow: true
        });
    },

    onChangeAmount: function () {
        if (this.free) {
            return;
        }
        var currentText = this.getCurrentText();
        [this.amount, this.price, this.ads].forEach(function (text) {
            text.setVisible(text === currentText);
        });
        this.setAmount(this.booster.getAmount());
    },

    getCurrentText: function () {
        var boosterState = this.booster.getState();
        if (boosterState === BaseBooster.AMOUNT_STATE) {
            return this.amount;
        } if (boosterState === BaseBooster.PRICE_STATE) {
            return this.price;
        } if (boosterState === BaseBooster.ADS_STATE) {
            return this.ads;
        }
    },

    setAmount: function (amount) {
        this.amount.setString("x" + amount);
    },

    updatePosition: function () {
        if (this.styles.position) {
            this.setPositionRound(this.styles.position.x[cleverapps.resolution.mode], this.styles.position.y[cleverapps.resolution.mode]);
        }

        this.content.setPositionRound(this.width / 2, this.height / 2);
        this.layout.setPositionRound(this.styles.content.layout);
    },

    updateSize: function () {
        this.baseScale = (cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) ? this.styles.phone.scale : 1;
        this.setScale(this.baseScale);
        var size = this.getSize();
        this.resize(size.width, size.height);
    },

    getSize: function () {
        return {
            width: this.styles.width,
            height: this.styles.height
        };
    },

    toggleArrow: function (on) {
        if (on) {
            this.pointer = PointerView.create({
                target: this
            });
        } else {
            PointerView.remove(this.pointer);
            this.pointer = undefined;
        }

        if (this.icon instanceof cleverapps.Spine) {
            this.icon.setAnimation(0, on ? "animation" : "idle", true);
        }
    },

    toggleTint: function (on) {
        this.hintOn = on;
        this.runTintAnimation();
    },

    getForceActions: function () {
        return [
            function (f) {
                this.switchToFreePrice();
                setTimeout(f, 700);
            }.bind(this),
            function (f) {
                cleverapps.meta.showControlsWhileFocused(this.getControlId(), true);

                cleverapps.forces.create(this, this.booster.force);
                cleverapps.forces.onceForceClosed = f;
            }.bind(this)
        ];
    },

    getControlId: function () {
        return "hint_" + this.booster.id;
    },

    showForce: function () {
        if (cleverapps.forces.isAvailable(this, this.booster.force)) {
            var actions = this.getForceActions();
            this.baseZOrder = this.getLocalZOrder();
            this.setLocalZOrder(0);

            cleverapps.meta.display({
                focus: "ButtonBoosterForce",
                control: [this.getControlId(), "opencards"],
                actions: actions
            });

            return true;
        }
        return false;
    },

    runTintAnimation: function () {
        if (this.tintRunning || !this.hintOn) {
            return;
        }

        this.tintRunning = true;
        var white = cleverapps.styles.COLORS.WHITE;
        var color = cleverapps.styles.COLORS.HINT_ALARM_COLOR || cleverapps.styles.COLORS.PLAYER_ALARM_COLOR;

        this.background.runAction(new cc.Sequence(
            new cc.TintTo(0.7, color.r, color.g, color.b),
            new cc.TintTo(0.7, white.r, white.g, white.b),
            new cc.CallFunc(function () {
                this.tintRunning = false;
                this.runTintAnimation();
            }.bind(this))
        ));
    },

    createIcon: function () {
        if (bundles.game.jsons.hint_icon_json) {
            var animation = new cleverapps.Spine(bundles.game.jsons.hint_icon_json);
            animation.setAnimation(0, "idle", true);
            return animation;
        }
        return new cc.Sprite(bundles.game.frames.hint_icon_png);
    },

    getLayoutOptions: function () {
        return {
            direction: this.styles.content.direction,
            margin: this.styles.content.margin
        };
    },

    getContent: function () {
        var content = new cc.Node();
        content.setAnchorPoint2();
        var options = this.getLayoutOptions();

        var price = this.price = this.getPriceText();
        price.setCascadeOpacityEnabled(true);
        var amount = this.amount = cleverapps.UI.generateImageText("x" + this.booster.getAmount(), cleverapps.styles.FONTS.AMOUNT_BOOSTER);

        var ads = this.ads = new TextWithIcon("## x1", {
            font: cleverapps.styles.FONTS.BUTTON_BOOSTER
        });

        var icon = this.icon = this.createIcon();
        var textNode = this.textNode = new cc.Node();
        textNode.setAnchorPoint(0.5, 0.5);
        textNode.setContentSize(price.getContentSize());
        textNode.addChild(price);
        price.setPosition(textNode.width / 2, textNode.height / 2);
        textNode.addChild(amount);
        amount.setPosition(textNode.width / 2, textNode.height / 2);
        textNode.addChild(ads);
        ads.setPosition(textNode.width / 2, textNode.height / 2);

        this.layout = new cleverapps.Layout([icon, textNode], options);
        content.addChild(this.layout);
        return content;
    },

    getPriceText: function () {
        var price = this.booster.getPrice();

        var text = price.soft && "@@" + price.amount || "$$" + price.amount;

        return new TextWithIcon(text, {
            font: cleverapps.styles.FONTS.BUTTON_BOOSTER
        });
    },

    createFreePrice: function () {
        var styles = this.getFreeLayoutStyles();

        var free = cleverapps.UI.generateTTFText("FREE", cleverapps.styles.FONTS.BUTTON_BOOSTER);
        free.fitTo(styles.textWidth);

        free.setPosition(this.textNode.width / 2, this.textNode.height / 2);
        this.textNode.addChild(free);
        return free;
    },

    switchToFreePrice: function () {
        var currentText = this.getCurrentText();

        var free = this.free = this.createFreePrice();
        free.setOpacity(0);
        free.setVisible(false);

        currentText.runAction(new cc.Sequence(
            new cc.FadeOut(0.3),
            new cc.Hide()
        ));
        free.runAction(new cc.Sequence(
            new cc.DelayTime(0.3),
            new cc.Show(),
            new cc.FadeIn(0.3)
        ));
    },

    getFreeLayoutStyles: function () {
        var styles = this.styles.content.freeBlock;
        var width = styles.textWidth;
        return {
            textWidth: width,
            background: styles.textBg
        };
    },

    switchToRegularPrice: function () {
        this.free.runAction(new cc.Sequence(
            new cc.DelayTime(0.5),
            new cc.FadeOut(0.3),
            new cc.RemoveSelf(),
            new cc.CallFunc(function () {
                delete this.free;
                var currentText = this.getCurrentText();
                currentText.runAction(new cc.Sequence(
                    new cc.Show(),
                    new cc.FadeIn(0.3)
                ));
            }.bind(this))
        ));
    },

    onPressed: function () {
        var isRunningForce = cleverapps.forces.isRunningForce(this.booster.force);
        if (isRunningForce) {
            this.switchToRegularPrice();

            if (this.baseZOrder) {
                this.setLocalZOrder(this.baseZOrder);
            }

            cleverapps.forces.closeRunningForce();
        }

        cleverapps.meta.display({
            focus: "ExecuteButtonBooster",
            action: function (f) {
                this.booster.onPressed(f, isRunningForce);
            }.bind(this)
        });
    },

    onExecute: function () {
        if (this.icon instanceof cleverapps.Spine && cleverapps.config.name === "crocword") {
            this.icon.setAnimationAndIdleAfter("hint", "idle");
        }

        cleverapps.audio.playSound(this.booster.executeEffect);
    }
});

cleverapps.styles.FONTS = cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    BUTTON_BOOSTER: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    },

    AMOUNT_BOOSTER: {
        size: 45,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.ButtonBooster = {
    width: 150,
    height: 130,
    zOrder: 0,

    position: {
        x: [{ align: "center", dx: 0 },
            { align: "right", dx: -10 },
            { align: "right", dx: -10 }
        ],
        y: [{ align: "bottom", dy: 200 },
            { align: "bottom", dy: 360 },
            { align: "bottom", dy: 360 }
        ]
    },

    phone: {
        scale: 0.8
    },

    content: {
        margin: 20,
        direction: cleverapps.UI.HORIZONTAL,
        layout: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 0 }
        },
        freeBlock: {
            textWidth: 120,
            dx: 0
        }
    }
};
