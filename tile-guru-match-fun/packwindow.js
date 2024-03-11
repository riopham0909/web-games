/**
 * Created by andrey on 22.08.17.
 */

var PackWindow = Window.extend({
    onWindowLoaded: function () {
        var pack = cleverapps.packManager.get();
        cleverapps.packManager.updateShowTime();

        var styles = cleverapps.styles.PackWindow;

        var button = styles.button;
        button.text = pack.getCurrentPrice();
        button.onPressed = function () {
            this.buyPackProduct();
        }.bind(this);

        var content = this.generateContent(pack);

        this._super({
            name: "packwindow",
            title: styles.title ? {
                text: pack.title,
                margin: { x: 0, y: styles.title.margin.y },
                font: cleverapps.styles.FONTS.PACKWINDOW_TITLE_TEXT
            } : "",
            content: content,
            button: button,
            styles: styles,
            notCloseByTouchInShadow: true,
            closeButtonDelay: true
        });

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.PACKWINDOW_OPENED);

        Lottery.addIcon(this.buttons);
        Lottery.addText(this);

        if (styles.button.delay) {
            this.buttons.setVisible(false);
            this.buttons.setScale(0);
            this.buttons.runAction(new cc.Sequence(
                new cc.DelayTime(styles.button.delay),
                new cc.Show(),
                new cc.ScaleTo(0.2, 1)
            ));
        }
    },

    getPerson: function () {
        return cleverapps.config.type === "merge" && {
            role: "king",
            emotion: "happy"
        };
    },

    onShow: function () {
        this._super();

        var styles = cleverapps.styles.PackWindow;
        var content = this.content;

        this.runAction(new cc.Sequence(
            new cc.DelayTime(0.1),
            new cc.PlaySound(bundles.starter_pack.urls.starter_pack_effect)
        ));

        if (content.rewards) {
            content.rewards.children.forEach(function (node) {
                node.setOpacity(0);
                node.runAction(new cc.Sequence(
                    new cc.DelayTime(styles.rewards.delay || 0),
                    new cc.FadeIn(styles.rewards.duration || 0)
                ));
            });
        }

        if (content.discountLabel) {
            content.discountLabel.setOpacity(0);
            content.discountLabel.runAction(new cc.Sequence(
                new cc.DelayTime(styles.discountLabel.delay || 0),
                new cc.FadeIn(styles.discountLabel.duration || 0)
            ));
        }

        if (content.title) {
            content.title.setOpacity(0);
            content.title.runAction(new cc.Sequence(
                new cc.DelayTime(styles.Title.delay || 0),
                new cc.FadeIn(styles.Title.duration || 0)
            ));
        }
    },

    generateContent: function (pack) {
        var styles = cleverapps.styles.PackWindow;

        var content = this.content = new cc.Node();
        content.setAnchorPoint2();
        content.setPositionRound({ align: "center" }, { align: "center" });

        if (styles.animation) {
            content.animation = this.generateAnimation(pack, styles.animation);
            content.setContentSize2(content.animation.getContentSize());
            content.addChild(content.animation);
        }

        if (styles.rewards) {
            content.rewards = this.generateRewards(pack, styles.rewards);
            content.addChild(content.rewards);
        }

        if (styles.discountLabel) {
            content.discountLabel = this.generateText("-70%", styles.discountLabel);
            content.addChild(content.discountLabel);
        }

        if (styles.Title) {
            content.title = this.generateText(pack.title, styles.Title);
            content.addChild(content.title);
        }

        return content;
    },

    applyTextStyles: function (textNode, styles) {
        styles.fitTo && textNode.fitTo(styles.fitTo.width, styles.fitTo.height);
        styles.lineHeight && textNode.setLineHeight && textNode.setLineHeight(styles.lineHeight);
    },

    generateAnimation: function (pack, styles) {
        styles = Object.assign({}, styles.default || {}, styles[pack.key] || {});

        var animation = new cleverapps.Spine(bundles.starter_pack.jsons.pack_json);
        animation.setPositionRound({ align: "center", dx: styles.dx || 0 }, { align: "center", dy: styles.dy || 0 });

        if (styles.introAnimation) {
            animation.setAnimationAndIdleAfter(styles.introAnimation, styles.idleAnimation);
        } else {
            animation.setAnimation(0, styles.idleAnimation, true);
        }

        return animation;
    },

    generateText: function (text, styles) {
        var node = cleverapps.UI.generateTTFText(text, cleverapps.styles.FONTS.PACKWINDOW_TEXT);

        this.applyTextStyles(node, styles);

        node.setAnchorPoint2();
        node.setPositionRound({ align: "center", dx: styles.dx || 0 }, { align: "center", dy: styles.dy || 0 });

        return node;
    },

    generateRewards: function (pack, styles) {
        styles = cleverapps.clone(styles);

        var rewardsPositions = Object.assign({}, styles.positions.default || {}, styles.positions[pack.key] || {});

        var rewards = new cc.Node();
        rewards.setAnchorPoint2();
        rewards.setPositionRound({ align: "center" }, { align: "center" });

        var appendReward = function (text, position) {
            var reward = cleverapps.UI.generateTTFText(text, cleverapps.styles.FONTS.PACKWINDOW_LABEL_TEXT);

            if (position.rotation) {
                reward.setRotation(position.rotation);
            }

            this.applyTextStyles(reward, styles);

            reward.setAnchorPoint2();
            reward.setPositionRound(position);
            rewards.addChild(reward);
        };

        for (var rewardType in pack.reward) {
            var reward = pack.reward[rewardType];
            var rewardPosition = rewardsPositions[rewardType];

            if (rewardPosition === undefined) {
                continue;
            }

            if (rewardType === "boosters") {
                for (var boosterType in reward) {
                    var booster = reward[boosterType],
                        boosterPosition = rewardPosition[boosterType];

                    if (boosterPosition === undefined) {
                        continue;
                    }
                    appendReward.call(this, "x" + booster, boosterPosition);
                }
            } else if (rewardType === "unlimitedLives" || rewardType === "worker") {
                appendReward.call(this, Product.FormatTimePeriod(reward).title, rewardPosition);
            } else if (rewardType === "troopCards") {
                appendReward.call(this, "x" + reward.amount, rewardPosition);
            } else {
                appendReward.call(this, "x" + reward, rewardPosition);
            }
        }

        return rewards;
    },

    buyPackProduct: function () {
        var pack = cleverapps.packManager.get();

        pack.buy(function (success) {
            if (success) {
                if (!this.closed) {
                    this.close();
                }
                cleverapps.packManager.nextPack();
            }
        }.bind(this));
    }
});

