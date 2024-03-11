/**
 * Created by ivan on 10.04.18.
 */

var ToolbarItemView = cc.Node.extend({
    ctor: function (model) {
        var styles = cleverapps.styles.ToolbarItemView;

        this._super();
        this.model = model;

        var icon = this.icon = new cc.Sprite(model.icon);
        icon.setAnchorPoint2();
        icon.setPositionRound(styles.icon);

        var mark = this.mark = new Attention();
        mark.setScale(styles.mark.baseScale || 1);
        mark.setPositionRound(styles.mark);
        mark.pulse();

        var content = this.content = new cc.Node();
        content.setAnchorPoint2();
        content.setContentSize2(icon.getContentSize());
        content.setPositionRound(content.width / 2, content.height / 2);
        content.addChild(icon);
        content.addChild(mark);

        this.setContentSize2(content.getContentSize());
        this.setAnchorPoint2();
        this.addChild(content);

        cleverapps.UI.applyHover(this, {
            onMouseOver: this.onMouseOver.bind(this)
        });
        cleverapps.UI.onClick(this, this.onClick.bind(this));

        model.onFingerOnListener = this.createListener(this.turnOnFinger.bind(this));
        model.onFingerOffListener = this.createListener(this.turnOffFinger.bind(this));
        model.onChangeStateListener = this.createListener(this.onChangeState.bind(this));
        model.showForce = this.createListener(this.showForce.bind(this));

        this.turnOnFinger();
        this.onChangeState();

        var targetTypes = model.getTargetTypes();
        if (targetTypes) {
            cleverapps.aims.registerTarget(targetTypes, this.content, {
                controls: "toolbar"
            });
        }
    },

    onClick: function () {
        cleverapps.audio.playSound(bundles.main.urls.click_effect);

        if (cleverapps.forces.isRunningForce()) {
            cleverapps.forces.closeRunningForce();
        }

        this.model.onClick();
    },

    turnOnFinger: function () {
        if (!this.model.finger) {
            return;
        }

        this.finger = FingerView.hintClick(this.content, {
            delay: 0.8
        });
    },

    turnOffFinger: function () {
        FingerView.remove(this.finger);
        this.finger = undefined;
    },

    showForce: function () {
        cleverapps.forces.create(this, this.model.getForce());
    },

    updateTimer: function () {
        if (this.timer) {
            this.timer.removeFromParent();
            delete this.timer;
        }

        if (!this.model.countdown || !this.model.countdown.getTimeLeft()) {
            return;
        }

        var styles = cleverapps.styles.ToolbarItemView.timer;

        var timer = this.timer = new cleverapps.CountDownView(this.model.countdown, {
            font: cleverapps.styles.FONTS.TOOLBAR_ITEM_TIMER_TEXT,
            background: {
                frame: bundles.timer.frames.timer_bg_png,
                width: styles.bg.width,
                height: styles.bg.height
            }
        });
        timer.setPosition(this.width / 2 + styles.offsetX, this.height / 2 + styles.offsetY);
        timer.setScale(styles.scale);
        this.content.addChild(timer);
    },

    updateTextReward: function () {
        if (this.reward) {
            this.reward.removeFromParent();
            delete this.reward;
        }

        var text = this.model.getText();

        if (text) {
            var styles = cleverapps.styles.ToolbarItemView.reward;
            var reward = this.reward = new TextWithIcon(text, { font: cleverapps.styles.FONTS.TOOLBAR_ITEM_REWARD_TEXT });
            reward.setPositionRound(styles);
            this.content.addChild(reward);
        }
    },

    grayscale: function () {
        this.icon.setColor(this.model.enabled ? cleverapps.styles.COLORS.GRAY_SCALE_RESTORE_COLOR : cleverapps.styles.COLORS.GRAY_SCALE_COLOR);
    },

    onChangeState: function () {
        if (this.model.grayscaleDisabled) {
            this.grayscale();
        }

        this.mark.setVisible(this.model.marked);

        if (this.model.marked) {
            this.shake();
        }

        this.updateTimer();
        this.updateTextReward();
    },

    shake: function () {
        if (this.shakeInProgress) {
            return;
        }

        this.shakeInProgress = true;

        this.content.runAction(
            new cc.Sequence(
                new cc.DelayTime(Math.floor(Math.random() * 8) + 8),
                new cc.Sequence(
                    new cc.ScaleTo(0.5, 1.2, 0.8),
                    new cc.Spawn(
                        new cc.ScaleTo(0.2, 1, 1),
                        new cc.MoveBy(0.2, 0, 150)
                    ),
                    new cc.MoveBy(0.2, 0, -150),
                    new cc.MoveBy(0.1, 0, 30),
                    new cc.MoveBy(0.1, 0, -30),
                    new cc.CallFunc(function () {
                        this.shakeInProgress = false;
                    }.bind(this))
                )
            )
        );
    },

    onMouseOver: function () {
        if (this.model.enabled) {
            this.setScale((this.baseScale * 1.05) || 1.05);
        }
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    TOOLBAR_ITEM_TIMER_TEXT: {
        name: "default",
        size: 35
    },

    TOOLBAR_ITEM_REWARD_TEXT: {
        size: 26,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.ToolbarItemView = {
    timer: {
        offsetY: -10,
        offsetX: 0,
        scale: 0.6,
        bg: {
            width: 200,
            height: 50
        }
    },

    icon: {
        x: { align: "center" },
        y: { align: "center" }
    },

    mark: {
        x: { align: "center", dx: -30 },
        y: { align: "center", dy: 30 }
    },

    reward: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: 12 }
    }
};
