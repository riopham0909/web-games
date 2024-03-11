/**
 * Created by mac on 7/24/17.
 */

var CloversView = cc.Node.extend({
    avoidView: "CloversView",

    ctor: function () {
        this._super();

        this.mission = Game.currentGame.secondaryMission;
        this.setLocalZOrder(10);

        this.withinInfoPanel = cleverapps.config.type === "match3" && cleverapps.config.name !== "adventure";

        this.setAnchorPoint2();

        this.createBackground();

        this.updateSize();

        this.icon = this.createIcon();
        this.text = this.createText();

        Game.currentGame.on("rewardClover", this.createListener(this.runCollectAnimation.bind(this)));
        Game.currentGame.on("showCloverView", this.createListener(this.onShowUpAnimationStart.bind(this)), this);
        Game.currentGame.on("updateCloversTarget", this.createListener(function () {
            this.text.setString(this.getTextString());
            this.toggle(this.controlsVisible);
        }.bind(this)));

        cleverapps.tooltipManager.create(this, {
            text: "CloversTooltip",
            position: cleverapps.config.name === "runes" ? cleverapps.styles.UI.Tooltip.LOCATION.above : cleverapps.styles.UI.Tooltip.LOCATION.below,
            control: "cloversViewTooltip"
        });

        cleverapps.aims.registerTarget("mission_billet" + this.mission.type, this, {
            toggle: this.createListener(function (visible, silent) {
                this.aimVisible = visible;
                this.toggle(cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL ? visible : this.controlsVisible, silent);
            }.bind(this)),
            flyingUnderShadow: true
        });

        this.updatePosition();
    },

    onShowUpAnimationStart: function (silent) {
        if (silent) {
            this.setVisible(true);
            return;
        }
        this.isStartAnimationInProgress = true;
        if (cleverapps.config.name === "runes") {
            this.baseScale = this.getScale();
            this.setVisible(true);
            this.setScale(0);

            var finishAnimation = cleverapps.once(function () {
                if (!this.isStartAnimationInProgress) {
                    return;
                }
                this.runAction(new cc.Sequence(new cc.DelayTime(0.5), new cc.CallFunc(function () {
                    this.runAction(new cc.ScaleTo(0.3, this.baseScale));
                    this.isStartAnimationInProgress = false;
                }.bind(this))));
            }.bind(this));

            this.runAction(new cc.Sequence(new cc.DelayTime(2.5), new cc.CallFunc(finishAnimation)));
        }
    },

    completeAnimationOnResize: function () {
        if (this.isStartAnimationInProgress) {
            this.setScale(this.baseScale === undefined ? 1 : this.baseScale);
            this.isStartAnimationInProgress = false;
        }
    },

    toggle: function (visible, silent) {
        this.controlsVisible = visible;

        if (!this.aimVisible && (cleverapps.config.type === "tile3" && Game.currentGame.clovers === 0
            || cleverapps.config.type !== "match3" && cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL)) {
            visible = false;
        }

        if (visible) {
            this.show && this.show(silent);
        } else {
            this.hide && this.hide(silent);
        }
    },

    updateSize: function () {
        var styles = cleverapps.styles.CloversView;
        this.setContentSize2(styles);
        this.background.setContentSize2(styles);

        this.toggle(this.controlsVisible, true);
    },

    updatePosition: function () {
        var styles = cleverapps.styles.CloversView;
        var position = styles.positions[cleverapps.resolution.mode];
        this.setPositionRound(position);
        this.icon.setPositionRound(styles.icon);
        this.background.setPositionRound(this.width / 2, this.height / 2);
        this.text.setPositionRound(styles.text);
    },

    createBackground: function () {
        var background = this.background = cleverapps.UI.createScale9Sprite(bundles.reward_element.frames.reward_element_bg_png, cleverapps.UI.Scale9Rect.TwoPixelXY);
        this.addChild(background);
        return background;
    },

    createIcon: function () {
        var styles = cleverapps.styles.CloversView;

        var icon = new cc.Sprite(this.mission.getIcon());
        this.addChild(icon);
        cleverapps.UI.fitToBox(icon, styles.icon);
        icon.baseScale = icon.scale;

        return icon;
    },

    createText: function () {
        var styles = cleverapps.styles.CloversView;

        var text = this.text = cleverapps.UI.generateImageText(
            this.getTextString(),
            cleverapps.styles.FONTS.CLOVERS_TEXT
        );
        this.addChild(text);
        text.setPositionRound(styles.text);

        return text;
    },

    getTextString: function () {
        var amount = Game.currentGame.rewards[GameBase.REWARD_SECONDARY];

        if (["differences"].includes(cleverapps.config.type) && Game.currentGame.clovers.length > 0) {
            return amount + "/" + Game.currentGame.clovers.length;
        }

        if (["tile3"].includes(cleverapps.config.type) && Game.currentGame.clovers > 0) {
            return amount + "/" + Game.currentGame.clovers;
        }

        return amount;
    },

    runCollectAnimation: function () {
        this.stopAllActions();

        if (this.mission.type === Mission.TYPE_COMBO && cleverapps.config.name !== "heroes") {
            this.rotateAnimation();
            return;
        }

        this.runAction(new cc.Sequence(
            new cc.PlaySound(bundles.game.urls.tournament_element_collected),
            new cc.ScaleTo(0.15, 1.1),
            new cc.CallFunc(function () {
                this.text.setString(this.getTextString());
            }.bind(this)),
            new cc.ScaleTo(0.15, 1)
        ));
    },

    rotateAnimation: function () {
        this.text.setString(this.getTextString());
        if (this.icon.getRotation() === 0) {
            this.icon.setScale(this.icon.baseScale);
            this.icon.runAction(new cc.Sequence(
                new cc.Spawn(
                    new cc.Sequence(
                        new cc.ScaleTo(0.2, 1.2 * this.icon.baseScale),
                        new cc.ScaleTo(0.2, this.icon.baseScale)
                    ),
                    new cc.RotateBy(0.4, 360)
                ),
                new cc.CallFunc(function () {
                    this.icon.setRotation(0);
                }, this)
            ));
        }
        this.text.stopAllActions();
        this.text.runAction(new cc.Sequence(
            new cc.PlaySound(bundles.main.urls.tournament_element_collected),
            new cc.ScaleTo(0.2, 1.5),
            new cc.ScaleTo(0.2, 1)
        ));
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    CLOVERS_TEXT: {
        name: "default",
        size: 40
    }
});

cleverapps.styles.CloversView = {
    width: 150,
    height: 61,

    positions: [
        {
            x: { align: "left", dx: 40 },
            y: { align: "top", dy: -150 }
        },
        {
            x: { align: "left", dx: 236 },
            y: { align: "top", dy: -150 }
        },
        {
            x: { align: "left", dx: 250 },
            y: { align: "top", dy: -150 }
        }
    ],

    icon: {
        x: { align: "center" },
        y: { align: "center" },

        width: 100,
        height: 100
    },

    text: {
        x: { align: "center", dx: 20 },
        y: { align: "center" }
    }
};
