/**
 * Created by iamso on 10.08.2021
 */

var SubscriptionTile = BaseProductTile.extend({
    ctor: function (tileModel, options) {
        var styles = SubscriptionTile.styles = SubscriptionTile.styles || cleverapps.overrideStyles(cleverapps.styles.BaseProductTile, cleverapps.styles.SubscriptionTile, true);

        options = options || {};
        options.onClicked = this.onClick.bind(this);
        options.iconZOrder = styles.icon.zOrder;

        this._super(tileModel, styles, options);
    },

    createDescription: function () {
        var styles = this.styles.description;

        var node = new cc.Node();
        node.setAnchorPoint2();
        node.setContentSize2(styles);

        if (bundles.tile_shop.frames.prem_rewards_bg) {
            var bg = cleverapps.UI.createScale9Sprite(bundles.tile_shop.frames.prem_rewards_bg, cleverapps.UI.Scale9Rect.TwoPixelY);
            bg.setContentSize2(styles);
            node.addChild(bg);
            bg.setPositionRound(node.width / 2, node.height / 2);

            if (!this.tileModel.isAvailable()) {
                bg.setOpacity(160);
                bg.setColor(new cc.Color(200, 200, 200, 255));
            }
        }

        var description = this.tileModel.getDescription();
        var content;

        var timeLeft = cleverapps.subscription.getLeftTime();

        if (description.title) {
            content = cleverapps.UI.generateOnlyText(description.title, cleverapps.styles.FONTS.TILE_REWARDS_HEADER);
            content.setDimensions(styles.NATextWidth, 0);
            content.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            content.fitTo(undefined, node.height * 0.9);
        } else if (timeLeft) {
            content = this.createTimer(timeLeft);
        } else {
            content = new TileRewardsBlock(this.tileModel, {
                size: this.styles.description,
                font: cleverapps.styles.FONTS.TILE_REWARDS,
                columns: cleverapps.config.name === "tripeaks" ? 3 : 2,
                icons: {
                    treasure: bundles.reward_icons.frames.treasure_chest_png
                }
            });
        }

        content.setPositionRound(styles.content);
        node.addChild(content);

        return node;
    },

    getTitleImage: function () {
        return bundles.tile_shop.frames.prem_title_bg || BaseProductTile.prototype.getTitleImage.call(this);
    },

    createIcon: function () {
        var tileIcon = this._super();
        if (this.tileModel.isAvailable()) {
            var iconHighlight = new cleverapps.Spine(bundles.tile_shop.jsons.shop_sparkles_large_json);
            iconHighlight.setAnimation(0, "animation", true);
            tileIcon.icon.addChild(iconHighlight, cleverapps.styles.SubscriptionTile.icon.animation.zOrder);
            iconHighlight.setPositionRound(tileIcon.icon.width / 2, tileIcon.icon.height / 2);
        }
        return tileIcon;
    },

    createTimer: function (timeLeft) {
        var styles = this.styles.description;

        var countdown = new cleverapps.CountDownView(new cleverapps.CountDown(timeLeft, {
            onFinish: this.tileModel.updateModelState.bind(this.tileModel)
        }), {
            font: cleverapps.styles.FONTS.TILE_REWARDS
        });

        var icon = new cc.Sprite(bundles.timer.frames.timer_png);
        icon.setScale(styles.timer.scale);
        var iconAndTimer = new cleverapps.Layout([icon, countdown], {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.timer.margin
        });

        var header = cleverapps.UI.generateOnlyText("TileShop.subscription.next", cleverapps.styles.FONTS.TILE_REWARDS_HEADER);
        header.fitTo(styles.text.width);

        return new cleverapps.Layout([header, iconAndTimer], {
            margin: styles.margin,
            direction: cleverapps.UI.VERTICAL
        });
    },

    createButton: function () {
        var button = this.button = new TileButton(this.tileModel, {
            textOff: this.tileModel.getDisabledPrice(),
            text: this.tileModel.getCurrentActionText(),
            onClicked: this.onClick.bind(this)
        });
        button.setLocalZOrder(1);

        if (!this.tileModel.isAvailable()) {
            button.disable();
        }

        return button;
    },

    onClick: function () {
        this.removeFinger();

        if (cleverapps.subscription.isRewardReady()) {
            cleverapps.subscription.receiveReward();
        } else {
            new SubscriptionWindow();
        }
        this.tileModel.onClaim();
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    TILE_REWARDS: {
        name: "default",
        size: 45,
        color: cleverapps.styles.COLORS.WHITE
    },

    TILE_REWARDS_HEADER: {
        name: "default",
        size: 35,
        color: cleverapps.styles.COLORS.WHITE
    }
});

cleverapps.styles.SubscriptionTile = {

    background: {
        adjustBackgroundCapInsets: true,
        tileBg: bundles.tile_shop.frames.prem_tile_bg
    },

    description: {
        width: 360,
        height: 180,
        margin: 0,
        rewardsMargin: {
            x: 5,
            y: 5
        },
        amountMargin: 0,
        content: {
            x: { align: "center" },
            y: { align: "center" }
        },
        NATextWidth: 300,
        timer: {
            margin: 10,
            scale: 1.3
        },
        text: {
            width: 350
        }
    },

    icon: {
        zOrder: -1,
        animation: {
            zOrder: -1
        }
    }
};
