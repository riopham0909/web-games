/**
 * Created by iamso on 13.12.2019.
 */

var PlayButtonView = cc.Node.extend({
    avoidNode: "PlayButtonView",

    ctor: function (options) {
        this._super();

        this.options = options || {};

        this.isSmall = this.options.isSmall;

        this.noLevelNumber = cleverapps.config.regime === "knockout"
            || cleverapps.meta.getType() === Metha.SHORTMETA
            || cleverapps.meta.getType() === Metha.HOSE && cleverapps.user.isPassedAll()
        || cleverapps.config.type === "blocks";

        this.setAnchorPoint2();
        this.setContentSize2(cleverapps.styles.PlayButtonView);

        this.updatePosition();

        new HidingNode(this, cleverapps.UI.VERTICAL);
        cleverapps.meta.registerControl("play_button", this);

        cleverapps.playButton.on("update", this.update.bind(this), this);
        cleverapps.playButton.on("animatePassLevel", this.animatePassLevel.bind(this), this);

        this.update();
    },

    updatePosition: function () {
        this.setPositionRound(this.calcPosition());
    },

    update: function () {
        this.styling = this.getStyling();

        this.createButton();

        if (!cleverapps.styles.PlayButtonView.button) {
            cleverapps.UI.applyHover(this);
            cleverapps.UI.onClick(this, function () {
                cleverapps.playButton.onClick();
            });
        }
    },

    calcPosition: function () {
        var pos = cleverapps.styles.PlayButtonView;
        pos = pos.positions ? pos.positions[cleverapps.resolution.mode] : pos;

        return pos;
    },

    animatePassLevel: function () {
        if (this.button) {
            this.button.stopAllActions();
        }

        this.show(true);

        if (!this.isSmall && !this.noLevelNumber) {
            var animation = new cleverapps.Spine(bundles.main.jsons.play_button_transition_json);
            this.button.addChild(animation);
            animation.setPositionRound(this.button.width / 2, this.button.height / 2);
            animation.runAction(new cc.Sequence(
                new cc.DelayTime(0.6),
                new cc.CallFunc(function () {
                    animation.setAnimation(0, "animation", false);
                    animation.setCompleteListenerRemove();
                })
            ));
        }

        this.button.runAction(new cc.Sequence(
            this.listAnimationActions()
        ));
    },

    listAnimationActions: function () {
        if (this.noLevelNumber) {
            return [
                new cc.DelayTime(1.1),
                new cc.CallFunc(this.updateTextAndButton.bind(this))
            ];
        }

        var baseScale = this.scale;
        return [
            new cc.DelayTime(1.1),
            new cc.ScaleTo(0.15, baseScale * 1.3),
            new cc.CallFunc(this.updateTextAndButton.bind(this)),
            new cc.PlaySound(bundles.main.urls.play_button_effect),
            new cc.ScaleTo(0.2, baseScale)
        ];
    },

    updateTextAndButton: function () {
        this.styling = this.getStyling();

        this.button.setString(this.getTextMsg());
        this.button.setType(this.styling.type);
    },

    addFinger: function () {
        FingerView.hintClick(this, {
            delay: 5
        });
    },

    createButton: function () {
        var styles = cleverapps.styles.PlayButtonView;

        if (!styles.button) {
            return;
        }

        if (this.button) {
            this.button.removeFromParent();
        }

        var button = this.button = new cleverapps.UI.Button({
            width: styles.width,
            height: styles.height,
            text: this.getTextMsg(),
            type: this.styling.type,
            onClicked: function () {
                cleverapps.playButton.onClick();
            }
        });

        this.addChild(button);
        button.setPositionRound(styles.button);
    },

    getTextMsg: function () {
        if (!cleverapps.isLevels()) {
            return Messages.getLocalized("Play");
        }

        var levelNo = cleverapps.playButton.getLevelNo();

        var level = this.getDisplayedLevel();

        var msg = this.noLevelNumber ? "Play" : "PlayButton.text";
        if (level.isHard() && this.options.hard !== false) {
            msg = "message.hardLevel";
        }
        if (level.isTricky()) {
            msg = "message.trickyLevel";
        }
        if (level.isBonus()) {
            msg = "message.bonusLevel";
        }
        if (this.isSmall) {
            msg = levelNo;
        }

        return Messages.getLocalized(msg, { levelNo: levelNo });
    },

    getDisplayedLevel: function () {
        if (cleverapps.playButton.passedLevel && cleverapps.playButton.previousLevel) {
            return cleverapps.playButton.previousLevel;
        }

        return cleverapps.playButton.currentLevel;
    },

    getStyling: function () {
        var level = this.getDisplayedLevel();
        var styles = cleverapps.styles.PlayButtonView;

        var playButton = {
            button_png: bundles.buttons_main.frames.play_button_png,
            button_on_png: bundles.buttons_main.frames.play_button_on_png
        };

        if (styles.button && styles.button.SKIP_RESOLUTION && styles.button.SKIP_RESOLUTION.padding) {
            playButton.SKIP_RESOLUTION = {
                padding: styles.button.SKIP_RESOLUTION.padding
            };
        }

        if (cleverapps.isLevels() && level.isHard() && !["wordsoup"].includes(cleverapps.config.name)) {
            playButton = Object.assign(playButton, {
                button_png: bundles.buttons.frames.red_button,
                button_on_png: bundles.buttons.frames.red_button_on
            });
        }

        if (cleverapps.isLevels() && level.isTricky() && !["wordsoup"].includes(cleverapps.config.name)) {
            playButton = Object.assign(playButton, {
                button_png: bundles.buttons.frames.blue_button_png,
                button_on_png: bundles.buttons.frames.blue_button_png
            });
        }

        if (cleverapps.isLevels() && level.isBonus() && !["wordsoup"].includes(cleverapps.config.name)) {
            playButton = Object.assign(playButton, {
                button_png: bundles.buttons.frames.blue_button_png,
                button_on_png: bundles.buttons.frames.blue_button_png
            });
        }

        return {
            type: playButton
        };
    }
});

cleverapps.styles.PlayButtonView = {
    width: 300,
    height: 100,
    x: { align: "center" },
    y: { align: "bottom", dy: 150 },

    button: {
        x: { align: "center" },
        y: { align: "center" }
    }
};
