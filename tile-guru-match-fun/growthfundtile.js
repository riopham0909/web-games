/**
 * Created by iamso on 18.08.2021
 */

var GrowthFundTile = BaseProductTile.extend({
    ctor: function (tileModel, options) {
        var styles = GrowthFundTile.styles = GrowthFundTile.styles || cleverapps.overrideStyles(cleverapps.styles.BaseProductTile, cleverapps.styles.GrowthFundTile, true);

        options = options || {};
        options.onClicked = this.onClick.bind(this);
        options.iconZOrder = styles.icon.zOrder;
        options.iconSkipScale = true;

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

        var info = cleverapps.UI.generateOnlyText(this.tileModel.getProductDescription(), cleverapps.styles.FONTS.TILE_REWARDS);
        info.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        info.setDimensions(styles.text.width, 0);
        info.fitTo(undefined, styles.text.height);

        node.addChild(info);
        info.setPositionRound(styles.text);

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
            tileIcon.icon.addChild(iconHighlight, cleverapps.styles.GrowthFundTile.icon.animation.zOrder);
            iconHighlight.setPositionRound(tileIcon.icon.width / 2, tileIcon.icon.height / 2);
        }
        return tileIcon;
    },

    createButton: function () {
        var textOff = Messages.get("TileShop.tile.level", {
            level: cleverapps.humanReadableNumber({ floatLevel: GrowthFund.LEVELS.available })
        });

        var text = "TileShop.growthFund.button";
        if (cleverapps.growthFund.findFirst(GrowthFund.STATE.READY) && cleverapps.growthFund.isBought()) {
            text = "Claim";
        }

        var button = new TileButton(this.tileModel, {
            onClicked: this.onClick.bind(this),
            textOff: textOff,
            text: text
        });
        button.setLocalZOrder(1);

        if (!this.tileModel.isAvailable()) {
            button.disable();
        }

        return button;
    },

    onClick: function () {
        new GrowthFundWindow();
    }
});

cleverapps.styles.GrowthFundTile = {
    width: 460,

    content: {
        margin: 10
    },

    background: {
        adjustBackgroundCapInsets: true,
        tileBg: bundles.tile_shop.frames.prem_tile_bg
    },

    icon: {
        zOrder: -1,
        animation: {
            zOrder: -1
        }
    },

    description: {
        height: 130,
        width: 380,
        text: {
            width: 325,
            height: 90,
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 0 }
        }
    },

    button: {
        txtWidth: 165,
        txtHeight: 75
    }
};
