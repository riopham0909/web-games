/**
 * Created by r4zi4l on 13.05.2021
 */

var PassRewardIcon = cc.Node.extend({
    ctor: function (options) {
        this._super();
        this.options = options = options || {};
        this.setAnchorPoint2();

        if (options.prefix === undefined) {
            options.prefix = "x";
        }

        switch (options.type) {
            case "hard": case "rubies":
                this.initWithSprite(bundles.reward_icons.frames.reward_gold_png, options.prefix + options.value);
                break;

            case "exp":
                this.initWithSprite(bundles.reward_icons.frames.reward_exp_png, options.prefix + options.value);
                break;

            case "coins":
                this.initWithSprite(bundles.reward_icons.frames.reward_coin_png, options.prefix + options.value);
                break;

            case "lives": case "energy":
                this.initWithSprite(bundles.reward_icons.frames.reward_energy_png, options.prefix + options.value);
                break;

            case "unlimitedLives":
                this.initWithSprite(bundles.reward_icons.frames.life_unlim, Product.FormatTimePeriod(options.value).title);
                break;

            case "boosters":
                var boosterType = Object.keys(options.value)[0];
                this.initWithSprite(RewardTypes.boosters.icon[boosterType], options.prefix + options.value[boosterType]);
                break;

            case "wands":
                this.initWithSprite(bundles.reward_icons.frames.reward_wand_png, options.prefix + options.value);
                break;

            case "worker":
                options.value = Product.FormatTimePeriod(options.value);
                this.initWithSprite(bundles.reward_icons.frames.reward_worker_png, options.value.title, { amount: options.value.amount });
                break;

            case "unit":
                this.initWithUnit(options.value, options.prefix);
                this.rewardName = cleverapps.unitsLibrary.getUnitName(options.value, true) + " x" + options.value.amount;
                break;
        }
    },

    initWithSprite: function (image, text, textToReplace) {
        this.initWithNode(new cc.Sprite(image), text, textToReplace);
    },

    initWithUnit: function (unit, prefix) {
        var image = UnitView.getUnitImage(unit, { preferStatic: true });

        if (image) {
            if (image.clearTrack) {
                image.clearTrack(0);
            }
            image.setAnchorPoint2();
            this.initWithNode(image, prefix + unit.amount);
        }
    },

    initWithNode: function (icon, msg, textToReplace) {
        var options = this.options;
        var styles = cleverapps.styles.PassRewardIcon;

        this.setContentSize2(styles.icon);

        this.icon = icon;
        cleverapps.UI.fitToBox(icon, {
            width: styles.icon.width,
            height: styles.icon.height,
            maxScale: options.premium ? styles.icon.prem.scale : styles.icon.free.scale
        });
        icon.setPositionRound(styles.icon);
        this.addChild(icon);

        var font = options.font || cleverapps.styles.FONTS.PASS_REWARD_TEXT;
        if (cleverapps.UI.ImageFont.IsApplicable(font, msg)) {
            this.text = cleverapps.UI.generateImageText(msg, font, textToReplace);
        } else {
            this.text = cleverapps.UI.generateOnlyText(msg, font, textToReplace);
        }

        this.text.setPositionRound(styles.text);
        this.text.setLocalZOrder(1);
        this.addChild(this.text);
    },

    setDiscolor: function (toggle) {
        if (toggle) {
            this.icon.setOpacity(120);
            this.icon.setColor(new cc.Color(0, 150, 255, 255));

            this.text.setOpacity(120);
            this.text.setScale(0.8);
        } else {
            this.icon.setOpacity(255);
            this.icon.setColor(new cc.Color(255, 255, 255, 255));

            this.text.setScale(1);
            this.text.setOpacity(255);
        }
    },

    setAttention: function (image) {
        var styles = cleverapps.styles.PassRewardIcon.attention;

        if (this.attention) {
            this.attention.removeFromParent();
            delete this.attention;
        }

        if (image) {
            var attention = this.attention = new cc.Sprite(image);
            attention.setPositionRound(styles);
            this.addChild(attention);
        }
    },

    setShining: function (toggle) {
        var styles = cleverapps.styles.PassRewardIcon.shining;

        if (this.shining) {
            this.shining.removeFromParent();
            delete this.shining;
        }

        if (toggle) {
            var shining = this.shining = new cleverapps.Spine(bundles.reward_icons_pass.jsons.prize_shining_json, styles.scale);
            shining.setAnimation(0, styles.animation, true);
            shining.setPositionRound(styles);
            shining.setLocalZOrder(-1);
            this.addChild(shining);
        }
    },

    setFlying: function (toggle, passLogic) {
        var styles = cleverapps.styles.PassRewardIcon.flying;

        if (this.flyingAction) {
            this.stopAction(this.flyingAction);
            delete this.flyingAction;
        }

        if (toggle) {
            this.flyingAction = this.runAction(new cc.Sequence(
                new cc.DelayTime(Math.random() * 1.5),
                new cc.CallFunc(function () {
                    this.flyingAction = this.runAction(new cc.RepeatForever(new cc.Sequence(
                        new cc.CallFunc(function () {
                            this.icon.runAction(new cc.Sequence(
                                new cc.MoveBy(3, 0, styles.offsetY),
                                new cc.CallFunc(function () {
                                    if (Math.random() < 0.7 / passLogic.countAvailableRewards()) {
                                        this.icon.runAction(new cc.Sequence(
                                            new cc.RotateBy(0.25, 10),
                                            new cc.RotateBy(0.25, -10),
                                            new cc.RotateBy(0.25, 10),
                                            new cc.RotateBy(0.25, -10)
                                        ));
                                    }
                                }, this),
                                new cc.MoveBy(1.5, 0, -styles.offsetY)
                            ));
                        }, this),
                        new cc.DelayTime(4.5)
                    )));
                }, this)
            ));
        }
    },

    setClaimable: function (toggle, disable, passLogic) {
        this.setClaimButton(toggle, disable, passLogic);

        if (toggle && !disable) {
            cleverapps.UI.onClick(this, this.claimReward.bind(this, passLogic));
        }
    },

    setClaimButton: function (toggle, disable, passLogic) {
        if (this.claimButton) {
            this.claimButton.removeFromParent();
            this.claimButton = undefined;
        }

        if (toggle) {
            var styles = cleverapps.styles.PassRewardIcon.claimButton;

            var claimButton = this.claimButton = new cleverapps.UI.Button({
                type: cleverapps.styles.UI.Button.Images.small_button_green,
                width: styles.width,
                height: styles.height,
                text: "Claim",
                onClicked: this.claimReward.bind(this, passLogic)
            });
            claimButton.setAnchorPoint2();
            claimButton.setPositionRound(styles);
            this.addChild(claimButton);

            if (disable) {
                claimButton.disable();
            }
        }
    },

    updateState: function (passLogic, level) {
        var state;

        if (this.options.level < level) {
            if (passLogic.hasReward(this.options.level, this.options.premium)) {
                if (this.options.premium && !passLogic.hasPremium()) {
                    state = "premium_required";
                } else {
                    state = "fresh";
                }
            } else {
                state = "gained";
            }
        }

        cc.eventManager.removeListeners(this);

        this.setDiscolor(false);
        this.setAttention();
        this.setShining(false);
        this.setFlying(false);
        this.setClaimable(false);

        switch (state) {
            case "premium_required":
                this.setClaimable(true, false, passLogic);
                break;

            case "fresh":
                this.setShining(true);
                this.setFlying(true, passLogic);
                this.setClaimable(true, false, passLogic);
                break;

            case "gained":
                this.setAttention(bundles.reward_icons_pass.frames.prize_checkmark_png);
                break;

            default:
                this.setDiscolor(true);
                cleverapps.tooltipManager.create(this, {
                    text: "PassWindow.moreItemsToolTip." + passLogic.mission.collectItemName,
                    position: cleverapps.styles.UI.Tooltip.LOCATION.above
                });
        }
    },

    openAnimation: function () {
        this.runAction(new cc.Sequence(
            new cc.ScaleTo(0.2, 1.2),
            new cc.ScaleTo(0.2, 1)
        ));

        if (this.claimButton) {
            this.claimButton.setVisible(false);
            this.claimButton.runAction(new cc.Sequence(
                new cc.DelayTime(0.4),
                new cc.Show()
            ));
        }
    },

    claimReward: function (passLogic) {
        if (passLogic.shownProgress.level < this.options.level) {
            return;
        }

        if (this.options.premium && !passLogic.hasPremium()) {
            new PassBuyTicketWindow(passLogic);
            return;
        }

        var prize = passLogic.takeLevelReward(this.options.level, this.options.premium);
        if (!prize) {
            return;
        }

        if (passLogic.checkComplete()) {
            var currentWindow = cleverapps.windows.currentWindow();
            currentWindow.close();
        }

        new RewardWindow(prize, {
            toMainWorld: passLogic.mission.mainWorldReward
        });
    },

    getPreferredBundles: function () {
        if (cleverapps.config.type === "merge") {
            return ["units"];
        }
        return this._super();
    }
});

