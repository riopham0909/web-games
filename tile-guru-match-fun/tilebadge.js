/**
 * Created by Andrey Popov 20 apr 2020
 */

var TileBadge = cc.Sprite.extend({
    ctor: function (options) {
        options = options || {};

        this._super(options.image || bundles.badge.frames.badge_png);

        var styles = cleverapps.styles.TileBadge;
        var rotation = options.rotation !== undefined ? options.rotation : styles.rotation;

        if (options.icon) {
            options.icon.setPositionRound(styles.icon);
            options.icon.setRotation(rotation * -1);
            this.addChild(options.icon);
        } else {
            var font = options.largeFont ? cleverapps.styles.FONTS.TILE_SHOP_BADGE_BIG : cleverapps.styles.FONTS.TILE_SHOP_BADGE_TEXT;
            var text = cleverapps.UI.generateOnlyText(this.chooseText(options), font);
            text.setPositionRound(styles);
            text.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            text.fitTo(styles.width, styles.height);
            text.setRotation(styles.text.rotation);
            this.addChild(text);
        }

        if (options.tooltipText) {
            cleverapps.tooltipManager.create(this, {
                text: Messages.get(options.tooltipText),
                position: styles.tooltip.position,
                size: styles.tooltip.size
            });
        }

        if (options.clickAction) {
            this.createFinger();
            cleverapps.UI.applyHover(this);
            cleverapps.UI.onClick(this, options.clickAction);
        }

        this.setRotation(rotation);
    },

    disable: function () {
        this.setSpriteFrame(bundles.badge.frames.badge_off_png);
    },

    chooseText: function (options) {
        if (options.type === "discount") {
            return Messages.get("Badge.discount", {
                amount: options.text
            });
        }

        if (options.type === "save") {
            return "Badge.save";
        }

        if (options.type === "bestSeller") {
            return "Badge.bestSeller";
        }

        if (options.type === "value") {
            return Messages.get("Badge.Value", {
                amount: options.value
            });
        }

        return options.text || "default";
    },

    createIcon: function (options) {
        if (options.type === "clangift") {
            return new cc.Sprite(bundles.reward_icons.frames.clan_gift_png);
        }
    },

    createFinger: function () {
        FingerView.hintClick(this, {
            delay: 0.8,
            runOnce: true
        });
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    TILE_SHOP_BADGE_TEXT: {
        size: 25,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.TILE_SHOP_BADGE_STROKE
    },

    TILE_SHOP_BADGE_BIG: {
        size: 50,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.TILE_SHOP_BADGE_STROKE
    }
});

cleverapps.styles.TileBadge = {
    x: { align: "center", dx: 0 },
    y: { align: "center", dy: 10 },
    width: 125,
    text: {
        rotation: 0
    },
    rotation: 30,

    tooltip: {
        position: {
            x: { align: "center", dx: -75 },
            y: { align: "top", dy: 50 }
        },
        size: {
            width: 500,
            height: 100
        }
    },

    icon: {
        x: { align: "center", dx: -2 },
        y: { align: "center", dy: 8 }
    }
};
