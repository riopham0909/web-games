/**
 * Created by spepa on 20.12.2022
 */

var PeriodicSaleWindow = Window.extend({
    onWindowLoaded: function (mission) {
        this.logic = mission.logic;

        this._super({
            name: "PeriodicSaleWindow",
            noBackground: true,
            fireworks: true,
            content: this.createContent(),
            openSound: bundles.periodic_sale.urls.bonussale_showup_effect
        });

        this.setLocalZOrder(UpMenuContainer.ZORDER - 1);

        cleverapps.meta.hideAllControls();
        cleverapps.meta.showControlsWhileFocused(["MenuBarGoldItem", "MenuBarCoinsItem", "MenuBarLivesItem"]);
    },

    createContent: function () {
        var styles = cleverapps.styles.PeriodicSaleWindow;

        this.content = new cleverapps.Layout(this.createLots(), {
            direction: cleverapps.UI.HORIZONTAL,
            margin: styles.lotsMargin.x[cleverapps.resolution.mode],
            padding: styles.lotsPadding
        });

        this.createBg();
        this.createCustomTitle();
        return this.content;
    },

    updatePosition: function () {
        this._super();
        if (this.animatedBg) {
            this.animatedBg.setPositionRound(cleverapps.styles.PeriodicSaleWindow.bg.center);
        }
    },

    createBg: function () {
        var styles = cleverapps.styles.PeriodicSaleWindow.bg;

        var bg = this.animatedBg = new cleverapps.Spine(bundles.periodic_sale.jsons.bonussale_bg);
        bg.setAnimationAndIdleAfter("bg_open", "bg_idle");
        bg.setPositionRound(styles.center);
        this.addChild(bg);

        if (["riddles"].includes(cleverapps.config.ui) && cleverapps.resolution.mode !== cleverapps.WideMode.VERTICAL) {
            var left = new cleverapps.Spine(bundles.periodic_sale.jsons.bonussale_bg);

            left.setAnimation(0, "left", true);
            left.setPositionRound(styles.left);
            this.addChild(left);

            var right = new cleverapps.Spine(bundles.periodic_sale.jsons.bonussale_bg);
            right.setAnimation(0, "right", true);
            right.setPositionRound(styles.right);
            this.addChild(right);
        }
    },

    createCustomTitle: function () {
        var styles = cleverapps.styles.PeriodicSaleWindow.content.title;

        var titleBg = new cc.Node();
        if (["wooden", "heroes"].includes(cleverapps.config.ui)) {
            titleBg = cleverapps.UI.createScale9Sprite(bundles.periodic_sale.frames.shop_title, cleverapps.UI.Scale9Rect.TwoPixelXY);
            titleBg.setContentSize2(styles);
        }

        var title = cleverapps.UI.generateOnlyText("PeriodicSaleWindow.title", cleverapps.styles.FONTS.BONUSBG_TITLE);
        title.setPositionRound(styles.text);
        title.fitTo(styles.text.width, styles.text.height);

        titleBg.setPositionRound(styles);
        titleBg.addChild(title);

        this.content.addChild(titleBg);
    },

    createLots: function () {
        return this.logic.getLots().map(function (lot, ind) {
            var view = new BonusSaleLot(lot, this.logic);
            view.setLocalZOrder(-ind);
            return view;
        }.bind(this));
    },

    onClose: function () {
        if (this.logic.isAllSold()) {
            cleverapps.missionManager.remove(this.logic.mission);
        }
    },

    listBundles: function () {
        return ["periodic_sale"];
    }
});

cleverapps.overrideFonts(cleverapps.styles.FONTS, {
    BONUSBG_TITLE: {
        size: 100,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE
    },

    PERIODIC_LOT_AMOUNT: {
        name: "default",
        size: 65,
        color: cleverapps.styles.COLORS.WHITE,
        stroke: cleverapps.styles.DECORATORS.IMAGE_FONT_STROKE
    },

    PERIODIC_LOT_WAS: {
        name: "nostroke",
        size: 35,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR
    },

    VKDOG_DIALOGUE: {
        name: "nostroke",
        size: 29,
        color: cleverapps.styles.COLORS.DARK_TEXT_COLOR
    },

    BONUS_SALE_TIMER_TEXT: {
        size: 45,
        color: cleverapps.styles.COLORS.LIGHT_TEXT_COLOR,
        stroke: cleverapps.styles.DECORATORS.LIGHT_TEXT_STROKE,
        shadow: cleverapps.styles.DECORATORS.LIGHT_TEXT_SHADOW
    }
});

cleverapps.styles.PeriodicSaleWindow = {
    lotsMargin: {
        x: [50, 100, 100]
    },

    lotsPadding: {
        top: 140,
        bottom: 0
    },

    content: {
        title: {
            x: { align: "center", dx: 0 },
            y: { align: "top", dy: 70 },

            text: {
                x: { align: "center", dx: 0 },
                y: { align: "top", dy: -16 },
                width: 440
            },

            width: 900,
            height: 157
        },

        timer: {
            x: { align: "center", dx: 0 },
            y: { align: "top", dy: -122 }
        }
    },

    bg: {
        left: {
            x: { align: "left", dx: 0 },
            y: { align: "center", dy: 0 }
        },

        center: {
            x: { align: "center", dx: 0 },
            y: { align: "center", dy: 0 }
        },

        right: {
            x: { align: "right", dx: 0 },
            y: { align: "center", dy: 0 }
        }
    }
};
