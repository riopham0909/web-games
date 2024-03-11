/**
 * Created by Andrey Popov on 10.09.20
 */

var CoinsRewardView = cc.Node.extend({
    ctor: function (options) {
        this._super();
        this.setAnchorPoint2();

        this.options = Object.assign({}, cleverapps.styles.CoinsRewardView, options);
    },

    collectCoins: function (reward) {
        var coins = [];
        (this.options.coins || cleverapps.styles.CoinsRewardView.coins).forEach(function (params) {
            coins = coins.concat(this.drawCoinsInCircle(params));
        }.bind(this));

        if (reward) {
            var text = cleverapps.UI.generateTTFText("+" + reward, cleverapps.styles.FONTS.COINS_REWARD_TEXT);
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            text.setPositionRound(this.width / 2, this.height / 2);
            text.setScale(this.options.text.scale / 2);
            text.setLocalZOrder(1000001);
            this.addChild(text);

            text.replaceParentSamePlace(cleverapps.scenes.getRunningScene());

            text.opacity = 0;
            text.runAction(new cc.Sequence(
                new cc.FadeIn(0.2),
                new cc.ScaleTo(this.options.showTextTime || CoinsRewardView.SHOW_TEXT_TIME, this.options.text.scale),
                new cc.FadeOut(0.2),
                new cc.RemoveSelf()
            ));
        }

        var target = this.options.target || cleverapps.aims.getTarget(["rewardHard", "hard"]);

        coins.sort(function (a, b) {
            return a.getPositionX() - b.getPositionX();
        }).forEach(function (coin, index) {
            coin.replaceParentSamePlace(cleverapps.scenes.getMovingNode());

            coin.runAction(new cc.Sequence(
                new cc.DelayTime(CoinsRewardView.APPEAR_TIME + index * 0.01),
                new cc.CallFunc(function () {
                    cleverapps.aims.showTarget(target);
                }),
                new cc.Spawn(
                    new cc.CollectAnimation(CoinsRewardView.COLLECT_COIN_TIME, target, {
                        jump: true
                    }),
                    new cc.RotateBy(CoinsRewardView.COLLECT_COIN_TIME, 180)
                ),
                new cc.RemoveSelf()
            ));
        });

        var sparkAnimation = new cleverapps.Spine(bundles.game.jsons.coins_reward_json);
        sparkAnimation.setAnimation(0, "animation", false);
        sparkAnimation.setPositionRound(this.width / 2, this.height / 2);
        this.addChild(sparkAnimation);

        this.runAction(new cc.Sequence(
            new cc.DelayTime(2),
            new cc.RemoveSelf()
        ));
    },

    drawCoinsInCircle: function (params) {
        var coins = [];

        for (var i = 0; i < params.count; i++) {
            var coin = new cc.Sprite(bundles.menubar.frames.gold_png);

            coin.setRotation((Math.random() - 0.5) * 120);
            coin.setScale(0);
            coin.setLocalZOrder(1000000);

            var angle = 2 * Math.PI * i / params.count;

            var baseAngle = (params.baseAngle || 0) * Math.PI / 180;
            var posX = params.radiusX * Math.cos(angle + baseAngle);
            var posY = params.radiusY * Math.sin(angle + baseAngle);

            posX += (Math.random() - 0.5) * 0.5 * posX;
            posY += (Math.random() - 0.5) * 0.5 * posY;

            coin.setPosition(this.width / 2 + posX, this.height / 2 + posY);
            coin.runAction(new cc.Spawn(
                new cc.MoveBy(CoinsRewardView.APPEAR_TIME, cc.p(posX * 0.2, posY * 0.2)),
                new cc.ScaleTo(CoinsRewardView.APPEAR_TIME, params.scale)
            ));

            this.addChild(coin);
            coins.push(coin);
        }

        return coins;
    }
});

cleverapps.overrideStyles(cleverapps.styles.DECORATORS, {
    COINS_TEXT_STROKE: {
        size: 3,
        color: cleverapps.styles.COLORS.COINS_REWARD_STROKE_COLOR
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    COINS_REWARD_TEXT: {
        size: 120,
        color: cleverapps.styles.COLORS.COINS_REWARD_YELLOW,
        stroke: cleverapps.styles.DECORATORS.COINS_TEXT_STROKE
    }
});

CoinsRewardView.APPEAR_TIME = 0.4;
CoinsRewardView.SHOW_TEXT_TIME = 1.2;
CoinsRewardView.COLLECT_COIN_TIME = 0.5;

cleverapps.styles.CoinsRewardView = {
    text: {
        scale: 1
    },
    coins: [
        {
            radiusX: 80,
            radiusY: 80,
            count: 6,
            scale: 1
        }
    ]
};