/**
 * Created by vladislav on 23.08.2019
 */

var PackProductTile = BaseProductTile.extend({
    ctor: function (tileModel, options) {
        var styles = PackProductTile.styles = PackProductTile.styles || cleverapps.overrideStyles(cleverapps.styles.BaseProductTile, cleverapps.styles.PackProductTile, true);

        options = options || {};

        this._super(tileModel, styles, options);
    },

    createDescription: function () {
        return new TileRewardsBlock(this.tileModel, {
            size: cc.size(this.styles.description),
            font: cleverapps.styles.FONTS.PACK_TILE_REWARDS_TEXT,
            icons: {},
            paddingY: this.styles.description.paddingY
        });
    }
});

cleverapps.styles.PackProductTile = {

};
