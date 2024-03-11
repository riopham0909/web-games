/**
 * Created by vladislav on 08.10.2019
 */

var RewardsListComponent = cc.Node.extend({
    ctor: function (reward, options) {
        this._super();

        this.reward = reward instanceof RewardsList ? reward : new RewardsList(reward, options);
        this.options = options || {};

        this.createContent();
        if (!options.noShowControls) {
            cleverapps.meta.showControlsWhileFocused(this.reward.listControls());
        }
    },

    createContent: function () {
        var styles = cleverapps.styles.RewardsListComponent;

        var targets = this.targets = [];

        this.reward.listRewards().forEach(function (reward) {
            if (reward.getAmount()) {
                targets.push(this.createOneReward(reward));
            }
        }, this);

        this.content = new cleverapps.WrapGridLayout(targets, {
            columns: this.options.columns || this.calcColumnsCount(targets.length),
            margin: {
                x: this.options.margin && this.options.margin.x !== undefined ? this.options.margin.x : styles.margin.x,
                y: this.options.margin && this.options.margin.y !== undefined ? this.options.margin.y : styles.margin.y
            }
        });

        this.addChild(this.content);
        this.setContentSize2(this.content);
        this.setAnchorPoint2();
        this.content.setAnchorPoint2();
        this.content.setPositionRound(this.width / 2, this.height / 2);
    },

    createIcon: function (reward) {
        var icon;
        if (this.options.small) {
            icon = reward.getSmallIcon();
        } else {
            icon = reward.getIcon();
        }

        return icon;
    },

    createOneReward: function (reward) {
        var styles = cleverapps.styles.RewardsListComponent;

        var icon = this.createIcon(reward);
        var prefix = this.options.noPrefix ? "" : "x";
        var text = cleverapps.UI.generateTTFText(reward.getText(prefix), this.options.font || cleverapps.styles.FONTS.REWARDS_LIST_TEXT || cleverapps.styles.FONTS.WINDOW_TEXT);

        if (this.options.iconWrap) {
            cleverapps.UI.fitToBox(icon, {
                height: this.options.iconWrap.height,
                maxScale: icon.scale
            });

            var iconWrap = new cc.Node();
            iconWrap.setAnchorPoint2();
            iconWrap.setContentSize(this.options.iconWrap.width || icon.width * icon.scale, this.options.iconWrap.height || icon.height * icon.scale);

            iconWrap.addChild(icon);
            icon.setPositionRound(iconWrap.width / 2, iconWrap.height / 2);
        }

        if (this.options.textWrap) {
            var textWrap = new cc.Node();
            textWrap.setAnchorPoint2();
            textWrap.setContentSize(this.options.textWrap);

            textWrap.addChild(text);
            text.setPositionRound(textWrap.width / 2, textWrap.height / 2);
        }

        var target = new cleverapps.Layout([iconWrap || icon, textWrap || text], {
            direction: this.options.textDirection !== undefined ? this.options.textDirection : cleverapps.UI.VERTICAL,
            margin: this.options.textMargin !== undefined ? this.options.textMargin : styles.textMargin
        });
        target.icon = icon;
        target.text = text;
        target.reward = reward;

        if (this.options.shine) {
            var animation = target.shine = new cleverapps.Spine(bundles.main.jsons.reward_shine_json);
            animation.setAnimationAndIdleAfter("open", "idle");
            animation.setPositionRound(styles.shine);
            animation.setLocalZOrder(-1);
            target.addChild(animation);
        }

        if (reward.type === "units") {
            target.getPreferredBundles = function () {
                return ["units"];
            };
        }

        return target;
    },

    showUp: function () {
        var styles = cleverapps.styles.RewardsListComponent.showUp;
        this.targets.forEach(function (target) {
            if (target.shine) {
                target.shine.setVisible(false);
            }

            target.setCascadeOpacityEnabledRecursively(true);
            target.setOpacity(0);
            target.setPositionRound(target.x, target.y - styles.startOffsetY);

            target.runAction(new cc.Spawn(
                new cc.Spawn(
                    new cc.MoveBy(0.6, 0, styles.startOffsetY).easing(cc.easeOut(2)),
                    new cc.FadeIn(0.6).easing(cc.easeIn(2))
                ),
                new cc.Sequence(
                    new cc.DelayTime(0.7),
                    new cc.CallFunc(function () {
                        if (target.shine) {
                            target.shine.setVisible(true);
                            target.shine.setAnimationAndIdleAfter("open", "idle");
                        }
                    })
                )
            ));
        });
    },

    receiveRewards: function () {
        this.reward.receiveRewards();
    },

    receiveRewardsAnimation: function (options) {
        options = options || {};

        var callback = cleverapps.wait(this.targets.length, options.callback || function () {});

        cleverapps.audio.playSound(bundles.main.urls.win_reward_effect);
        this.targets.forEach(function (target, index) {
            if (target.shine) {
                target.shine.runAction(new cc.Sequence(
                    new cc.DelayTime(index * 0.3),
                    new cc.CallFunc(target.shine.setAnimation.bind(target.shine, 1, "close", false))
                ));
            }

            if (target.text && !options.noFadeOut) {
                target.text.setCascadeOpacityEnabledRecursively(true);
                target.text.runAction(new cc.Sequence(
                    new cc.DelayTime(index * 0.3),
                    new cc.FadeOut(0.75)
                ));
            }

            target.icon.setLocalZOrder(this.targets.length - index);
            target.reward.collectRewardsAnimation(target.icon, {
                delay: index * 300,
                callback: callback,
                beginScale: target.icon.adjustScaleTo(cleverapps.scenes.getMovingNode(target.icon)).y,
                hideSource: !options.noFadeOut,
                small: Boolean(this.options.small)
            });
        }.bind(this));
    },

    calcColumnsCount: function (rewardsCount) {
        if (rewardsCount <= 3) {
            return rewardsCount;
        }

        if (cleverapps.resolution.mode === cleverapps.WideMode.HORIZONTAL) {
            return 4;
        }

        if (rewardsCount === 4 && cleverapps.resolution.mode !== cleverapps.WideMode.HORIZONTAL) {
            return 2;
        }

        return 3;
    }
});

cleverapps.styles.RewardsListComponent = {
    margin: {
        x: 30,
        y: 30
    },
    shine: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 40 }
    },
    showUp: {
        startOffsetY: 25,
        floatingOffset: 4
    },
    textMargin: 10
};
