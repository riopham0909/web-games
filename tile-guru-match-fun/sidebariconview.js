/**
 * Created by andrey on 19.02.18.
 */

var SideBarIconView = cc.Node.extend({
    ctor: function (model) {
        this.model = model;

        this._super();
        this.setAnchorPoint2();

        this.show();

        model.onShowIconListener = this.createListener(this.showIcon.bind(this));
        model.onUnlockListener = this.createListener(this.unlock.bind(this));

        model.onEnableListener = this.createListener(this.enable.bind(this));
        model.onDisableListener = this.createListener(this.disable.bind(this));

        model.onAttentionOnListener = this.createListener(this.turnOnAttention.bind(this));
        model.onAttentionOffListener = this.createListener(this.turnOffAttention.bind(this));

        model.onFingerOnListener = this.createListener(this.turnOnFinger.bind(this));
        model.onFingerOffListener = this.createListener(this.turnOffFinger.bind(this));

        model.onChangeTitleListener = this.createListener(this.addTitle.bind(this));

        model.onAddLotteryListener = this.createListener(this.addLotteryIcon.bind(this));
        model.onRemoveLotteryListener = this.createListener(this.removeLotteryIcon.bind(this));
        model.onStartTimerListener = this.createListener(this.runTimer.bind(this));
        model.onRemoveTimerListener = this.createListener(this.hideTimer.bind(this));

        if (this.model.animation || this.model.icon) {
            this.showIcon();
        }

        if (this.model.locked) {
            this.setLocked();
        }

        if (this.model.disabled) {
            this.disable();
        }

        if (this.model.attention) {
            this.turnOnAttention();
        }

        if (this.model.finger) {
            this.turnOnFinger();
        }

        if (this.model.title) {
            this.addTitle();
        }

        if (this.model.leftTime > 0) {
            this.runTimer();
        }

        if (this.model.lottery) {
            this.addLotteryIcon();
        }

        cleverapps.UI.onClick(this, function () {
            this.onPressed();
        }.bind(this));
        cleverapps.UI.applyHover(this);

        var targetTypes = this.model.getTargetTypes();
        if (targetTypes) {
            cleverapps.aims.registerTarget(targetTypes, this, {
                controls: this.model.control
            });
        }
    },

    addLotteryIcon: function () {
        this.removeLotteryIcon();

        if (this.timerView) {
            Lottery.addIcon(this.timerView, "iconTimer");
        } else {
            Lottery.addIcon(this, "icon");
        }
    },

    removeLotteryIcon: function () {
        if (this.lotteryIcon) {
            this.lotteryIcon.removeFromParent();
        }
    },

    onPressed: function () {
        if (cleverapps.forces.isRunningForce()) {
            cleverapps.forces.closeRunningForce();
        }

        cleverapps.audio.playSound(bundles.main.urls.click_effect);

        var tip = this.model.getToolTip();
        if (tip) {
            cleverapps.tooltipManager.onClick(this, tip);
            return;
        }

        this.model.onPressed();
    },

    showForce: function () {
        cleverapps.forces.create(this, this.model.getForce());
    },

    setSize: function (size) {
        this.setContentSize2(size);
        this.setContentSize2(size);
        this.setPositionRound(this.width / 2, this.height / 2);
    },

    showIcon: function () {
        if (this.icon) {
            this.icon.removeFromParent();
        }

        if (this.model.icon) {
            var GeneratorFunction = this.model.icon;
            var icon = this.icon = GeneratorFunction();
            cleverapps.UI.fitToBox(icon, {
                width: this.width * 0.7,
                height: this.height * 0.7,
                maxScale: 1.2
            });
            icon.setPositionRound(this.iconNode.width / 2, this.iconNode.height / 2);
            this.iconNode.addChild(icon);
        } else if (this.model.animation) {
            var animation = this.icon = new cleverapps.Spine(this.model.animation);
            animation.setPositionRound(this.iconNode.width / 2, this.iconNode.height / 2);
            this.iconNode.addChild(animation);

            var resetAnimation = function () {
                animation.runAction(
                    new cc.Sequence(
                        new cc.DelayTime(cleverapps.Random.mathChoose(SideBarIconView.RANDOM_ANIMATION_INTERVALS)),
                        new cc.CallFunc(function () {
                            animation.setAnimation(0, "animation", false);
                        })
                    )
                );
            };
            if (this.model.skin) {
                animation.setSkin(this.model.skin);
            }
            animation.setAnimation(0, "animation", false);
            if (!this.model.locked) {
                animation.setCompleteListener(resetAnimation);
            }
        }
    },

    show: function () {
        var styles = cleverapps.styles.SideBarIconView;

        var image = cleverapps.skins.getSlot("sidebarBg") || bundles.sidebar.frames.icon_bg;
        var bg = this.bg = cleverapps.UI.createScale9Sprite(image);

        if (styles.bg && styles.bg.width) {
            bg.setContentSize(styles.bg);
        }

        SceneDecors.add(bg, cleverapps.skins.getSlot("sidebarIcon"));

        this.addChild(bg);
        bg.setPositionRound(bg.width / 2, bg.height / 2);
        this.setSize(bg.getContentSize());

        var iconNode = this.iconNode = new cc.Node();
        iconNode.setAnchorPoint2();
        iconNode.setContentSize2(this.getContentSize());
        iconNode.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(iconNode);
    },

    setLocked: function () {
        var styles = cleverapps.styles.SideBarIconView;

        if (styles.lock.color) {
            if (this.icon && this.icon.spine) {
                this.icon.spine.setColor(styles.lock.color);
            }
        } else if (styles.lock.greyscale) {
            if (this.icon && this.icon.spine) {
                cleverapps.UI.convertToGrayScale(this.icon.spine);
            }
        }

        var lock = this.lock = new cc.Sprite(bundles.sidebar.frames.lock);
        this.addChild(lock, 1);
        lock.setPositionRound(styles.lock);
    },

    unlock: function () {
        this.lock.removeFromParent();

        this.bg.setColor(cleverapps.styles.COLORS.WHITE);
        if (this.icon && this.icon.spine) {
            this.icon.spine.setColor(cleverapps.styles.COLORS.WHITE);
            cleverapps.UI.convertToGrayScale(this.icon.spine, true);
        }
    },

    enable: function () {
        if (this.icon && this.icon.spine) {
            this.icon.spine.setColor(cleverapps.styles.COLORS.WHITE);
        }
    },

    disable: function () {
        if (this.icon && this.icon.spine) {
            this.icon.spine.setColor(new cc.Color(130, 130, 130, 200));
        }
    },

    addTitle: function () {
        if (this.text) {
            this.text.removeFromParent();
            delete this.text;
        }
        if (this.textBg) {
            this.textBg.removeFromParent();
            delete this.textBg;
        }

        if (this.model.title === undefined) {
            return;
        }

        var styles = cleverapps.styles.SideBarIconView.text;

        var bg = this.textBg = this.getTitleBg();
        bg.setPositionRound(styles);
        this.addChild(bg);

        this.text = cleverapps.UI.generateTTFText(this.model.title, cleverapps.styles.FONTS.SIDEBAR_ICON_TEXT);
        this.text.setPositionRound(bg.width / 2, bg.height / 2 + styles.offsetY);

        var textSize = this.getTitleTextSize();
        this.text.fitTo(textSize.width, textSize.height);
        this.text.baseScale = this.text.scale;
        bg.addChild(this.text);
    },

    runTimer: function () {
        this.hideTimer();

        var timer = this.timer = new cleverapps.CountDown(this.model.leftTime, {
            onFinish: function () {
                this.model.resetState();
            }.bind(this)
        });

        var styles = cleverapps.styles.SideBarIconView.text;
        var timerViewParams = {
            font: cleverapps.styles.FONTS.SIDEBAR_ICON_TEXT,
            timerPosition: { x: 0, y: styles.offsetY }
        };

        var bg = this.getTitleBg();
        if (bg) {
            timerViewParams.background_content = bg;
        }

        var textTimer = this.timerView = new cleverapps.CountDownView(timer, timerViewParams);

        var textSize = this.getTitleTextSize();
        textTimer.fitTo(textSize.width, textSize.height);
        textTimer.baseScale = textTimer.scale;

        this.addChild(textTimer);
        textTimer.setPositionRound(styles);
    },

    getTitleBg: function () {
        var styles = cleverapps.styles.SideBarIconView.text;
        var background = cleverapps.UI.createScale9Sprite(bundles.sidebar.frames.icon_text_bg, cleverapps.UI.Scale9Rect.TwoPixelXY);
        background.setContentSize2(styles.width, styles.height);

        if (this.model.titleIcon) {
            var icon = new cc.Sprite(this.model.titleIcon);
            background.addChild(icon);
            icon.setPositionRound(styles.titleIcon);
        }

        return background;
    },

    getTitleTextSize: function () {
        var styles = cleverapps.styles.SideBarIconView.text;
        return {
            width: styles.width * 0.86,
            height: styles.height * 0.86
        };
    },

    hideTimer: function () {
        if (this.timer) {
            this.timer.remove();
            delete this.timer;
        }

        if (this.timerView) {
            this.timerView.removeFromParent();
            delete this.timerView;
        }
    },

    showAttentionAnimation: function () {
        if (!this.mark || this.attentionJumped || cleverapps.meta.isFocused()) {
            return;
        }
        this.mark.jump();
        this.attentionJumped = true;
    },

    turnOnAttention: function () {
        if (!this.mark) {
            var mark = this.mark = new Attention();
            mark.setPositionRound(cleverapps.styles.SideBarIconView.mark);
            this.addChild(mark);
        }
        this.attentionJumped = false;
        this.showAttentionAnimation();
    },

    turnOffAttention: function () {
        this.mark.removeFromParent();
        delete this.mark;
    },

    turnOnFinger: function () {
        this.finger = FingerView.hintClick(this, {
            delay: 0.8
        });
    },

    turnOffFinger: function () {
        FingerView.remove(this.finger);
        this.finger = undefined;
    },

    getModel: function () {
        return this.model;
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    SIDEBAR_ICON_TEXT: {
        name: "default",
        size: 40
    }
});

cleverapps.styles.SideBarIconView = {
    lock: {
        color: new cc.Color(130, 130, 130, 200),
        x: { align: "right", dx: 0 },
        y: { align: "bottom", dy: 0 }
    },

    text: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: 0 },
        width: 148,
        height: 56,
        offsetY: 0,

        titleIcon: {
            x: { align: "left", dx: -45 },
            y: { align: "center", dy: 0 }
        }
    },

    mark: {
        x: { align: "right", dx: -5 },
        y: { align: "top", dy: -5 }
    }
};

SideBarIconView.RANDOM_ANIMATION_INTERVALS = [5, 7, 9, 11, 12];
