/**
 * Created by andrey on 18.01.2021.
 */

var ShadowLayer = cc.Scale9Sprite.extend({
    ctor: function () {
        var bgSize = this.baseSize = cleverapps.UI.getBgSize();
        this._super(bundles.pixel.frames.pixel_png);
        this.setColor(cleverapps.styles.COLORS.BLACK);
        this.setContentSize(bgSize.width * 1.05 + 5, bgSize.height * 1.05 + 5);
        this.setAnchorPoint2(0, 0);
        this.setPosition(-bgSize.width * 0.025 - 2, -bgSize.height * 0.025 - 2);
    },

    updateSize: function () {
        var newSize = cleverapps.UI.getBgSize();
        var parentScale = cc.Base.GetHierarchyScale(this.parent);
        newSize.width /= parentScale.x;
        newSize.height /= parentScale.y;

        var w = Math.max(newSize.width / this.baseSize.width, this.baseSize.width / newSize.width);
        var h = Math.max(newSize.height / this.baseSize.height, this.baseSize.height / newSize.height);
        this.setScale(w * h);

        this.setPositionRound(this.parent.convertToNodeSpace(cc.p(-newSize.width * 0.025 - 2, -newSize.height * 0.025 - 2)));
    },

    updatePosition: function () {
        this.updateSize();
    }
});