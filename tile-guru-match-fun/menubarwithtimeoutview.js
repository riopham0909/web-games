/**
 * Created by rvvslv on 13.01.21.
 */

var MenuBarWithTimeoutView = MenuBarItemView.extend({
    ctor: function (item) {
        this._super(item);

        this.item.onChangeTimer = this.createListener(this.onChangeTimer.bind(this));
        this.item.onRefreshTimer = this.createListener(this.onRefreshTimer.bind(this));
    },

    onChangeTimer: function (silent) {
        if (this.timer) {
            if (this.timer instanceof cleverapps.UI.ImageFont && this.item.timerTTF) {
                this.removeTimer(silent);
            }
            if (!(this.timer instanceof cleverapps.UI.ImageFont) && !this.item.timerTTF) {
                this.removeTimer(silent);
            }
        }

        if (this.item.timer) {
            this.createTimer(silent);
        } else {
            this.removeTimer(silent);
        }
    },

    reset: function (silent) {
        this._super(silent);
        this.timerBlock = undefined;
        this.onChangeTimer(true);
    },

    animateChange: function (delta) {
        return delta;
    },

    createTimer: function (silent) {
        if (this.timerBlock || cleverapps.platform.oneOf(Pliega)) {
            return;
        }

        this.timerBlock = cleverapps.UI.createScale9Sprite(bundles.menubar.frames.bar_timer_png);
        this.timerBlock.setCascadeOpacityEnabled(true);
        var width = this.bg.width - 2 * this.styles.timer.padding.x;
        this.timerBlock.setContentSize2(width, this.styles.timer.height);
        this.timerBlock.setPositionRound(this.styles.timer.position);
        this.addChild(this.timerBlock, -1);

        if (this.styles.timer.icon) {
            var icon = new cc.Sprite(bundles.timer.frames.timer_png);
            icon.setPositionRound(this.styles.timer.icon);
            this.timerBlock.addChild(icon);
        }

        if (this.item.timerTTF) {
            this.timer = cleverapps.UI.generateOnlyText("", cleverapps.styles.FONTS.MENUBAR_TIMER_TEXT);
        } else {
            this.timer = cleverapps.UI.generateImageText("", cleverapps.styles.FONTS.MENUBAR_TIMER_TEXT, { fixedNumberWidth: true });
        }
        this.timer.baseScale = 1;
        this.timerBlock.addChild(this.timer);

        if (silent) {
            this.onRefreshTimer();
        } else {
            this.timerBlock.setOpacity(0);
            this.timerBlock.runAction(new cc.Sequence(
                new cc.FadeIn(0.3),
                new cc.CallFunc(this.onRefreshTimer.bind(this))
            ));
        }
    },

    removeTimer: function (silent) {
        if (!this.timerBlock) {
            return;
        }

        if (silent) {
            this.timerBlock.removeFromParent();
        } else {
            this.timerBlock.runAction(new cc.Sequence(
                new cc.FadeOut(0.3),
                new cc.RemoveSelf()
            ));
        }
        this.timerBlock = undefined;
    },

    onRefreshTimer: function () {
        if (!this.timerBlock) {
            return;
        }

        this.timer.setString(this.item.getText());
        this.timer.setFont(cleverapps.styles.FONTS.MENUBAR_TIMER_TEXT);
        this.timer.setScale(this.timer.baseScale);

        this.timer.fitTo(cleverapps.styles.MenuBarItem.timer.text.width);
        this.timer.setPositionRound(this.styles.timer.text);
    },

    getTextValue: function () {
        return this.item.getCurrentValue();
    },

    updateText: function (value) {
        this.text.removeAllChildren();

        if (this.item.totalIcon) {
            var totalIcon = new cc.Sprite(this.item.totalIcon);
            totalIcon.setPositionRound(this.styles.totalIcon);
            this.text.addChild(totalIcon);
            return;
        }

        var amount = value.amount;
        var total = value.total;

        var amountText = cleverapps.UI.generateImageText(amount, cleverapps.styles.FONTS.MENUBAR_TEXT);

        if (!this.styles.noColoredText) {
            if (amount >= total) {
                amountText.setColor(cleverapps.styles.COLORS.GREEN);
            } else if (amount < total * 0.1) {
                amountText.setColor(cleverapps.styles.COLORS.COLOR_RED);
            }
        }

        var separateText = this.separateText = cleverapps.UI.generateImageText("/", cleverapps.styles.FONTS.MENUBAR_TEXT);
        var totalText = cleverapps.UI.generateImageText(total, cleverapps.styles.FONTS.MENUBAR_TEXT);
        if (this.item.highlightTotal && this.item.highlightTotal()) {
            totalText.setColor(cleverapps.styles.COLORS.COLOR_BONUS);
        }

        var content = new cleverapps.Layout([amountText, separateText, totalText], {
            direction: cleverapps.UI.HORIZONTAL
        });

        this.text.setContentSize(content.getContentSize());
        content.setPositionRound(this.text.width / 2, this.text.height / 2);

        this.text.addChild(content);
    },

    textFitTo: function () {
        var maxW = this.getTextWidth();
        if (this.text.width > maxW) {
            this.text.baseScale = maxW / this.text.width;
            this.text.setScale(this.text.baseScale);
        } else {
            this.text.baseScale = 1;
        }
    },

    addText: function () {
        var text = new cc.Node();
        text.setAnchorPoint2();
        this.addChild(text);
        this.text = text;
        this.updateText(this.getTextValue());
        this.textFitTo();
        text.setPositionRound(this.getTextPosition());
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    MENUBAR_TIMER_TEXT: {
        name: "default",
        size: 32,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.MenuBarItem = cleverapps.overrideStyles(cleverapps.styles.MenuBarItem, {
    timer: {
        icon: {
            x: { align: "left", dx: 31 },
            y: { align: "center", dy: 1 }
        },

        text: {
            x: { align: "left", dx: 68 },
            y: { align: "center", dy: 0 },
            width: 125
        },

        position: {
            x: { align: "center", dx: 16 },
            y: { align: "bottom", dy: -49 }
        },

        padding: {
            x: 40
        },
        height: 59
    }
});
