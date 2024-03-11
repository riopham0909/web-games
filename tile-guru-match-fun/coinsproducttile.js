/**
 * Created by vladislav on 23.08.2019
 */

var CoinsProductTile = BaseProductTile.extend({
    ctor: function (tileModel, options) {
        var styles = CoinsProductTile.styles = CoinsProductTile.styles || cleverapps.overrideStyles(cleverapps.styles.BaseProductTile, cleverapps.styles.CoinsProductTile, true);

        this._super(tileModel, styles, options);
    },

    createTitle: function () {
        if (!this.styles.title) {
            return;
        }

        return this.createRewards(cleverapps.styles.FONTS.TILE_SHOP_COINS_OFFER);
    },

    createDescription: function () {
        if (!this.styles.description) {
            return;
        }

        return this.createRewards(cleverapps.styles.FONTS.TILE_SHOP_COINS_OFFER);
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    PRODUCT_TILE_LIMIT_TEXT: {
        size: 35,
        color: cleverapps.styles.COLORS.COLOR_WINDOW_TEXT,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    }
});

cleverapps.styles.CoinsProductTile = {

};
