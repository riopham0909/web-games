/**
 * Created by Andrey Popov 20 apr 2020
 */

var TileIcon = cc.Node.extend({
    ctor: function (tileModel, options) {
        this._super();
        options = options || {};

        var styles = cleverapps.styles.TileIcon;

        this.tileModel = tileModel;
        var image = bundles.tile_shop.frames[tileModel.getIcon()];
        var icon = this.icon = new cc.Sprite(image);
        var height = styles[tileModel.product.itemId] && styles[tileModel.product.itemId].height || styles.height;

        if (!options.skipScale) {
            if (styles.scale) {
                icon.setScale(styles.scale);
            } else if (height) {
                var scale = height / icon.height;
                if (scale < 1) {
                    icon.setScale(scale);
                }
            }
        }

        var animation = {
            json: bundles.tile_shop.jsons.shop_sparkles_large_json
        };
        if (options.animationOverride) {
            animation = options.animationOverride;
        }
        if (animation.json) {
            var animationSpine = this.animation = new cleverapps.Spine(animation.json);
            animationSpine.setPosition(icon.width / 2, icon.height / 2);
            animationSpine.setLocalZOrder(animation.jsonzOrder || 0);
            animationSpine.setAnimation(0, "animation", true);
            animationSpine.setVisible(false);
            icon.addChild(animationSpine);

            var delay = animation.delay !== undefined ? animation.delay : Math.random();
            animationSpine.runAction(new cc.Sequence(
                new cc.DelayTime(delay),
                new cc.Show()
            ));
        }

        var dx = styles[tileModel.product.itemId] ? styles[tileModel.product.itemId].wrap.dx || 0 : styles.wrap.dx;
        var dy = styles[tileModel.product.itemId] ? styles[tileModel.product.itemId].wrap.dy || 0 : styles.wrap.dy;

        this.setContentSize2(icon.width, styles[tileModel.product.itemId] && styles[tileModel.product.itemId].wrap.height || styles.wrap.height);
        this.setAnchorPoint2();
        this.setLocalZOrder(options.zOrder || 0);
        icon.setAnchorPoint2(0.5, 0);
        icon.setPositionRound(this.width / 2 + dx, dy);
        this.addChild(icon);
    },

    enable: function () {
        this.icon.setColor(new cc.Color(255, 255, 255, 255));
        this.icon.setOpacity(255);

        if (this.animation) {
            this.animation.setVisible(true);
        }
    },

    disable: function () {
        this.icon.setColor(new cc.Color(200, 200, 200, 255));
        this.icon.setOpacity(180);

        if (this.animation) {
            this.animation.stopAllActions();
            this.animation.setVisible(false);
        }
    }
});

cleverapps.styles.TileIcon = {
    scale: 1,
    wrap: {
        height: 270,
        dx: 0,
        dy: -24
    }
};