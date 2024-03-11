/**
 * Created by iamso on 09.01.19.
 */

var MenuBarItemView = cc.Node.extend({
    ctor: function (item) {
        this._super();
        this.setAnchorPoint2();
        this.styles = cleverapps.styles.MenuBarItem;
        this.item = item;
        this.centerAlign = this.item.centerAlign;

        this.lastShownValue = this.item.getCurrentValue();

        this.reset(true);
        this.item.onRemove = this.createListener(this.remove.bind(this));
        this.item.onChangeText = this.createListener(this.onChangeText.bind(this));
        this.item.onUpdateTimer = this.createListener(this.addText.bind(this));
        this.item.onShowForce = this.createListener(this.showForce.bind(this));
        this.item.onAttentionOnListener = this.createListener(this.turnOnAttention.bind(this));
        this.item.onAttentionOffListener = this.createListener(this.turnOffAttention.bind(this));
        this.item.onSetAnimationAndHide = this.createListener(this.setAnimationAndHide.bind(this));
        this.item.onUpdatePlusButton = this.createListener(this.updatePlusButton.bind(this));
        this.item.onUpdateLotteryIcon = this.createListener(this.updateLotteryIcon.bind(this));
        this.item.onUpdateSticker = this.createListener(this.updateSticker.bind(this));
        this.item.onFingerOnListener = this.createListener(this.turnOnFinger.bind(this));
        this.item.onFingerOffListener = this.createListener(this.turnOffFinger.bind(this));
        this.item.onUpdateClickable = this.createListener(this.updateClickable.bind(this));

        var targetTypes = this.item.getTargetTypes();
        if (targetTypes) {
            cleverapps.aims.registerTarget(targetTypes, this.getIcon(), {
                controls: this.item.getControlName(),
                animate: this.animateIcon.bind(this)
            });
        }

        if (this.item.tooltip) {
            cleverapps.tooltipManager.create(this, {
                text: this.item.tooltip,
                position: cleverapps.styles.UI.Tooltip.LOCATION.below,
                control: this.item.getControlName() + "Tooltip"
            });
        }
    },

    getIcon: function () {
        return this.icon;
    },

    updatePlusButton: function () {
        if (!!this.item.plusButton === !!this.plusButton) {
            return;
        }

        if (this.item.plusButton) {
            this.addPlusButton();
        } else {
            this.plusButton.removeFromParent();
            delete this.plusButton;
        }
    },

    updateLotteryIcon: function () {
        if (!!this.item.lottery === !!this.lotteryIcon) {
            return;
        }

        if (this.item.lottery) {
            if (!(["board", "differences"].indexOf(cleverapps.config.type) !== -1 && cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL && cleverapps.environment.isGameScene())) {
                Lottery.addIcon(this, "menu");
            }
        } else {
            this.lotteryIcon.removeFromParent();
            delete this.lotteryIcon;
        }
    },

    setAnimationAndHide: function (animationName) {
        if (this.icon instanceof cleverapps.Spine) {
            this.icon.setAnimation(0, animationName, false);
        }

        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.8),
            new cc.CallFunc(function () {
                cleverapps.meta.hideControlsWhileFocused(this.item.getControlName());
            }.bind(this))
        ));
    },

    reset: function () {
        this.turnOffAttention();
        this.removeAllChildren();

        this.addBg();
        this.addIcon();

        this.bg.setPositionRound(this.bg.width / 2 + this.iconRealWidth / 2, this.styles.bg.height / 2);
        this.setContentSize2(this.bg.width + this.iconRealWidth / 2, this.bg.height);

        this.updatePlusButton();
        this.addHelpButton();

        this.addText();
        this.updateClickable();

        cleverapps.UI.onClick(this, function () {
            this.onPressed();
        }.bind(this), {
            filter: this.item.canActionNow
        });

        SceneDecors.add(this.bg, cleverapps.skins.getSlot("menuBarItem", {
            name: this.item.getName()
        }));

        this.updateLotteryIcon();

        if (this.item.attention) {
            this.turnOnAttention();
        }

        this.updateSticker(true);
    },

    remove: function () {
        this.runAction(new cc.Sequence(
            new cc.ScaleTo(0.3, 0),
            new cc.RemoveSelf()
        ));
    },

    showForce: function (force) {
        this.show(true);
        cleverapps.forces.create(this, force, {
            importantNodes: [this]
        });
    },

    updateText: function (value) {
        this.text.setString(value);
    },

    getTextValue: function () {
        return this.item.getText();
    },

    onChangeText: function () {
        var currentValue = this.item.getCurrentValue();

        var amount = currentValue.amount - this.lastShownValue.amount;
        var time = currentValue.time - (this.lastShownValue.time === undefined ? Date.now() : this.lastShownValue.time);
        if (time) {
            if (time > 0) {
                time = "+" + Product.FormatTimePeriod(time).title;
            } else {
                time = Product.FormatTimePeriod(time).title;
            }
        }

        var delta = amount || time || 0;

        var textValue = this.getTextValue();

        this.text.stopAllActions();
        this.text.setScale(this.text.baseScale);

        var sound = this.item.deltaSound;
        if (sound) {
            cleverapps.audio.playSound(sound);
        }
        this.text.runAction(
            new cc.Sequence(
                new cc.ScaleTo(0.2, this.text.baseScale * 1.1),
                new cc.CallFunc(function () {
                    cleverapps.UI.animateDelta(delta, {
                        parent: this,
                        x: this.bg.width / 2 + this.iconRealWidth / 2,
                        y: this.styles.deltaAnimation.dy,
                        font: cleverapps.styles.FONTS.MENUBAR_TEXT_DELTA || cleverapps.styles.FONTS.MENUBAR_TEXT
                    });
                    this.lastShownValue = currentValue;
                    this.updateText(textValue);
                    this.text.setPositionRound(this.getTextPosition());
                }.bind(this)),
                new cc.ScaleTo(0.2, this.text.baseScale),
                new cc.CallFunc(function () {
                    this.textFitTo();
                }.bind(this))
            )
        );
    },

    animateIcon: function () {
        if (this.icon) {
            this.icon.stopAllActions();
            this.icon.setScale(this.icon.baseScale);
            this.icon.runAction(
                new cc.Sequence(
                    new cc.ScaleTo(0.05, this.icon.baseScale * 1.2).easing(cc.easeIn(1)),
                    new cc.ScaleTo(0.05, this.icon.baseScale).easing(cc.easeOut(1))
                )
            );
        }

        if (this.item.sparks && this.icon) {
            var sparks = new cleverapps.Spine(bundles.menubar.jsons.sparks_json);
            sparks.setAnimation(0, "animation_y", false);
            sparks.setCompleteListenerRemove();

            this.addChild(sparks, -1);
            sparks.setPositionRound(this.icon.getPositionX() + this.styles.sparks.x, this.icon.getPositionY() + this.styles.sparks.y);
        }
    },

    animateChange: function (delta) {
        return delta && !this.item.timer;
    },

    addIcon: function () {
        if (this.item.animation) {
            this.icon = new cleverapps.Spine(this.item.animation);
            this.icon.setAnimation(0, "idle", true);
        } else {
            this.icon = new cc.Sprite(typeof this.item.icon === "function" ? this.item.icon() : this.item.icon);
        }
        this.icon.baseScale = this.icon.getScale();
        this.iconRealWidth = this.styles.icon.fullInsideBg ? 0 : this.icon.getBoundingBox().width;

        this.addChild(this.icon);
        this.icon.setLocalZOrder(1);

        this.icon.setPositionRound({
            x: this.iconRealWidth / 2 + this.styles.icon.x,
            y: this.styles.bg.height / 2 + this.styles.icon.y
        });
    },

    addBg: function () {
        this.bg = cleverapps.UI.createScale9Sprite(bundles.menubar.frames.menubar_bg_png, cleverapps.UI.Scale9Rect.TwoPixelXY);
        this.bg.setContentSize2(this.styles.bg.width, this.styles.bg.height);
        this.addChild(this.bg);
    },

    textFitTo: function () {
        this.text.fitTo(this.getTextWidth());
    },

    getTextWidth: function () {
        var helpButtonWidth = 0;

        if (this.item.helpButton) {
            helpButtonWidth = this.styles.helpButton.width;
        }

        return this.width - this.iconRealWidth - this.styles.icon.x - this.styles.bg.padding.right - helpButtonWidth;
    },

    getTextPosition: function () {
        var dy = this.styles.bg.padding.bottom;
        return cc.p(this.iconRealWidth + this.styles.icon.x + this.getTextWidth() / 2, this.height / 2 + dy);
    },

    addText: function () {
        if (this.text && this.text.parent) {
            this.text.removeFromParent();
        }

        var msg = this.item.getText();
        var text;
        if (cleverapps.UI.ImageFont.IsApplicable(cleverapps.styles.FONTS.MENUBAR_TEXT, msg)) {
            text = cleverapps.UI.generateImageText(msg, cleverapps.styles.FONTS.MENUBAR_TEXT, { fixedNumberWidth: !!this.item.timer });
        } else {
            text = cleverapps.UI.generateOnlyText(msg, cleverapps.styles.FONTS.MENUBAR_TEXT);
        }

        this.addChild(text);
        this.text = text;
        text.baseScale = text.scale;
        this.textFitTo();
        text.setPositionRound(this.getTextPosition());
    },

    updateClickable: function () {
        if (this.item.clickable) {
            this.hoverHandler = cleverapps.UI.applyHover(this, {
                filter: this.item.canActionNow
            });
        } else if (this.hoverHandler) {
            this.hoverHandler.remove();
            delete this.hoverHandler;
        }
    },

    onPressed: function () {
        if (this.item.clickable) {
            this.item.action();
        }
    },

    addPlusButton: function () {
        var plusButton = this.plusButton = new cleverapps.UI.Button({
            type: {
                button_png: bundles.menubar.frames.plus_button_png,
                button_on_png: bundles.menubar.frames.plus_button_on_png
            },
            onClicked: this.item.action,
            filter: this.item.canActionNow
        });
        this.addChild(plusButton);
        plusButton.setLocalZOrder(1);
        
        cleverapps.meta.registerControl(this.item.getControlName() + ".Plus", this.plusButton.createListener(function (visible, silent) {
            if (!this.plusButton) {
                return;
            }

            this.plusButton.stopAllActions();

            var scale = visible ? 1 : 0;

            if (silent) {
                this.plusButton.setScale(scale);
            } else {
                this.plusButton.runAction(new cc.ScaleTo(0.2, scale));
            }
        }.bind(this)));

        if (cleverapps.meta.isControlEnabled(this.item.getControlName() + ".Plus")) {
            cleverapps.meta.showControlsWhileFocused(this.item.getControlName() + ".Plus", true);
        }

        var position = cc.p(this.icon.x + this.iconRealWidth / 2, 0);
        position.x += this.styles.plusButton.offset.x;
        position.y += this.styles.plusButton.offset.y;

        plusButton.setPositionRound(position);
    },

    addHelpButton: function () {
        if (!this.item.helpButton) {
            return;
        }

        var helpButton = this.helpButton = new cleverapps.UI.Button({
            type: {
                button_png: bundles.buttons.frames.help_button_png,
                button_on_png: bundles.buttons.frames.help_button_on_png
            },
            onClicked: this.item.action,
            filter: this.item.canActionNow
        });
        this.addChild(helpButton);

        cleverapps.meta.registerControl(this.item.getControlName() + ".HelpButton", this.createListener(function (visible) {
            helpButton.stopAllActions();

            if (visible) {
                helpButton.runAction(new cc.ScaleTo(0.2, 1));
            } else {
                helpButton.runAction(new cc.ScaleTo(0.2, 0));
            }
        }));

        helpButton.setPositionRound(this.styles.helpButton);
    },

    turnOnAttention: function () {
        if (this.attention) {
            return;
        }

        var styles = cleverapps.styles.MenuBarItem.attention;

        var attention = this.attention = new Attention();
        attention.setPositionRound(styles);
        this.addChild(attention);
    },

    turnOffAttention: function () {
        if (this.attention) {
            this.attention.removeFromParent();
            delete this.attention;
        }
    },

    updateSticker: function (silent) {
        var type = this.item.getSticker();

        if (!this.sticker === !type) {
            if (this.sticker) {
                this.sticker.runAction(new cc.Sequence(
                    new cc.ScaleTo(0.2, this.sticker.scale * 1.4),
                    new cc.ScaleTo(0.2, this.sticker.scale)
                ));
                this.text.runAction(new cc.Sequence(
                    new cc.ScaleTo(0.2, this.text.baseScale * 1.4),
                    new cc.ScaleTo(0.2, this.text.baseScale)
                ));
            }
            return;
        }

        if (this.sticker) {
            if (silent) {
                this.sticker.removeFromParent();
            } else {
                this.sticker.runAction(new cc.Sequence(
                    new cc.FadeOut(0.6),
                    new cc.RemoveSelf()
                ));
            }
            this.sticker = undefined;
        }

        switch (type) {
            case "premium": this.showPremiumSticker(silent); break;
        }
    },

    showPremiumSticker: function (silent) {
        var styles = cleverapps.styles.MenuBarItem.premiumSticker;

        var sticker = this.sticker = new cc.Sprite(bundles.menubar.frames.premium_sticker);
        sticker.setAnchorPoint2();
        sticker.setPositionRound(styles);
        this.addChild(sticker);

        var text = cleverapps.UI.generateOnlyText("WorkersMenuBarItem.subscription", cleverapps.styles.FONTS.MENUBAR_TIMER_TEXT);
        text.setAnchorPoint2();
        text.setPositionRound(styles.text);
        text.fitTo(styles.text.width);
        text.setRotation(styles.text.rotation);
        sticker.addChild(text);

        sticker.setCascadeOpacityEnabled(true);

        if (!silent) {
            sticker.setOpacity(0);
            sticker.runAction(new cc.FadeIn(0.6));
        }
    },

    turnOnFinger: function () {
        this.finger = FingerView.hintClick(this, {
            delay: 0.8
        });
    },

    turnOffFinger: function () {
        FingerView.remove(this.finger);
        this.finger = undefined;
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    MENUBAR_TEXT: {
        name: "default",
        size: 40
    }
});

cleverapps.styles.MenuBarItem = {
    noPlusDx: 14,

    bg: {
        width: 200,
        minWidth: 170,
        padding: {
            right: 20,
            bottom: 0
        }
    },

    deltaAnimation: {
        dy: -40
    },

    icon: {
        fullInsideBg: false,
        x: -10,
        y: 0
    },

    sparks: {
        x: -7,
        y: 5
    },

    iconText: {
        position: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 0 }
        }
    },

    plusButton: {
        offset: {
            x: 0,
            y: 0
        }
    },

    totalIcon: {
        x: { align: "center", dx: -15 },
        y: { align: "center" }
    },

    attention: {
        x: { align: "right", dx: 0 },
        y: { align: "bottom", dy: -17 }
    },

    premiumSticker: {
        x: { align: "center", dx: 45 },
        y: { align: "center", dy: 58 },

        text: {
            x: { align: "center", dx: -21 },
            y: { align: "center", dy: 8 },
            width: 140,
            rotation: -7
        }
    },

    helpButton: {
        width: 50,
        x: { align: "right", dx: 5 },
        y: { align: "center" }
    }
};
