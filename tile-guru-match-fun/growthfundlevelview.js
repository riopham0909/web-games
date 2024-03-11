/**
 * Created by iamso on 18.08.2021
 */

var GrowthFundLevelView = cc.Node.extend({
    ctor: function (data) {
        this._super();
        this.data = data;
        this.state = data.state;

        this.setAnchorPoint2();
        this.setContentSize2(cleverapps.styles.GrowthFundLevelView);

        this.createContent();
    },

    createContent: function () {
        var styles = cleverapps.styles.GrowthFundLevelView;

        var insufficient = cleverapps.growthFund.findFirst(GrowthFund.STATE.INSUFFICIENT);
        this.reached = !insufficient || this.data.levelNo < insufficient.levelNo;

        var bg = this.bg = cleverapps.UI.createScale9Sprite(bundles.growth_fund.frames.lvl_bg, cleverapps.UI.Scale9Rect.TwoPixelXY);
        bg.setContentSize2(this.getContentSize());
        this.addChild(bg);
        bg.setPositionRound(this.width / 2, this.height / 2);

        if (bundles.growth_fund.frames.lvl_icon_bg) {
            var iconBg = cleverapps.UI.createScale9Sprite(bundles.growth_fund.frames.lvl_icon_bg, cleverapps.UI.Scale9Rect.TwoPixelXY);
            iconBg.setContentSize2(styles.iconBg);
            iconBg.setPositionRound(styles.iconBg);
            bg.addChild(iconBg);

            bg.setCascadeOpacityEnabled(true);
            bg.setCascadeColorEnabled(true);
        }

        this.createReward();
        this.createTitle();
        this.createIcon();
        this.setState();

        if (!this.reached) {
            this.paintInsufficient();
        }
    },

    createReward: function () {
        var styles = cleverapps.styles.GrowthFundLevelView.rewards;

        var rewardsTitle = cleverapps.UI.generateOnlyText("RewardsListComponent.rewardTitle", this.reached ? cleverapps.styles.FONTS.GROWTH_FUND_LEVEL_REWARD_REACHED : cleverapps.styles.FONTS.GROWTH_FUND_LEVEL_REWARD);
        var rewardsList = this.rewardsList = new RewardsListComponent({ hard: this.data.reward }, {
            font: this.reached ? cleverapps.styles.FONTS.GROWTH_FUND_LEVEL_VALUE_REACHED : cleverapps.styles.FONTS.GROWTH_FUND_LEVEL_VALUE,
            margin: styles.margin,
            noPrefix: true,
            textDirection: cleverapps.UI.HORIZONTAL,
            textMargin: styles.textMargin,
            icons: {
                hard: bundles.growth_fund.frames.rubies
            },
            small: true
        });

        var rewards = new cleverapps.Layout([rewardsTitle, rewardsList], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.margin.x
        });
        this.addChild(rewards);
        rewards.setPositionRound(styles);
    },

    createTitle: function () {
        var styles = cleverapps.styles.GrowthFundLevelView.title;
        var msg = "GrowthFundWindow.reach";
        var font = cleverapps.styles.FONTS.GROWTH_FUND_LEVEL_TITLE;

        if (this.reached) {
            msg = "GrowthFundWindow.reached";
            font = cleverapps.styles.FONTS.GROWTH_FUND_LEVEL_TITLE_REACHED;
        }

        var title = this.title = cleverapps.UI.generateOnlyText(msg, font, {
            level: this.data.levelNo + 1
        });

        title.fitTo(styles.maxWidth);
        this.addChild(title);
        title.setPositionRound(styles);
    },

    createIcon: function () {
        var styles = cleverapps.styles.GrowthFundLevelView.icon;

        var icon = new cc.Sprite(bundles.growth_fund.frames.rubies_heap);
        this.addChild(icon);
        icon.setPositionRound(styles);
        this.icon = icon;
    },

    setState: function () {
        cleverapps.tooltipManager.remove(this);
        cc.eventManager.removeListeners(this);
        var toolTip;

        switch (this.data.state) {
            case GrowthFund.STATE.INSUFFICIENT:
                toolTip = Messages.get("GrowthFundWindow.insufficient");
                this.createMark();
                break;
            case GrowthFund.STATE.WAITING:
                toolTip = Messages.get("GrowthFundWindow.getPrevious", {
                    level: cleverapps.growthFund.findFirst(GrowthFund.STATE.READY).levelNo + 1
                });
                this.createButton();
                break;
            case GrowthFund.STATE.READY:
                this.createButton();
                break;
            case GrowthFund.STATE.RECEIVED:
                this.createMark();
                break;
        }

        if (toolTip) {
            cleverapps.tooltipManager.create(this.button || this.mark, {
                text: toolTip,
                position: cleverapps.styles.UI.Tooltip.LOCATION.above
            });
        }
    },

    createButton: function () {
        var styles = cleverapps.styles.GrowthFundLevelView.button;
        this.button = new cleverapps.UI.Button({
            width: styles.width,
            height: styles.height,
            text: "Claim",
            onClicked: this.onClick.bind(this)
        });
        this.addChild(this.button);
        this.button.setPositionRound(styles);
    },

    onClick: function () {
        if (cleverapps.growthFund.isBought()) {
            if (this.data.state === GrowthFund.STATE.READY) {
                if (Game.currentGame) {
                    this.rewardsList.receiveRewards();
                    this.rewardsList.receiveRewardsAnimation({
                        noFadeOut: true
                    });
                } else {
                    cleverapps.user.earnHard(cleverapps.EVENTS.EARN.GROWTH_FUND, this.data.reward);
                }

                cleverapps.growthFund.takeReward(this.data.levelNo);
            }
        } else {
            new GrowthFundBuyWindow();
        }
    },

    createMark: function () {
        var img = bundles.growth_fund.frames[this.data.state === GrowthFund.STATE.RECEIVED ? "checkmark" : "lock"];
        var mark = this.mark = new cc.Sprite(img);
        this.addChild(mark);
        mark.setPositionRound(cleverapps.styles.GrowthFundLevelView.mark);
    },

    updateState: function () {
        if (this.state !== this.data.state || this.state === GrowthFund.STATE.WAITING) {
            this.state = this.data.state;
            this.removeAllChildren(true);
            this.createContent();
        }
    },

    paintInsufficient: function () {
        var paint = function (item) {
            item.setColor(new cc.Color(180, 180, 180, 255));
            item.setOpacity(140);
        };
        paint(this.bg);
        paint(this.icon);
        for (var key in this.rewardsList.targets) {
            paint(this.rewardsList.targets[key].icon);
        }
    }
});

cleverapps.styles.GrowthFundLevelView = {
    width: 960,
    height: 150,

    title: {
        maxWidth: 490,
        x: { align: "left", dx: 175 },
        y: { align: "center", dy: 25 }
    },

    icon: {
        width: 130,
        height: 130,
        x: { align: "left", dx: 25 },
        y: { align: "center", dy: 0 }
    },

    rewards: {
        margin: {
            x: 10
        },
        textMargin: 0,
        x: { align: "left", dx: 175 },
        y: { align: "center", dy: -25 }
    },

    mark: {
        x: { align: "right", dx: -134 },
        y: { align: "center" }
    },

    button: {
        width: 200,
        height: 80,
        x: { align: "right", dx: -68 },
        y: { align: "center" }
    }
};
