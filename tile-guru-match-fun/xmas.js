/**
 * Created by mac on 1/30/20
 */

cleverapps.SkinManager.SKINS.xmas = {
    bundle: "xmas",
    localization: {},
    slots: {
        localization: function () {},
        windowDecors: function (options) {
            var decors = cleverapps.clone(options.decors || {}, true);

            decors.xmas_window_top = true;
            decors.xmas_window_title_right = true;
            decors.xmas_window_title_left = true;
            decors.xmas_window_right_top = true;
            decors.xmas_window_right_bottom = true;
            decors.xmas_window_left_bottom = true;
            decors.xmas_window_left_top = true;
            decors.xmas_window_alternative_title_right = true;
            decors.xmas_window_alternative_title_left = true;

            if (cleverapps.config.ui === "tropical") {
                decors.decor_title_right = false;
                decors.decor_title_left = false;
                decors.window_liana_top_left = false;
                decors.window_liana_top_right = false;
                decors.window_liana_left = false;
                decors.window_liana_right = false;
                decors.window_liana_bottom_left = false;
                decors.window_liana_bottom_right = false;
            }

            if (cleverapps.config.ui === "wooden" && (typeof OrdersWindow !== "undefined" && options.window instanceof OrdersWindow)) {
                decors.xmas_window_right_top = false;
                decors.xmas_window_right_bottom = false;
                decors.xmas_window_left_bottom = false;
                decors.xmas_window_left_top = false;
            }

            if (cleverapps.config.name === "mergecraft"
                && ((typeof BuildPassWindow !== "undefined" && options.window instanceof BuildPassWindow) 
                || (typeof SalePassWindow !== "undefined" && options.window instanceof SalePassWindow))) {
                decors.xmas_window_right_top = false;
                decors.xmas_window_left_top = false;

                decors.xmas_window_right_top_bgonly = true;
                decors.xmas_window_left_top_bgonly = true;
            }

            if (cleverapps.config.ui === "riddles" && (typeof UnitsLibraryWindow !== "undefined" && options.window instanceof UnitsLibraryWindow)) {
                decors.xmas_window_left_bottom = false;
            }

            return decors;
        },
        menuBarItem: function () {
            return cleverapps.styles.SceneDecors.xmas_menubar;
        },
        menuBarLevelItem: function () {
            return cleverapps.styles.SceneDecors.xmas_menubar_level;
        },
        sidebarBg: function () {
            return bundles.sidebar.frames.xmas_sidebar_bg;
        },
        sidebarIcon: function () {
            return cleverapps.styles.SceneDecors.xmas_sidebar;
        },
        toolbarDecors: function () {
            return cleverapps.styles.SceneDecors.xmas_toolbar;
        },
        sceneControlButton: function () {
            return cleverapps.styles.SceneDecors.xmas_control_buttons;
        },
        spine: function (options) {
            var spines = {};
            if (["heroes", "riddles"].indexOf(cleverapps.config.name) !== -1) {
                spines[bundles.heroes.jsons.A_hero_spine_json] = bundles.xmas.jsons.A_hero_spine_json;
                spines[bundles.heroes.jsons.B_hero_spine_json] = bundles.xmas.jsons.B_hero_spine_json;
                spines[bundles.heroes.jsons.C_hero_spine_json] = bundles.xmas.jsons.C_hero_spine_json;
                spines[bundles.heroes.jsons.D_hero_spine_json] = bundles.xmas.jsons.D_hero_spine_json;
                spines[bundles.heroes.jsons.E_hero_spine_json] = bundles.xmas.jsons.E_hero_spine_json;
                spines[bundles.heroes.jsons.W_hero_spine_json] = bundles.xmas.jsons.W_hero_spine_json;
            }

            return spines[options.json] ? spines[options.json] : options.json;
        }
    }
};