PackWindow.prototype.listBundles = function () {
    return ["starter_pack"];
};

cleverapps.styles.COLORS = cleverapps.overrideColors(cleverapps.styles.COLORS, {
    PACKWINDOW_TITLE_SHADOW: new cc.Color(0, 0, 0, 100)
});

cleverapps.styles.DECORATORS = cleverapps.overrideStyles(cleverapps.styles.DECORATORS, {
    PACKWINDOW_TITLE_STROKE: {
        size: 1,
        color: cleverapps.styles.COLORS.PACKWINDOW_TITLE_SHADOW
    },
    PACKWINDOW_LABEL_STROKE: {
        color: cleverapps.styles.COLORS.BLACK,
        size: 3
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    PACKWINDOW_TITLE_TEXT: {
        size: 70,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.PACKWINDOW_TITLE_STROKE
    },
    PACKWINDOW_LABEL_TEXT: {
        size: 60,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.PACKWINDOW_LABEL_STROKE
    },
    PACKWINDOW_TEXT: {
        size: 80,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: {
            color: new cc.Color(85, 1, 91),
            size: 3
        },
        shadow: {
            color: new cc.Color(85, 1, 91),
            direction: cc.size(0, -5),
            blur: 1
        }
    }
});

cleverapps.styles.PackWindow = {
    noBackground: true,
    title: undefined,

    button: {
        width: 300,
        height: 100,
        x: 0,
        y: 50
    },

    Title: undefined,
    discountLabel: undefined,
    animation: undefined,
    rewards: undefined
};
