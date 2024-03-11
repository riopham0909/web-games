/**
 * Created by Daikichi1208 on 24/9/22
 */

var ChestVictoryAnimation = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setAnchorPoint2();
        var styles = cleverapps.styles.ChestVictoryAnimation;

        var animation = this.animation = new cleverapps.Spine(bundles.game.jsons.gold_chest_json, 1.0);
        animation.setAnimation(0, "jump", false);
        animation.setAnchorPoint2();
        this.addChild(animation);

        this.text = cleverapps.UI.generateImageText(Game.currentGame.rewards[GameBase.REWARD_HARD], cleverapps.styles.FONTS.CHEST_REWARD_TEXT);

        var icon = new cc.Sprite(bundles.game.frames.gold_png);

        this.reward = new cleverapps.Layout([this.text, icon], {
            margin: styles.reward.margin,
            direction: cleverapps.UI.HORIZONTAL
        });
        this.addChild(this.reward);
        this.reward.setPosition(styles.reward.position);

        this.reward.setCascadeOpacityEnabledRecursively(true);
        this.reward.setOpacity(0);
        this.reward.runAction(new cc.Sequence(
            new cc.DelayTime(0.4),
            new cc.FadeIn(0.5)
        ));

        cleverapps.audio.playSound(bundles.game.urls.chest_victory_effect);
    },

    getFlyTargetPosition: function () {
        var target = cleverapps.styles.ChestVictoryAnimation.targetAlignment;
        return {
            x: this.animation.width / 2 + target.x,
            y: this.animation.height / 2 + target.y
        };
    },

    animationLeave: function (callback) {
        this.reward.runAction(new cc.Sequence(
            new cc.PlaySound(bundles.game.urls.end_chest_victory_effect),
            new cc.ScaleTo(0.4, 1.8),
            new cc.ScaleTo(0.2, 1),
            new cc.FadeOut(0.1),
            new cc.CallFunc(function () {
                this.animation.setAnimation(0, "leaving", false);
                this.animation.setCompleteListener(function () {
                    cleverapps.audio.playSound(bundles.game.urls.end_collected);
                    this.removeFromParent();
                    callback();
                }.bind(this));
            }.bind(this))
        ));
    },

    addGold: function () {
        this.animation.setAnimation(0, "cards", false);

        this.text.setString(Game.currentGame.rewards[GameBase.REWARD_HARD]);
        this.reward.reshape();

        this.reward.stopAllActions();

        this.reward.runAction(new cc.Sequence(
            new cc.PlaySound(bundles.game.urls.fill_chest_victory_effect, { throttle: 250 }),
            new cc.ScaleTo(0.15, 1.3),
            new cc.ScaleTo(0.15, 1)
        ));
    }
});

cleverapps.styles.ChestVictoryAnimation = {
    reward: {
        position: {
            x: 0,
            y: 230
        },

        margin: 10
    },
    targetAlignment: {
        x: 25,
        y: 80
    },
    chestPosition: {
        x: { align: "center" },
        y: { align: "center" }
    }
};