PassRewardIcon.createIconsFromRewardsList = function (rewards, level, premium) {
    var icons = [];

    for (var type in rewards) {
        var reward = rewards[type];

        if (type === "unit") {
            reward = cleverapps.toArray(reward);
            for (var i = 0; i < reward.length; ++i) {
                var icon = new PassRewardIcon({
                    type: type,
                    value: reward[i],
                    level: level,
                    premium: premium
                });

                icons.push(icon);
            }
        } else {
            icons.push(new PassRewardIcon({
                type: type,
                value: reward,
                level: level,
                premium: premium
            }));
        }
    }
    return icons;
};

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    PASS_REWARD_TEXT: {
        size: 40,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.PassRewardIcon = {
    icon: {
        x: { align: "center", dx: 0 },
        y: { align: "center", dy: 0 },
        width: 180,
        height: 180,
        free: { scale: 1.1 },
        prem: { scale: 1.2 }
    },

    text: {
        x: { align: "right", dx: 0 },
        y: { align: "bottom", dy: -2 }
    },

    attention: {
        x: { align: "center", dx: 0 },
        y: { align: "bottom", dy: -60 }
    },

    shining: {
        x: { align: "center", dx: -8 },
        y: { align: "center", dy: 0 },
        animation: "idle",
        scale: 1.2
    },

    flying: {
        offsetY: 8
    },

    claimButton: {
        width: 170,
        height: 60,
        x: { align: "center" },
        y: { align: "bottom", dy: -75 }
    }
};
