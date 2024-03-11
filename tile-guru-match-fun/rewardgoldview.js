/**
 * Created by mac on 7/24/17.
 */

var RewardGoldView = cc.Node.extend({
    ctor: function () {
        this._super();

        this.setAnchorPoint2();

        this.createBackground();

        this.updateSize();

        this.icon = this.createIcon();
        this.text = this.createText();

        Game.currentGame.on("rewardHard", this.createListener(this.runCollectAnimation.bind(this)));

        cleverapps.tooltipManager.create(this, {
            text: "RewardGoldTooltip",
            position: cleverapps.styles.UI.Tooltip.LOCATION.below
        });

        cleverapps.aims.registerTarget("rewardHard", this, {
            controls: "rewardElementGold",
            toggle: this.createListener(function (visible, silent) {
                this.aimVisible = visible;
                this.toggle(this.controlsVisible, silent);
            }.bind(this)),
            flyingUnderShadow: true
        });

        this.updatePosition();
    },

    toggle: function (visible, silent) {
        this.controlsVisible = visible;

        if (!this.aimVisible && cleverapps.resolution.mode === cleverapps.WideMode.VERTICAL) {
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
        var styles = cleverapps.styles.RewardGoldView;
        this.setPositionRound(styles);
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
        var icon = new cleverapps.Spine(bundles.card.jsons.marks_json);
        icon.setAnimation(0, "coin_idle_counter", true);
        this.addChild(icon);
        return icon;
    },

    createText: function () {
        var text = cleverapps.UI.generateImageText(
            Game.currentGame.rewards[GameBase.REWARD_HARD],
            cleverapps.styles.FONTS.HARD_REWARD_TEXT
        );
        this.addChild(text);
        return text;
    },

    runCollectAnimation: function () {
        this.stopAllActions();
        this.runAction(new cc.Sequence(
            new cc.PlaySound(bundles.reward_element.urls.reward_gold_effect),
            new cc.ScaleTo(0.15, 1.1),
            new cc.CallFunc(function () {
                this.text.setString(Game.currentGame.rewards[GameBase.REWARD_HARD]);
            }.bind(this)),
            new cc.ScaleTo(0.15, 1)
        ));
    }

});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    HARD_REWARD_TEXT: {
        name: "default",
        size: 40
    }
});

cleverapps.styles.RewardGoldView = {
    width: 150,
    height: 61,

    x: { align: "left", dx: 60 },
    y: { align: "top", dy: -150 },

    icon: {
        x: 20,
        y: 40
    },

    text: {
        x: { align: "center", dx: 20 },
        y: { align: "center", dy: 2 }
    }
};
