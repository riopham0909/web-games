/**
 * Created by vladislav on 25.01.2022
 */

cleverapps.overrideStyles(cleverapps.styles.Decorators, {
    xmas_window_right_top: {
        type: Decors.TYPE_ANIMATION,
        json: bundles.windows.jsons.xmas_window_title,
        animation: "right",
        x: { align: "right", dx: 85 },
        y: { align: "top", dy: 30 },
        lovesBackground: true
    },

    xmas_window_right_bottom: {
        type: Decors.TYPE_ANIMATION,
        json: bundles.windows.jsons.xmas_window,
        animation: "down_right",
        x: { align: "right", dx: 11 },
        y: { align: "bottom", dy: -18 },
        lovesBackground: true
    },

    xmas_window_left_bottom: {
        type: Decors.TYPE_ANIMATION,
        json: bundles.windows.jsons.xmas_window,
        animation: "down_left",
        x: { align: "left", dx: -18 },
        y: { align: "bottom", dy: -23 },
        lovesBackground: true
    },

    xmas_window_left_top: {
        type: Decors.TYPE_ANIMATION,
        json: bundles.windows.jsons.xmas_window_title,
        animation: "left",
        x: { align: "left", dx: -88 },
        y: { align: "top", dy: 30 },
        lovesBackground: true
    },

    shadow_liana_left: {
        lovesWindow: true,
        type: Decors.TYPE_ANIMATION,
        json: bundles.windows.jsons.shadow_liana_left,
        animation: "open",
        idle: "idle",
        position: [{
            x: { align: "center", anchor: "right", dx: -700 },
            y: { align: "top", dy: 230 }
        }, {
            x: { align: "center", anchor: "right", dx: -700 },
            y: { align: "top", dy: 230 }
        }, {
            x: { align: "left", dx: -160 },
            y: { align: "top", dy: 230 }
        }]
    },

    shadow_liana_right: {
        lovesWindow: true,
        type: Decors.TYPE_ANIMATION,
        json: bundles.windows.jsons.shadow_liana_right,
        animation: "open",
        idle: "idle",
        position: [{
            x: { align: "center", anchor: "left", dx: 700 },
            y: { align: "top", dy: 130 }
        }, {
            x: { align: "center", anchor: "left", dx: 700 },
            y: { align: "top", dy: 130 }
        }, {
            x: { align: "right", dx: 160 },
            y: { align: "top", dy: 130 }
        }]
    },

    aquatic_flower: {
        lovesWindow: true,
        type: Decors.TYPE_ANIMATION,
        json: bundles.windows.jsons.aquatic_flower,
        animation: "open",
        idle: "animation",
        position: [{
            x: { align: "center", dx: 640 },
            y: { align: "bottom", dy: -5 }
        }, {
            x: { align: "center", dx: 640 },
            y: { align: "bottom", dy: -5 }
        }, {
            x: { align: "right", dx: 30 },
            y: { align: "bottom", dy: -5 }
        }]
    },

    shop_bonusSale_decor: {
        type: Decors.TYPE_SCALE9,
        width: 450,
        image: bundles.tile_shop.frames.bonussale_decor,
        x: { align: "left", dx: -32 },
        y: { align: "top", dy: 26 },
        filter: function (tileModel) {
            return PeriodicSaleLogic.NeedTileDecor(tileModel);
        },
        content: {
            generator: PeriodicSaleLogic.TileDecorGenerator,
            x: { align: "center", dx: 5 },
            y: { align: "center", dy: 3 },
            margin: { x: 15, y: 0 },
            textMargin: 0,
            iconWrap: { height: 30 }
        }
    },

    halloween_window_candle_right: {
        image: bundles.windows.frames.candle_decor,
        type: Decors.TYPE_IMAGE,
        x: { align: "right", dx: -125 },
        y: { align: "top", dy: 120 },
        lovesBackground: true,
        scale: {
            x: 1,
            y: 1
        }
    },

    halloween_window_lian_left: {
        image: bundles.windows.frames.lian_down_decor,
        type: Decors.TYPE_IMAGE,
        x: { align: "left", dx: 60 },
        y: { align: "bottom", dy: -98 },
        lovesBackground: true,
        scale: {
            x: 1,
            y: 1
        }
    },

    halloween_window_lian_top: {
        image: bundles.windows.frames.lian_left_decor,
        type: Decors.TYPE_IMAGE,
        x: { align: "left", dx: 86 },
        y: { align: "top", dy: 69 },
        lovesBackground: true,
        scale: {
            x: 1,
            y: 1
        }
    },

    halloween_window_lian_bottom: {
        image: bundles.windows.frames.lian_right_decor,
        type: Decors.TYPE_IMAGE,
        x: { align: "right", dx: 94 },
        y: { align: "bottom", dy: -40 },
        lovesBackground: true,
        scale: {
            x: 1,
            y: 1
        }
    }
});

cleverapps.overrideStyles(cleverapps.styles.SceneDecors, {
    xmas_menubar: {
        image: bundles.menubar.frames.xmas_menubar,
        x: { align: "left", dx: 25 },
        y: { align: "top", dy: 17 }
    },

    xmas_menubar_level: {
        image: bundles.menubar.frames.xmas_menubar_level,
        x: { align: "left", dx: 49 },
        y: { align: "top", dy: 20 }
    },

    xmas_control_buttons: {
        image: bundles.controlbuttons.frames.xmas_control_buttons,
        x: { align: "center", dx: 0 },
        y: { align: "top", dy: 9 }
    },

    xmas_sidebar: {
        image: bundles.sidebar.frames.xmas_sidebar,
        x: { align: "center", dx: -2 },
        y: { align: "bottom", dy: -3 }
    },

    xmas_toolbar: [{
        image: bundles.toolbar.frames.xmas_toolbar,
        x: { align: "left", dx: -29 },
        y: { align: "top", dy: 34 }
    }, {
        image: bundles.toolbar.frames.xmas_toolbar,
        x: { align: "right", dx: 29 },
        y: { align: "top", dy: 33 },
        scale: {
            x: -1,
            y: 1
        }
    }]
});
