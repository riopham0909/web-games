/**
 * Created by r4zi4l on 07.09.2021
 */

var SoftCurrencyTile = BaseProductTile.extend({
    ctor: function (tileModel, options) {
        var styles = SoftCurrencyTile.styles = SoftCurrencyTile.styles || cleverapps.overrideStyles(cleverapps.styles.BaseProductTile, cleverapps.styles.SoftCurrencyTile, true);

        options = options || {};
        options.noTileClick = true;
        options.iconSkipScale = true;
        options.iconAnimationOverride = tileModel.product.animation ? {
            json: bundles.tile_shop.jsons.shop_lives_animations_json,
            delay: 0
        } : {};

        this._super(tileModel, styles, options);
    },

    createTitle: function () {
        return this.createRewards(cleverapps.styles.FONTS.TILE_SHOP_COINS_OFFER);
    }
});

cleverapps.styles.SoftCurrencyTile = {

};
