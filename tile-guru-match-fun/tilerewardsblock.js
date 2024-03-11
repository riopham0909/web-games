/**
 * Created by Andrey Popov 20 apr 2020
 */

var TileRewardsBlock = cc.Node.extend({
    ctor: function (tileModel, options) {
        this._super();
        this.setAnchorPoint2();

        this.tileModel = tileModel;
        this.options = options || {};
        this.styles = cleverapps.styles.TileRewardsBlock;

        this.setContentSize2(this.options.size);
        this.setLocalZOrder(this.styles.zOrder);

        this.createRewards();
    },

    createRewards: function () {
        var noPrefix = cleverapps.config.type === "merge";
        var font = this.options.font || cleverapps.styles.FONTS.TILE_SHOP_OFFER_TEXT;

        var rewardsList = new RewardsListComponent(this.tileModel.getReward(), {
            wrapGrid: true,
            noPrefix: noPrefix,
            font: font,
            small: true,
            columns: this.options.columns || 2,
            textDirection: cleverapps.UI.HORIZONTAL,
            textMargin: this.styles.amountMargin,
            margin: {
                x: this.styles.colMargin,
                y: this.styles.rowMargin
            },
            icons: this.options.icons || {
                hard: bundles.reward_icons.frames.shop_gold_png
            }
        });

        var paddingX = this.options.paddingX || this.styles.paddingX;
        var paddingY = this.options.paddingY || 0;
        cleverapps.UI.fitToBox(rewardsList, {
            width: this.options.size.width - paddingX,
            height: this.options.size.height - paddingY
        });
        rewardsList.setPositionRound(this.styles.rewardList);
        this.addChild(rewardsList);
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    TILE_SHOP_OFFER_TEXT: {
        name: "default",
        size: 40,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.TileRewardsBlock = {
    width: 360,
    height: 180,
    rowMargin: 5,
    colMargin: 5,
    amountMargin: 5,
    zOrder: 0,
    paddingX: 0,

    bg: {
        x: { align: "center" },
        y: { align: "center" }
    },

    rewardList: {
        x: { align: "center" },
        y: { align: "center" }
    }
};
